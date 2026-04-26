/**
 * Data Migration Script: Strapi PostgreSQL → Prisma Schema
 *
 * This script reads data from the existing Strapi-managed PostgreSQL tables
 * and re-inserts it into the new Prisma-managed schema.
 *
 * Usage:
 *   1. Ensure the old Strapi DB is accessible
 *   2. Run: npx prisma db push  (creates new tables)
 *   3. Run: npx tsx scripts/migrate.ts
 *
 * The script handles:
 *   - Users (from up_users)
 *   - Categories
 *   - Products + Variants (from component join tables)
 *   - Collections, Banners, Colors
 *   - NewProducts
 *   - Carts + CartItems
 *   - Wishlists
 *   - Transactions + OrderItems
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as pg from 'pg';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Connect to the same database (Strapi tables still exist alongside new ones)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://idoidentity:idoidentity_pass@localhost:5432/db',
});

async function query(sql: string): Promise<any[]> {
  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (err) {
    console.warn(`  ⚠️  Query failed (table may not exist): ${(err as Error).message}`);
    return [];
  }
}

async function migrateUsers() {
  console.log('\n👤 Migrating Users...');
  const users = await query(`
    SELECT id, username, email, password, firstname, lastname, phone,
           address, provider, confirmed, blocked, created_at, updated_at,
           document_id
    FROM up_users ORDER BY id
  `);

  for (const u of users) {
    try {
      await prisma.user.upsert({
        where: { email: u.email },
        create: {
          id: u.id,
          documentId: u.document_id || undefined,
          username: u.username,
          email: u.email,
          password: u.password, // Already hashed by Strapi
          firstname: u.firstname || null,
          lastname: u.lastname || null,
          phone: u.phone || null,
          address: u.address || null,
          role: 'authenticated',
          provider: u.provider || 'local',
          confirmed: u.confirmed ?? true,
          blocked: u.blocked ?? false,
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped user ${u.email}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${users.length} users processed`);
}

async function migrateCategories() {
  console.log('\n📁 Migrating Categories...');
  const categories = await query(`
    SELECT id, category_name, type, published_at, created_at, updated_at, document_id
    FROM categories ORDER BY id
  `);

  // Also get media for categories
  const catMedia = await query(`
    SELECT f.url, fm.related_id
    FROM files f
    JOIN files_related_mph fm ON f.id = fm.file_id
    WHERE fm.related_type = 'api::category.category'
      AND fm.field = 'categoryPic'
  `);
  const catMediaMap = new Map(catMedia.map(m => [m.related_id, { url: m.url }]));

  for (const c of categories) {
    try {
      await prisma.category.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          documentId: c.document_id || undefined,
          categoryName: c.category_name || '',
          type: c.type || null,
          categoryPic: catMediaMap.get(c.id) || Prisma.DbNull,
          publishedAt: c.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped category ${c.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${categories.length} categories processed`);
}

async function migrateProducts() {
  console.log('\n📦 Migrating Products...');
  const products = await query(`
    SELECT id, product_name, recomended, description, published_at,
           created_at, updated_at, document_id
    FROM products ORDER BY id
  `);

  // Get product-category relations
  const prodCatLinks = await query(`
    SELECT product_id, category_id
    FROM products_cat_pro_lnk
  `).catch(() => []);

  const prodCatMap = new Map(prodCatLinks.map((l: any) => [l.product_id, l.category_id]));

  for (const p of products) {
    try {
      await prisma.product.upsert({
        where: { id: p.id },
        create: {
          id: p.id,
          documentId: p.document_id || undefined,
          ProductName: p.product_name || '',
          recomended: p.recomended ?? false,
          description: p.description || null,
          categoryId: prodCatMap.get(p.id) || null,
          publishedAt: p.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped product ${p.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${products.length} products processed`);

  // Migrate variants
  console.log('\n🎨 Migrating Product Variants...');
  const variants = await query(`
    SELECT cv.id, cv.sku, cv.color, cv.size, cv.stockqty, cv.pricing,
           cv.sale_pricing,
           cpv.entity_id as product_id
    FROM components_elements_product_variants cv
    LEFT JOIN products_cmps cpv ON cpv.component_id = cv.id
      AND cpv.component_type = 'elements.product-variants'
    ORDER BY cv.id
  `);

  // Get variant media
  const variantMedia = await query(`
    SELECT f.url, fm.related_id
    FROM files f
    JOIN files_related_mph fm ON f.id = fm.file_id
    WHERE fm.related_type = 'elements.product-variants'
      AND fm.field = 'Image'
  `);
  const variantMediaMap = new Map<number, Array<{ url: string }>>();
  for (const m of variantMedia) {
    if (!variantMediaMap.has(m.related_id)) variantMediaMap.set(m.related_id, []);
    variantMediaMap.get(m.related_id)!.push({ url: m.url });
  }

  for (const v of variants) {
    if (!v.product_id || !v.sku) continue;
    try {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        create: {
          sku: v.sku,
          color: v.color || null,
          size: v.size || null,
          stockqty: v.stockqty || 0,
          pricing: v.pricing || 0,
          salePricing: v.sale_pricing || 0,
          Image: variantMediaMap.get(v.id) || Prisma.DbNull,
          productId: v.product_id,
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped variant ${v.sku}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${variants.length} variants processed`);
}

async function migrateSingleTypes() {
  console.log('\n🖼️  Migrating Banners...');
  const banners = await query(`SELECT * FROM banners ORDER BY id LIMIT 1`);
  const bannerMedia = await query(`
    SELECT f.url FROM files f
    JOIN files_related_mph fm ON f.id = fm.file_id
    WHERE fm.related_type = 'api::banner.banner' AND fm.field = 'Image'
    LIMIT 1
  `);

  if (banners.length > 0) {
    const b = banners[0];
    await prisma.banner.upsert({
      where: { id: b.id },
      create: {
        id: b.id,
        documentId: b.document_id || undefined,
        Image: bannerMedia[0] ? { url: bannerMedia[0].url } : Prisma.DbNull,
        publishedAt: b.published_at || new Date(),
      },
      update: {},
    });
    console.log(`  ✅ Banner migrated`);
  }

  console.log('\n🎨 Migrating Colors...');
  const colors = await query(`SELECT * FROM colors ORDER BY id LIMIT 1`);
  if (colors.length > 0) {
    const c = colors[0];
    await prisma.color.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        documentId: c.document_id || undefined,
        color: c.color || null,
        publishedAt: c.published_at || new Date(),
      },
      update: {},
    });
    console.log(`  ✅ Color config migrated`);
  }

  console.log('\n📸 Migrating Collections...');
  const collections = await query(`SELECT * FROM collections ORDER BY id`);
  const collMedia = await query(`
    SELECT f.url, fm.related_id FROM files f
    JOIN files_related_mph fm ON f.id = fm.file_id
    WHERE fm.related_type = 'api::collection.collection' AND fm.field = 'Image'
  `);
  const collMediaMap = new Map(collMedia.map(m => [m.related_id, { url: m.url }]));

  for (const c of collections) {
    try {
      await prisma.collection.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          documentId: c.document_id || undefined,
          Image: collMediaMap.get(c.id) || Prisma.DbNull,
          publishedAt: c.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped collection ${c.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${collections.length} collections processed`);
}

async function migrateNewProducts() {
  console.log('\n⭐ Migrating NewProducts...');
  const newProducts = await query(`SELECT * FROM new_products ORDER BY id`);

  const npMedia = await query(`
    SELECT f.url, fm.related_id FROM files f
    JOIN files_related_mph fm ON f.id = fm.file_id
    WHERE fm.related_type = 'api::new-product.new-product' AND fm.field = 'Image'
  `);
  const npMediaMap = new Map(npMedia.map(m => [m.related_id, { url: m.url }]));

  // Get product relations
  const npProdLinks = await query(`
    SELECT new_product_id, product_id FROM new_products_product_lnk
  `).catch(() => []);
  const npProdMap = new Map(npProdLinks.map((l: any) => [l.new_product_id, l.product_id]));

  for (const np of newProducts) {
    try {
      await prisma.newProduct.upsert({
        where: { id: np.id },
        create: {
          id: np.id,
          documentId: np.document_id || undefined,
          title: np.title || null,
          description: np.description || null,
          Image: npMediaMap.get(np.id) || Prisma.DbNull,
          productId: npProdMap.get(np.id) || null,
          publishedAt: np.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped new product ${np.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${newProducts.length} new products processed`);
}

async function migrateWishlists() {
  console.log('\n❤️  Migrating Wishlists...');
  const wishlists = await query(`SELECT * FROM wishlists ORDER BY id`);

  // Get relations
  const wlUserLinks = await query(`
    SELECT wishlist_id, user_id FROM wishlists_user_lnk
  `).catch(() => []);
  const wlProdLinks = await query(`
    SELECT wishlist_id, product_id FROM wishlists_product_lnk
  `).catch(() => []);

  const wlUserMap = new Map(wlUserLinks.map((l: any) => [l.wishlist_id, l.user_id]));
  const wlProdMap = new Map(wlProdLinks.map((l: any) => [l.wishlist_id, l.product_id]));

  for (const wl of wishlists) {
    const userId = wlUserMap.get(wl.id);
    if (!userId) continue;
    try {
      await prisma.wishlist.upsert({
        where: { id: wl.id },
        create: {
          id: wl.id,
          documentId: wl.document_id || undefined,
          userId,
          productId: wlProdMap.get(wl.id) || null,
          added_at: wl.added_at || wl.created_at || new Date(),
          publishedAt: wl.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped wishlist ${wl.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${wishlists.length} wishlists processed`);
}

async function migrateCarts() {
  console.log('\n🛒 Migrating Carts...');
  const carts = await query(`SELECT * FROM carts ORDER BY id`);

  const cartUserLinks = await query(`
    SELECT cart_id, user_id FROM carts_user_lnk
  `).catch(() => []);
  const cartUserMap = new Map(cartUserLinks.map((l: any) => [l.cart_id, l.user_id]));

  for (const c of carts) {
    const userId = cartUserMap.get(c.id);
    if (!userId) continue;
    try {
      await prisma.cart.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          documentId: c.document_id || undefined,
          userId,
          publishedAt: c.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped cart ${c.id}: ${(err as Error).message}`);
    }
  }

  // Cart items from component table
  const cartItems = await query(`
    SELECT ci.id, ci.sku, ci.quantity, ci.price_at_added, ci.added_at,
           cc.entity_id as cart_id
    FROM components_cart_cart_items ci
    LEFT JOIN carts_cmps cc ON cc.component_id = ci.id
      AND cc.component_type = 'cart.cart-item'
    ORDER BY ci.id
  `);

  // Cart item product relations
  const ciProdLinks = await query(`
    SELECT cart_item_id, product_id FROM components_cart_cart_items_product_lnk
  `).catch(() => []);
  const ciProdMap = new Map(ciProdLinks.map((l: any) => [l.cart_item_id, l.product_id]));

  for (const ci of cartItems) {
    if (!ci.cart_id) continue;
    try {
      await prisma.cartItem.create({
        data: {
          sku: ci.sku || null,
          quantity: ci.quantity || 1,
          price_at_added: ci.price_at_added || null,
          added_at: ci.added_at || new Date(),
          cartId: ci.cart_id,
          productId: ciProdMap.get(ci.id) || null,
        },
      });
    } catch (err) {
      console.warn(`  Skipped cart item ${ci.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${carts.length} carts, ${cartItems.length} cart items processed`);
}

async function migrateTransactions() {
  console.log('\n💳 Migrating Transactions...');
  const transactions = await query(`SELECT * FROM transactions ORDER BY id`);

  const txUserLinks = await query(`
    SELECT transaction_id, user_id FROM transactions_user_id_lnk
  `).catch(() => []);
  const txUserMap = new Map(txUserLinks.map((l: any) => [l.transaction_id, l.user_id]));

  for (const tx of transactions) {
    const userId = txUserMap.get(tx.id);
    if (!userId) continue;
    try {
      await prisma.transaction.upsert({
        where: { id: tx.id },
        create: {
          id: tx.id,
          documentId: tx.document_id || undefined,
          userId,
          order_status: tx.order_status || 'Pending',
          total_summary: tx.total_summary || 0,
          tracking_info: tx.tracking_info || null,
          publishedAt: tx.published_at || new Date(),
        },
        update: {},
      });
    } catch (err) {
      console.warn(`  Skipped transaction ${tx.id}: ${(err as Error).message}`);
    }
  }

  // Order items
  const orderItems = await query(`
    SELECT oi.id, oi.quantity, oi.price_at_purchase, oi.selected_sku,
           tc.entity_id as transaction_id
    FROM components_order_order_items oi
    LEFT JOIN transactions_cmps tc ON tc.component_id = oi.id
      AND tc.component_type = 'order.order-item'
    ORDER BY oi.id
  `);

  const oiProdLinks = await query(`
    SELECT order_item_id, product_id FROM components_order_order_items_products_lnk
  `).catch(() => []);
  const oiProdMap = new Map(oiProdLinks.map((l: any) => [l.order_item_id, l.product_id]));

  for (const oi of orderItems) {
    if (!oi.transaction_id) continue;
    try {
      await prisma.orderItem.create({
        data: {
          quantity: oi.quantity || 1,
          price_at_purchase: oi.price_at_purchase || null,
          selected_sku: oi.selected_sku || null,
          transactionId: oi.transaction_id,
          productId: oiProdMap.get(oi.id) || null,
        },
      });
    } catch (err) {
      console.warn(`  Skipped order item ${oi.id}: ${(err as Error).message}`);
    }
  }
  console.log(`  ✅ ${transactions.length} transactions, ${orderItems.length} order items processed`);
}

async function resetSequences() {
  console.log('\n🔄 Resetting auto-increment sequences...');
  const tables = [
    'users', 'categories', 'products', 'product_variants',
    'collections', 'banners', 'colors', 'new_products',
    'carts', 'cart_items', 'wishlists', 'transactions', 'order_items',
  ];

  for (const table of tables) {
    try {
      await pool.query(`
        SELECT setval(pg_get_serial_sequence('${table}', 'id'),
          COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, false)
      `);
    } catch (err) {
      console.warn(`  ⚠️  Could not reset sequence for ${table}`);
    }
  }
  console.log('  ✅ Sequences reset');
}

async function main() {
  console.log('🚀 Starting Strapi → Prisma data migration...\n');
  console.log('================================================');

  try {
    await migrateUsers();
    await migrateCategories();
    await migrateProducts();
    await migrateSingleTypes();
    await migrateNewProducts();
    await migrateWishlists();
    await migrateCarts();
    await migrateTransactions();
    await resetSequences();

    console.log('\n================================================');
    console.log('✅ Migration complete!\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
