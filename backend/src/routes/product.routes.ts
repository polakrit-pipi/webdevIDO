import { Router } from 'express';
import { getProducts, getProduct } from '../controllers/product.controller';

const router = Router();

// GET /api/products — List all products
router.get('/', getProducts);

// GET /api/products/:documentId — Get single product
router.get('/:documentId', getProduct);

export default router;
