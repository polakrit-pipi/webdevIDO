-- CreateTable: admins (new in this migration)
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "documentId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "address" JSONB,
    "age" INTEGER,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable: admin_login_logs (new in this migration)
CREATE TABLE "admin_login_logs" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',

    CONSTRAINT "admin_login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_documentId_key" ON "admins"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "admin_login_logs" ADD CONSTRAINT "admin_login_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================
-- Seed Data: Exported from Database
-- ============================================

-- Admins
INSERT INTO public.admins (id, "documentId", username, email, password, firstname, lastname, address, age, role, "createdAt", "updatedAt") VALUES (1, '1794dbdb-c239-402c-acf4-7e6712390003', 'admin', 'admin@muha.com', '$2a$10$OOo1q0dnOr3/XzmuDLS66uVy5d0rmUZvsnwjvv.CrU/Oa/5avVbZe', 'System', 'Admin', NULL, NULL, 'admin', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');

-- Categories
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (1, '5ab21fb5-0140-446e-96d2-01a72c45db9c', 'Hawaiian Shirt', '{"url": "https://img.freepik.com/free-photo/view-hawaiian-shirt-hanger-with-garland_23-2149366042.jpg"}', 'shirt', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (2, 'b3b94b05-bb1d-42f4-8764-b02df85da9eb', 'Polo Shirt', '{"url": "https://img.freepik.com/free-photo/man-red-polo-shirt-apparel-studio-shoot_53876-102825.jpg"}', 'shirt', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (3, 'd41943e8-941a-42ef-b7e1-8d10c5f39336', 'Hoodie', '{"url": "https://img.freepik.com/free-photo/white-hoodie-rear-view-minimal-fashion-apparel_53876-123183.jpg"}', 'shirt', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (4, '755b4c1d-13dc-4adf-91cc-eb3c29411801', 'Skinny Jeans', '{"url": "https://img.freepik.com/free-photo/jeans_1203-8094.jpg"}', 'trouser', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (5, 'de394de8-9288-4002-8a34-6cc7c764da66', 'Cargo pants', '{"url": "https://img.freepik.com/free-photo/view-beige-tone-colored-pants_23-2150773390.jpg"}', 'trouser', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (6, 'a5a86b4b-08bc-4971-80bb-9f5858af0b99', 'Sweatpants', '{"url": "https://img.freepik.com/free-photo/pants_1203-8309.jpg"}', 'trouser', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (7, '8ef01408-c218-469b-8fe3-c6b45acd0398', 'Hat', '{"url": "https://img.freepik.com/free-photo/black-bucket-hat-unisex-accessory_53876-106055.jpg"}', 'others', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (8, '93319d80-ac37-4035-b8d0-66284aa3b4e3', 'Accessory', '{"url": "https://img.freepik.com/free-photo/view-women-bag-stuff_93675-131548.jpg"}', 'others', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (9, '78133b67-ce94-4871-bb6e-633fe39b4024', 'Bag', '{"url": "https://img.freepik.com/free-photo/close-up-elegant-bag_23-2151912439.jpg"}', 'others', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');
INSERT INTO public.categories (id, "documentId", "categoryName", "categoryPic", type, "publishedAt", "createdAt", "updatedAt") VALUES (10, 'd2c75a3d-5907-4f11-b16a-8bc5d91fd643', 'Shoes', '{"url": "https://img.freepik.com/free-photo/white-training-sneakers-unisex-sportswear-fashion-shoot_53876-104311.jpg"}', 'others', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293', '2026-04-28 11:56:59.293');

-- Products
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (1, 'd7f4d643-6ea4-4ab3-97ff-c59e35c68d24', 'Hawaii Shirt 01', false, '"Hawaii Shirt Description"', '2026-04-28 11:58:23.925', '2026-04-28 11:58:23.927', '2026-04-28 11:58:57.281', 1);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (2, 'de3a91b7-bef1-426c-9c86-ee70ba9dfb36', 'Polo Shirt 01', true, '"Polo Shirt Description"', '2026-04-28 12:03:07.913', '2026-04-28 12:03:07.915', '2026-04-28 12:03:07.915', 2);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (3, '70ead4e7-5e31-4035-b68b-13617ce4925e', 'Hoodie 01', true, '"Hoodie"', '2026-04-28 12:06:04.423', '2026-04-28 12:06:04.426', '2026-04-28 12:07:16.809', 3);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (4, 'd0eb766a-c472-4675-be8a-c5f93c9cf35b', 'Skinny Jeans 01', false, '"Skinny Jeans"', '2026-04-28 12:09:16.424', '2026-04-28 12:09:16.426', '2026-04-28 12:09:16.426', 4);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (5, 'aeac831d-30e0-4bd9-b37d-d3a0012d4897', 'Cargo Pants 01', true, '"Cargo Pants "', '2026-04-28 12:11:57.358', '2026-04-28 12:11:57.36', '2026-04-28 12:11:57.36', 5);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (6, 'e4eef73e-c204-45f7-b7e0-507f71fc36fc', 'Sweatpants 01', false, '"Sweatpants"', '2026-04-28 12:14:49.561', '2026-04-28 12:14:49.563', '2026-04-28 12:14:49.563', 6);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (7, 'dd6e30fd-3c8b-4403-a672-b745c08b143a', 'Hat 01', true, '"Hat"', '2026-04-28 12:17:27.478', '2026-04-28 12:17:27.481', '2026-04-28 12:17:27.481', 7);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (8, 'a66317ab-b39c-4eed-b44f-8fccc7fdceb9', 'Necklace 01', true, '"Necklace"', '2026-04-28 12:23:14.25', '2026-04-28 12:23:14.252', '2026-04-28 12:23:19.613', 8);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (9, 'a4a94aa6-0541-4a34-9ed6-f7743677717a', 'Bag 01', true, '"Bag"', '2026-04-28 12:24:51.954', '2026-04-28 12:24:51.956', '2026-04-28 12:24:51.956', 9);
INSERT INTO public.products (id, "documentId", "ProductName", recomended, description, "publishedAt", "createdAt", "updatedAt", "categoryId") VALUES (10, 'f8724223-23fd-460d-b0e6-557141cb8135', 'Shoes 01', true, '"Shoes"', '2026-04-28 12:26:45.598', '2026-04-28 12:26:45.601', '2026-04-28 12:26:45.601', 10);

-- Product Variants
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (1, 'SHI-HAW-BLU-S', 'Blue', 'S', 10, 399.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/stylish-man-medium-shot-holding-ice-cream_23-2148194048.jpg"}]', 1);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (2, 'SHI-HAW-BLU-M', 'Blue', 'M', 11, 449.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/stylish-man-medium-shot-holding-ice-cream_23-2148194048.jpg"}]', 1);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (3, 'SHI-POL-WHI-S', 'White', 'S', 5, 349.000000000000000000000000000000, 299, '[{"url": "https://img.freepik.com/free-photo/white-polo-shirt-street-style-menswear-fashion-apparel-shoot_53876-105528.jpg"}]', 2);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (4, 'SHI-POL-WHI-M', 'White', 'M', 5, 399.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/white-polo-shirt-street-style-menswear-fashion-apparel-shoot_53876-105528.jpg"}]', 2);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (5, 'SHI-POL-WHI-L', 'White', 'L', 5, 449.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/white-polo-shirt-street-style-menswear-fashion-apparel-shoot_53876-105528.jpg"}]', 2);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (6, 'SHI-HOO-BRO-F', 'Brown', 'Free Size', 20, 1250.000000000000000000000000000000, 899, '[{"url": "https://img.freepik.com/premium-photo/handsome-man-wearing-brown-hoodie-winter-fashion-studio-shoot_53876-1222008.jpg"}]', 3);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (7, 'TRO-SKJ-BLU-S', 'Blue', 'S', 1, 799.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/man-navy-jacket-jeans-streetwear_53876-108579.jpg"}]', 4);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (8, 'TRO-SKJ-BLU-M', 'Blue', 'M', 4, 899.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/man-navy-jacket-jeans-streetwear_53876-108579.jpg"}]', 4);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (9, 'TRO-CAR-BRO-M', 'Brown', 'M', 6, 799.000000000000000000000000000000, 699, '[{"url": "https://img.freepik.com/free-photo/handsome-man-standing-peak-man-casual-clothes-standing-hill-blue-sky-background-nature-leisure-hobby-concept_74855-23713.jpg"}]', 5);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (10, 'TRO-CAR-BRO-L', 'Brown', 'L', 7, 799.000000000000000000000000000000, 699, '[{"url": "https://img.freepik.com/free-photo/handsome-man-standing-peak-man-casual-clothes-standing-hill-blue-sky-background-nature-leisure-hobby-concept_74855-23713.jpg"}]', 5);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (11, 'TRO-CAR-BRO-XL', 'Brown', 'XL', 8, 799.000000000000000000000000000000, 699, '[{"url": "https://img.freepik.com/free-photo/handsome-man-standing-peak-man-casual-clothes-standing-hill-blue-sky-background-nature-leisure-hobby-concept_74855-23713.jpg"}]', 5);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (12, 'TRO-CAR-BRO-XXL', 'Brown', 'XXL', 9, 799.000000000000000000000000000000, 699, '[{"url": "https://img.freepik.com/free-photo/handsome-man-standing-peak-man-casual-clothes-standing-hill-blue-sky-background-nature-leisure-hobby-concept_74855-23713.jpg"}]', 5);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (13, 'TRO-SWE-GRA-XS', 'Gray', 'XS', 5, 499.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/portrait-cool-teenage-boy-wearing-cap_23-2149085880.jpg"}]', 6);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (14, 'TRO-SWE-GRA-S', 'Gray', 'S', 5, 499.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/portrait-cool-teenage-boy-wearing-cap_23-2149085880.jpg"}]', 6);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (15, 'TRO-SWE-GRA-M', 'Gray', 'M', 5, 499.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/portrait-cool-teenage-boy-wearing-cap_23-2149085880.jpg"}]', 6);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (16, 'TRO-SWE-GRA-L', 'Gray', 'L', 5, 499.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/portrait-cool-teenage-boy-wearing-cap_23-2149085880.jpg"}]', 6);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (17, 'OTH-HAT-BRO-FRE', 'Brown', 'Free Size', 20, 479.000000000000000000000000000000, 399, '[{"url": "https://img.freepik.com/free-photo/blond-man-with-hat-brown-background_23-2148316524.jpg"}]', 7);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (18, 'OTH-ACC-SIL-FRE', 'Silver', 'Free Size', 10, 599.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/man-city-fashion-shoot_53876-14418.jpg"}]', 8);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (19, 'OTH-ACC-GOL-FRE', 'Gold', 'Free Size', 12, 599.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/medium-shot-underground-hip-hop-musician_23-2150932968.jpg"}]', 8);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (20, 'OTH-BAG-BLA-FRE', 'Black', 'Free Size', 21, 379.000000000000000000000000000000, NULL, '[{"url": "https://img.freepik.com/free-photo/man-with-black-belt-bag_53876-105032.jpg"}]', 9);
INSERT INTO public.product_variants (id, sku, color, size, stockqty, pricing, "salePricing", "Image", "productId") VALUES (21, 'OTH-SHO-BRO-FRE', 'Brown', 'Free Size', 7, 899.000000000000000000000000000000, 679, '[{"url": "https://img.freepik.com/free-photo/male-suit-close-up-holding-coffee-hand_1303-10298.jpg"}]', 10);



-- Users
INSERT INTO public.users (id, "documentId", username, email, password, role, "createdAt", "updatedAt") VALUES 
  (1, gen_random_uuid(), 'customer1', 'cus1@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, gen_random_uuid(), 'customer2', 'cus2@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, gen_random_uuid(), 'customer3', 'cus3@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, gen_random_uuid(), 'customer4', 'cus4@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, gen_random_uuid(), 'customer5', 'cus5@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, gen_random_uuid(), 'customer6', 'cus6@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, gen_random_uuid(), 'customer7', 'cus7@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, gen_random_uuid(), 'customer8', 'cus8@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, gen_random_uuid(), 'customer9', 'cus9@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, gen_random_uuid(), 'customer10', 'cus10@muha.com', '$2a$10$pvWi.X7Efu2ra8oGM7Vb5.1wSrQW6263pZ3KRh6ZIe.fOMyi.gOY2', 'authenticated', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Carts
INSERT INTO public.carts (id, "documentId", "userId", "createdAt", "updatedAt") VALUES 
  (1, gen_random_uuid(), 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, gen_random_uuid(), 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, gen_random_uuid(), 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, gen_random_uuid(), 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, gen_random_uuid(), 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, gen_random_uuid(), 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, gen_random_uuid(), 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, gen_random_uuid(), 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, gen_random_uuid(), 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, gen_random_uuid(), 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Cart Items
INSERT INTO public.cart_items (id, sku, quantity, "cartId", "productId") VALUES 
  (1, 'SHI-HAW-BLU-S', 1, 1, 1),
  (2, 'SHI-HAW-BLU-S', 1, 2, 1),
  (3, 'SHI-HAW-BLU-S', 1, 3, 1),
  (4, 'SHI-HAW-BLU-S', 1, 4, 1),
  (5, 'SHI-HAW-BLU-S', 1, 5, 1),
  (6, 'SHI-HAW-BLU-S', 1, 6, 1),
  (7, 'SHI-HAW-BLU-S', 1, 7, 1),
  (8, 'SHI-HAW-BLU-S', 1, 8, 1),
  (9, 'SHI-HAW-BLU-S', 1, 9, 1),
  (10, 'SHI-HAW-BLU-S', 1, 10, 1);

-- Wishlists
INSERT INTO public.wishlists (id, "documentId", "userId", "productId", "createdAt", "updatedAt") VALUES 
  (1, gen_random_uuid(), 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, gen_random_uuid(), 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, gen_random_uuid(), 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, gen_random_uuid(), 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, gen_random_uuid(), 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, gen_random_uuid(), 6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, gen_random_uuid(), 7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, gen_random_uuid(), 8, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, gen_random_uuid(), 9, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, gen_random_uuid(), 10, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Transactions
INSERT INTO public.transactions (id, "documentId", "userId", order_status, total_summary, "createdAt", "updatedAt") VALUES 
  (1, gen_random_uuid(), 1, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, gen_random_uuid(), 2, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, gen_random_uuid(), 3, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, gen_random_uuid(), 4, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, gen_random_uuid(), 5, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, gen_random_uuid(), 6, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, gen_random_uuid(), 7, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, gen_random_uuid(), 8, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, gen_random_uuid(), 9, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, gen_random_uuid(), 10, 'Completed', 399.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Order Items
INSERT INTO public.order_items (id, quantity, "transactionId", "productId") VALUES 
  (1, 1, 1, 1),
  (2, 1, 2, 1),
  (3, 1, 3, 1),
  (4, 1, 4, 1),
  (5, 1, 5, 1),
  (6, 1, 6, 1),
  (7, 1, 7, 1),
  (8, 1, 8, 1),
  (9, 1, 9, 1),
  (10, 1, 10, 1);

-- Reset Sequences to prevent ID collision
SELECT pg_catalog.setval('public.admins_id_seq', 1, true);
SELECT pg_catalog.setval('public.categories_id_seq', 10, true);
SELECT pg_catalog.setval('public.products_id_seq', 10, true);
SELECT pg_catalog.setval('public.product_variants_id_seq', 21, true);
SELECT pg_catalog.setval('public.users_id_seq', 10, true);
SELECT pg_catalog.setval('public.carts_id_seq', 10, true);
SELECT pg_catalog.setval('public.cart_items_id_seq', 10, true);
SELECT pg_catalog.setval('public.wishlists_id_seq', 10, true);
SELECT pg_catalog.setval('public.transactions_id_seq', 10, true);
SELECT pg_catalog.setval('public.order_items_id_seq', 10, true);
