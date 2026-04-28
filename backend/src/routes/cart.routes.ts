import { Router } from 'express';
import { createCart, updateCart, getCart } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createCart);
router.put('/:documentId', authenticate, updateCart);
router.get('/:documentId', authenticate, getCart);

export default router;
