import { Router } from 'express';
import { getNewProducts, getNewProduct } from '../controllers/newProduct.controller';

const router = Router();

router.get('/', getNewProducts);
router.get('/:documentId', getNewProduct);

export default router;
