import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';

/**
 * Create and configure the Express application.
 * AdminJS is loaded dynamically to avoid issues during build.
 */
export async function createApp() {
  const app = express();

  // ============================================
  // Core Middleware
  // ============================================
  app.use(cors({
    origin: true, // Allow all origins in dev; restrict in production
    credentials: true,
  }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ============================================
  // Static File Serving (uploads / media)
  // ============================================
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

  // ============================================
  // AdminJS Setup
  // ============================================
  try {
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = await import('@adminjs/express');
    const { Resource, Database, getModelByName } = await import('@adminjs/prisma');
    const { PrismaClient } = await import('@prisma/client');
    const session = (await import('express-session')).default;

    AdminJS.registerAdapter({ Resource, Database });

    const prisma = new PrismaClient();

    // Get Prisma DMMF models
    const dmmf = (prisma as any)._baseDmmf || (prisma as any)._dmmf;

    const adminJs = new AdminJS({
      rootPath: '/admin',
      resources: [
        {
          resource: { model: getModelByName('User'), client: prisma },
          options: {
            navigation: { name: 'Users & Auth', icon: 'User' },
            listProperties: ['id', 'username', 'email', 'firstname', 'lastname', 'role', 'createdAt'],
            properties: {
              password: { isVisible: { list: false, filter: false, show: false, edit: true } },
            },
          },
        },
        {
          resource: { model: getModelByName('Product'), client: prisma },
          options: {
            navigation: { name: 'Catalog', icon: 'ShoppingCart' },
            listProperties: ['id', 'ProductName', 'recomended', 'categoryId', 'publishedAt'],
          },
        },
        {
          resource: { model: getModelByName('ProductVariant'), client: prisma },
          options: {
            navigation: { name: 'Catalog', icon: 'Package' },
            listProperties: ['id', 'sku', 'color', 'size', 'pricing', 'salePricing', 'stockqty', 'productId'],
          },
        },
        {
          resource: { model: getModelByName('Category'), client: prisma },
          options: {
            navigation: { name: 'Catalog', icon: 'Tag' },
            listProperties: ['id', 'categoryName', 'type', 'publishedAt'],
          },
        },
        {
          resource: { model: getModelByName('Collection'), client: prisma },
          options: { navigation: { name: 'Content', icon: 'Image' } },
        },
        {
          resource: { model: getModelByName('Banner'), client: prisma },
          options: { navigation: { name: 'Content', icon: 'Flag' } },
        },
        {
          resource: { model: getModelByName('Color'), client: prisma },
          options: { navigation: { name: 'Content', icon: 'Palette' } },
        },
        {
          resource: { model: getModelByName('NewProduct'), client: prisma },
          options: {
            navigation: { name: 'Content', icon: 'Star' },
            listProperties: ['id', 'title', 'description', 'productId', 'publishedAt'],
          },
        },
        {
          resource: { model: getModelByName('Cart'), client: prisma },
          options: { navigation: { name: 'Commerce', icon: 'ShoppingBag' } },
        },
        {
          resource: { model: getModelByName('CartItem'), client: prisma },
          options: { navigation: { name: 'Commerce', icon: 'ShoppingBag' } },
        },
        {
          resource: { model: getModelByName('Wishlist'), client: prisma },
          options: { navigation: { name: 'Commerce', icon: 'Heart' } },
        },
        {
          resource: { model: getModelByName('Transaction'), client: prisma },
          options: {
            navigation: { name: 'Commerce', icon: 'CreditCard' },
            listProperties: ['id', 'userId', 'order_status', 'total_summary', 'createdAt'],
          },
        },
        {
          resource: { model: getModelByName('OrderItem'), client: prisma },
          options: { navigation: { name: 'Commerce', icon: 'CreditCard' } },
        },
      ],
      branding: {
        companyName: 'ideabyido Admin',
        logo: false,
      },
    });

    // Admin auth — simple email/password
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      adminJs,
      {
        authenticate: async (email: string, password: string) => {
          if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
            return { email };
          }
          return null;
        },
        cookieName: 'adminjs',
        cookiePassword: env.SESSION_SECRET,
      },
      null,
      {
        resave: false,
        saveUninitialized: false,
        secret: env.SESSION_SECRET,
      }
    );

    app.use(adminJs.options.rootPath, adminRouter);
    console.log(`🔧 AdminJS loaded at /admin`);
  } catch (err) {
    console.warn('⚠️  AdminJS failed to load (non-critical):', (err as Error).message);
    // AdminJS is optional — the API still works without it
  }

  // ============================================
  // Body Parsers & API Routes
  // ============================================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRoutes);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ============================================
  // Error Handler (must be last)
  // ============================================
  app.use(errorHandler);

  return app;
}
