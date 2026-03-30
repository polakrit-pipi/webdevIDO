import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { env } from '../config/env';
import { signAdminToken } from '../middleware/adminAuth.middleware';

/** Cast a route param (string | string[]) safely to an integer. */
const pid = (param: string | string[]): number => parseInt(Array.isArray(param) ? param[0] : param, 10);

// ============================================================
// AUTH
// ============================================================

/** POST /api/admin/login */
export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: { message: 'email and password are required' } });
      return;
    }

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      res.status(401).json({ error: { message: 'Invalid credentials' } });
      return;
    }

    const token = signAdminToken(email);
    res.json({ token, email });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// DASHBOARD
// ============================================================

/** GET /api/admin/dashboard */
export const getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [productCount, userCount, orderCount, pendingOrders, revenue] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { order_status: 'Pending' } }),
      prisma.transaction.aggregate({ _sum: { total_summary: true } }),
    ]);

    const recentOrders = await prisma.transaction.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true, email: true } } },
    });

    res.json({
      stats: {
        products: productCount,
        users: userCount,
        orders: orderCount,
        pendingOrders,
        totalRevenue: revenue._sum.total_summary ?? 0,
      },
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// PRODUCTS
// ============================================================

/** GET /api/admin/products */
export const adminGetProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true, cat_pro: true, newProduct: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

/** GET /api/admin/products/:id */
export const adminGetProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, cat_pro: true, newProduct: true },
    });
    if (!product) { res.status(404).json({ error: { message: 'Product not found' } }); return; }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

/** POST /api/admin/products */
export const adminCreateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ProductName, categoryId, recomended, description, variants = [] } = req.body;

    if (!ProductName) {
      res.status(400).json({ error: { message: 'ProductName is required' } });
      return;
    }

    const product = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          ProductName,
          categoryId: categoryId ? parseInt(categoryId) : null,
          recomended: !!recomended,
          description: description ?? null,
          publishedAt: new Date(),
        },
      });

      if (variants.length > 0) {
        await tx.productVariant.createMany({
          data: variants.map((v: any) => ({
            productId: p.id,
            sku: v.sku,
            color: v.color ?? null,
            size: v.size ?? null,
            stockqty: parseInt(v.stockqty ?? 0),
            pricing: parseFloat(v.pricing ?? 0),
            salePricing: v.salePricing ? parseInt(v.salePricing) : null,
            Image: v.Image ?? null,
          })),
        });
      }

      return tx.product.findUnique({ where: { id: p.id }, include: { variants: true, cat_pro: true } });
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/products/:id */
export const adminUpdateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { ProductName, categoryId, recomended, description, publishedAt } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(ProductName !== undefined && { ProductName }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(recomended !== undefined && { recomended: !!recomended }),
        ...(description !== undefined && { description }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      },
      include: { variants: true, cat_pro: true },
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/products/:id */
export const adminDeleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// PRODUCT VARIANTS
// ============================================================

/** POST /api/admin/products/:id/variants */
export const adminCreateVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = pid(req.params.id);
    const { sku, color, size, stockqty, pricing, salePricing, Image } = req.body;

    if (!sku) { res.status(400).json({ error: { message: 'sku is required' } }); return; }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        sku,
        color: color ?? null,
        size: size ?? null,
        stockqty: parseInt(stockqty ?? 0),
        pricing: parseFloat(pricing ?? 0),
        salePricing: salePricing ? parseInt(salePricing) : null,
        Image: Image ?? null,
      },
    });
    res.status(201).json(variant);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/admin/variants/:variantId */
export const adminUpdateVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.variantId);
    const { sku, color, size, stockqty, pricing, salePricing, Image } = req.body;

    const variant = await prisma.productVariant.update({
      where: { id },
      data: {
        ...(sku !== undefined && { sku }),
        ...(color !== undefined && { color }),
        ...(size !== undefined && { size }),
        ...(stockqty !== undefined && { stockqty: parseInt(stockqty) }),
        ...(pricing !== undefined && { pricing: parseFloat(pricing) }),
        ...(salePricing !== undefined && { salePricing: salePricing ? parseInt(salePricing) : null }),
        ...(Image !== undefined && { Image }),
      },
    });
    res.json(variant);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/admin/variants/:variantId */
export const adminDeleteVariant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.variantId);
    await prisma.productVariant.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// CATEGORIES
// ============================================================

/** GET /api/admin/categories */
export const adminGetCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(categories);
  } catch (err) { next(err); }
};

/** POST /api/admin/categories */
export const adminCreateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryName, type, categoryPic } = req.body;
    if (!categoryName) { res.status(400).json({ error: { message: 'categoryName is required' } }); return; }
    const category = await prisma.category.create({
      data: { categoryName, type: type ?? null, categoryPic: categoryPic ?? null, publishedAt: new Date() },
    });
    res.status(201).json(category);
  } catch (err) { next(err); }
};

/** PUT /api/admin/categories/:id */
export const adminUpdateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { categoryName, type, categoryPic } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(categoryName !== undefined && { categoryName }),
        ...(type !== undefined && { type }),
        ...(categoryPic !== undefined && { categoryPic }),
      },
    });
    res.json(category);
  } catch (err) { next(err); }
};

/** DELETE /api/admin/categories/:id */
export const adminDeleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ============================================================
// COLLECTIONS
// ============================================================

/** GET /api/admin/collections */
export const adminGetCollections = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const collections = await prisma.collection.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(collections);
  } catch (err) { next(err); }
};

/** POST /api/admin/collections */
export const adminCreateCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { Image } = req.body;
    const collection = await prisma.collection.create({
      data: { Image: Image ?? null, publishedAt: new Date() },
    });
    res.status(201).json(collection);
  } catch (err) { next(err); }
};

/** PUT /api/admin/collections/:id */
export const adminUpdateCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { Image } = req.body;
    const collection = await prisma.collection.update({ where: { id }, data: { Image } });
    res.json(collection);
  } catch (err) { next(err); }
};

/** DELETE /api/admin/collections/:id */
export const adminDeleteCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    await prisma.collection.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ============================================================
// BANNERS
// ============================================================

/** GET /api/admin/banners */
export const adminGetBanners = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(banners);
  } catch (err) { next(err); }
};

/** POST /api/admin/banners */
export const adminCreateBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { Image } = req.body;
    const banner = await prisma.banner.create({ data: { Image: Image ?? null, publishedAt: new Date() } });
    res.status(201).json(banner);
  } catch (err) { next(err); }
};

/** PUT /api/admin/banners/:id */
export const adminUpdateBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { Image } = req.body;
    const banner = await prisma.banner.update({ where: { id }, data: { Image } });
    res.json(banner);
  } catch (err) { next(err); }
};

/** DELETE /api/admin/banners/:id */
export const adminDeleteBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    await prisma.banner.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ============================================================
// COLORS
// ============================================================

/** GET /api/admin/colors */
export const adminGetColors = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const colors = await prisma.color.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(colors);
  } catch (err) { next(err); }
};

/** PUT /api/admin/colors/:id */
export const adminUpdateColor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { color } = req.body;
    const updated = await prisma.color.update({ where: { id }, data: { color } });
    res.json(updated);
  } catch (err) { next(err); }
};

// ============================================================
// NEW PRODUCTS (Featured/New Arrivals)
// ============================================================

/** GET /api/admin/new-products */
export const adminGetNewProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await prisma.newProduct.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { id: true, ProductName: true } } },
    });
    res.json(items);
  } catch (err) { next(err); }
};

/** POST /api/admin/new-products */
export const adminCreateNewProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, productId, Image } = req.body;
    const np = await prisma.newProduct.create({
      data: {
        title: title ?? null,
        description: description ?? null,
        productId: productId ? parseInt(productId) : null,
        Image: Image ?? null,
        publishedAt: new Date(),
      },
      include: { product: { select: { id: true, ProductName: true } } },
    });
    res.status(201).json(np);
  } catch (err) { next(err); }
};

/** PUT /api/admin/new-products/:id */
export const adminUpdateNewProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { title, description, productId, Image } = req.body;
    const np = await prisma.newProduct.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(productId !== undefined && { productId: productId ? parseInt(productId) : null }),
        ...(Image !== undefined && { Image }),
      },
      include: { product: { select: { id: true, ProductName: true } } },
    });
    res.json(np);
  } catch (err) { next(err); }
};

/** DELETE /api/admin/new-products/:id */
export const adminDeleteNewProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    await prisma.newProduct.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ============================================================
// USERS (read-only)
// ============================================================

/** GET /api/admin/users */
export const adminGetUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, firstname: true, lastname: true, phone: true, role: true, confirmed: true, blocked: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) { next(err); }
};

/** GET /api/admin/users/:id */
export const adminGetUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, firstname: true, lastname: true, phone: true, address: true, role: true, confirmed: true, blocked: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ error: { message: 'User not found' } }); return; }
    res.json(user);
  } catch (err) { next(err); }
};

// ============================================================
// ORDERS / TRANSACTIONS
// ============================================================

/** GET /api/admin/orders */
export const adminGetOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const orders = await prisma.transaction.findMany({
      where: status ? { order_status: status as string } : undefined,
      include: {
        user: { select: { id: true, username: true, email: true } },
        items: { include: { product: { select: { id: true, ProductName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) { next(err); }
};

/** GET /api/admin/orders/:id */
export const adminGetOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const order = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true, phone: true, address: true } },
        items: { include: { product: { select: { id: true, ProductName: true } } } },
      },
    });
    if (!order) { res.status(404).json({ error: { message: 'Order not found' } }); return; }
    res.json(order);
  } catch (err) { next(err); }
};

/** PUT /api/admin/orders/:id/status */
export const adminUpdateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = pid(req.params.id);
    const { order_status, tracking_info } = req.body;

    const VALID_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (order_status && !VALID_STATUSES.includes(order_status)) {
      res.status(400).json({ error: { message: `order_status must be one of: ${VALID_STATUSES.join(', ')}` } });
      return;
    }

    const order = await prisma.transaction.update({
      where: { id },
      data: {
        ...(order_status !== undefined && { order_status }),
        ...(tracking_info !== undefined && { tracking_info }),
      },
    });
    res.json(order);
  } catch (err) { next(err); }
};

// ============================================================
// FILE UPLOAD
// ============================================================

/** POST /api/admin/upload  — handled by multer, this just sends the response */
export const adminUploadFile = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: { message: 'No file uploaded' } });
    return;
  }
  const relativePath = `/uploads/${req.file.filename}`;
  res.json({ url: relativePath, originalname: req.file.originalname, size: req.file.size });
};
