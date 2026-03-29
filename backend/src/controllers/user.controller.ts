import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * GET /api/users/me
 * Returns the current user with populated relations based on query params.
 * Supports Strapi-style deep populate queries.
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user.id;

    // Parse the complex populate query params
    const include = parseMePopulate(req.query);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include,
    });

    if (!user) {
      res.status(404).json({ error: { message: 'User not found' } });
      return;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

/**
 * Parse the deep populate parameters for /api/users/me.
 * 
 * Frontend sends complex queries like:
 *   populate[wishlists][populate][product][populate][variants][populate]=Image
 *   populate[cart][populate][items][populate][product][populate][variants][populate]=Image
 */
function parseMePopulate(query: any): any {
  const include: any = {};

  if (!query.populate) return include;

  const pop = query.populate;

  // Handle wishlists populate
  if (pop.wishlists) {
    include.wishlists = buildRelationInclude(pop.wishlists);
  }

  // Handle cart populate
  if (pop.cart) {
    include.cart = buildRelationInclude(pop.cart);
  }

  // Handle transactions populate
  if (pop.transactions) {
    include.transactions = buildRelationInclude(pop.transactions);
  }

  return include;
}

/**
 * Recursively build Prisma include from Strapi-style populate.
 */
function buildRelationInclude(config: any): any {
  if (config === '*' || config === 'true' || config === true) {
    return true;
  }

  if (typeof config !== 'object') return true;

  const result: any = { include: {} };

  if (config.populate) {
    for (const [field, fieldConfig] of Object.entries(config.populate)) {
      if (typeof fieldConfig === 'string' && fieldConfig !== '*') {
        // e.g., populate[variants][populate]=Image → include variants with Image
        result.include[field] = true;
      } else if (typeof fieldConfig === 'object') {
        result.include[field] = buildRelationInclude(fieldConfig as any);
      } else {
        result.include[field] = true;
      }
    }
  }

  // If no includes were built, just return true
  if (Object.keys(result.include).length === 0) {
    return true;
  }

  return result;
}
