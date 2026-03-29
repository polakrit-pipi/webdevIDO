/**
 * Strapi v5-compatible response format utilities.
 * Transforms Prisma query results into the shape the frontend expects.
 */

/**
 * Wrap a single entity in Strapi format: { data: { id, documentId, ...attributes } }
 */
export function wrapSingle(entity: any): { data: any } {
  if (!entity) {
    return { data: null };
  }
  return { data: formatEntity(entity) };
}

/**
 * Wrap a collection in Strapi format: { data: [...], meta: { pagination } }
 */
export function wrapCollection(
  entities: any[],
  meta?: { page?: number; pageSize?: number; total?: number }
): { data: any[]; meta: { pagination: any } } {
  const page = meta?.page || 1;
  const pageSize = meta?.pageSize || 25;
  const total = meta?.total ?? entities.length;

  return {
    data: entities.map(formatEntity),
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
        total,
      },
    },
  };
}

/**
 * Format a Prisma entity to match Strapi v5 flat structure.
 * In Strapi v5, attributes are flattened (no nested .attributes).
 */
function formatEntity(entity: any): any {
  if (!entity) return null;

  // Already has the right shape — Prisma returns flat objects
  // Just ensure media fields have proper URL format
  const result = { ...entity };

  // Convert Decimal fields to numbers for JSON serialization
  for (const key of Object.keys(result)) {
    if (result[key] !== null && typeof result[key] === 'object' && result[key].constructor?.name === 'Decimal') {
      result[key] = parseFloat(result[key].toString());
    }
    // Recursively handle arrays (e.g., variants, items)
    if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) => {
        if (item && typeof item === 'object') {
          return formatEntity(item);
        }
        return item;
      });
    }
    // Recursively handle nested objects (e.g., cat_pro, product)
    if (result[key] !== null && typeof result[key] === 'object' && !Array.isArray(result[key]) && !(result[key] instanceof Date)) {
      if (result[key].constructor?.name !== 'Decimal') {
        // Don't deeply format plain JSON fields — only Prisma relation objects with `id`
        if ('id' in result[key]) {
          result[key] = formatEntity(result[key]);
        }
      }
    }
  }

  return result;
}

/**
 * Parse Strapi-style `populate` query params into Prisma `include` object.
 *
 * Examples:
 *   ?populate=* → include all direct relations
 *   ?populate=categoryPic → include: { categoryPic: true }
 *   ?populate[variants][populate]=* → include: { variants: { include: ... } }
 *   ?populate[cart][populate][items][populate][product][populate][variants][populate]=Image
 */
export function parsePopulate(query: any, modelName: string): any {
  if (!query.populate) return {};

  // Simple case: populate=*
  if (query.populate === '*') {
    return getDefaultIncludes(modelName);
  }

  // Simple case: populate=fieldName
  if (typeof query.populate === 'string') {
    return { [query.populate]: true };
  }

  // Complex case: nested populate object
  if (typeof query.populate === 'object') {
    return buildNestedInclude(query.populate);
  }

  return {};
}

/**
 * Default includes for populate=* per model
 */
function getDefaultIncludes(modelName: string): any {
  const defaults: Record<string, any> = {
    product: {
      variants: true,
      cat_pro: true,
      wishlists: true,
    },
    category: {
      pro_cats: true,
    },
    collection: {},
    banner: {},
    color: {},
    newProduct: {
      product: true,
    },
    cart: {
      items: { include: { product: true } },
    },
    wishlist: {
      product: true,
      user: true,
    },
    transaction: {
      items: { include: { product: true } },
    },
  };

  return defaults[modelName] || {};
}

/**
 * Recursively build Prisma include from Strapi populate object.
 */
function buildNestedInclude(populateObj: any): any {
  const include: any = {};

  for (const [key, value] of Object.entries(populateObj)) {
    if (value === '*' || value === 'true' || value === true) {
      include[key] = true;
    } else if (typeof value === 'object' && value !== null) {
      const nested = value as any;
      if (nested.populate) {
        if (nested.populate === '*') {
          include[key] = { include: getDefaultIncludes(key) };
        } else if (typeof nested.populate === 'object') {
          include[key] = { include: buildNestedInclude(nested.populate) };
        } else if (typeof nested.populate === 'string') {
          include[key] = { include: { [nested.populate]: true } };
        }
      } else {
        // Could be a deeper structure without explicit 'populate' key
        include[key] = { include: buildNestedInclude(nested) };
      }
    }
  }

  return include;
}
