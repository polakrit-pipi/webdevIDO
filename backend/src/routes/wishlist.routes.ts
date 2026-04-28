import { Router } from 'express';
import { createWishlist, deleteWishlist, getWishlists } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getWishlists);
router.post('/', authenticate, createWishlist);
router.delete('/:documentId', authenticate, deleteWishlist);

export default router;
