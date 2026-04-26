import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapCollection, wrapSingle } from '../utils/strapiCompat';

/**
 * GET /api/collections
 */
export const getCollections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const collections = await prisma.collection.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wrapCollection(collections));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/collections/:documentId
 */
export const getCollection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;

    const collection = await prisma.collection.findUnique({
      where: { documentId },
    });

    if (!collection) {
      res.status(404).json({ error: { message: 'Collection not found' } });
      return;
    }

    res.json(wrapSingle(collection));
  } catch (error) {
    next(error);
  }
};
