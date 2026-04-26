import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { verifyAdminToken } from '../middleware/adminAuth.middleware';
import {
  adminLogin,
  getDashboard,
  adminGetProducts, adminGetProduct, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminCreateVariant, adminUpdateVariant, adminDeleteVariant,
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
  adminGetCollections, adminCreateCollection, adminUpdateCollection, adminDeleteCollection,
  adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner,
  adminGetColors, adminUpdateColor,
  adminGetNewProducts, adminCreateNewProduct, adminUpdateNewProduct, adminDeleteNewProduct,
  adminGetUsers, adminGetUser,
  adminGetOrders, adminGetOrder, adminUpdateOrderStatus,
  adminUploadFile,
} from '../controllers/admin.controller';

const router = Router();

// ── Multer config ──────────────────────────────────────────────
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// ── Public ── login only ───────────────────────────────────────
router.post('/login', adminLogin);

// ── All routes below require a valid admin JWT ─────────────────
router.use(verifyAdminToken);

// Dashboard
router.get('/dashboard', getDashboard);

// Products
router.get('/products', adminGetProducts);
router.get('/products/:id', adminGetProduct);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Variants (sub-resource of product)
router.post('/products/:id/variants', adminCreateVariant);
router.put('/variants/:variantId', adminUpdateVariant);
router.delete('/variants/:variantId', adminDeleteVariant);

// Categories
router.get('/categories', adminGetCategories);
router.post('/categories', adminCreateCategory);
router.put('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// Collections
router.get('/collections', adminGetCollections);
router.post('/collections', adminCreateCollection);
router.put('/collections/:id', adminUpdateCollection);
router.delete('/collections/:id', adminDeleteCollection);

// Banners
router.get('/banners', adminGetBanners);
router.post('/banners', adminCreateBanner);
router.put('/banners/:id', adminUpdateBanner);
router.delete('/banners/:id', adminDeleteBanner);

// Colors
router.get('/colors', adminGetColors);
router.put('/colors/:id', adminUpdateColor);

// New Products
router.get('/new-products', adminGetNewProducts);
router.post('/new-products', adminCreateNewProduct);
router.put('/new-products/:id', adminUpdateNewProduct);
router.delete('/new-products/:id', adminDeleteNewProduct);

// Users (read-only)
router.get('/users', adminGetUsers);
router.get('/users/:id', adminGetUser);

// Orders
router.get('/orders', adminGetOrders);
router.get('/orders/:id', adminGetOrder);
router.put('/orders/:id/status', adminUpdateOrderStatus);

// File Upload
router.post('/upload', upload.single('file'), adminUploadFile);

export default router;
