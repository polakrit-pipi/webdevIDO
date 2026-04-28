import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import collectionRoutes from './collection.routes';
import bannerRoutes from './banner.routes';
import colorRoutes from './color.routes';
import newProductRoutes from './newProduct.routes';
import cartRoutes from './cart.routes';
import wishlistRoutes from './wishlist.routes';
import transactionRoutes from './transaction.routes';
import { register } from '../controllers/auth.controller';

const router = Router();

// Auth
router.use('/auth', authRoutes);
router.post('/custom-register', register);

// Users
router.use('/users', userRoutes);

// Content
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/collections', collectionRoutes);
router.use('/banner', bannerRoutes);
router.use('/color', colorRoutes);
router.use('/new-products', newProductRoutes);

// Commerce
router.use('/carts', cartRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/transactions', transactionRoutes);

export default router;
