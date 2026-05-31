import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Public ─────────────────────────────────────────────

/** GET /uniform-projects — list all published projects */
export async function listUniformProjects(req: Request, res: Response) {
  try {
    const { category, featured, page = '1', limit = '20' } = req.query;

    const where: Record<string, unknown> = {
      publishedAt: { not: null },
    };
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [projects, total] = await Promise.all([
      prisma.uniformProject.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take,
        skip,
      }),
      prisma.uniformProject.count({ where }),
    ]);

    res.json({ projects, total, page: parseInt(page as string, 10), limit: take });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/** GET /uniform-projects/:id */
export async function getUniformProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await prisma.uniformProject.findFirst({
      where: {
        OR: [
          { id: isNaN(Number(id)) ? undefined : Number(id) },
          { documentId: typeof id === 'string' ? id : undefined },
        ],
        publishedAt: { not: null },
      },
    });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// ─── Admin (protected) ───────────────────────────────────

/** GET /admin/uniform-projects */
export async function adminListUniformProjects(req: Request, res: Response) {
  try {
    const { category, page = '1', limit = '50' } = req.query;
    const where: Record<string, unknown> = {};
    if (category) where.category = category;

    const take = parseInt(limit as string, 10);
    const skip = (parseInt(page as string, 10) - 1) * take;

    const [projects, total] = await Promise.all([
      prisma.uniformProject.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      prisma.uniformProject.count({ where }),
    ]);
    res.json({ projects, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/** POST /admin/uniform-projects */
export async function adminCreateUniformProject(req: Request, res: Response) {
  try {
    const {
      title, clientName, category, description,
      images, coverImage, tags, quantity, material, featured, publishedAt,
    } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = await prisma.uniformProject.create({
      data: {
        title,
        clientName: clientName || null,
        category: category || 'Work Uniform',
        description: description || null,
        images: images || null,
        coverImage: coverImage || null,
        tags: Array.isArray(tags) ? tags : [],
        quantity: quantity ? parseInt(quantity, 10) : null,
        material: material || null,
        featured: featured === true || featured === 'true',
        publishedAt: publishedAt !== undefined ? (publishedAt ? new Date(publishedAt) : null) : new Date(),
      },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/** PUT /admin/uniform-projects/:id */
export async function adminUpdateUniformProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      title, clientName, category, description,
      images, coverImage, tags, quantity, material, featured, publishedAt,
    } = req.body;

    const existing = await prisma.uniformProject.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    const project = await prisma.uniformProject.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(clientName !== undefined && { clientName }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(images !== undefined && { images }),
        ...(coverImage !== undefined && { coverImage }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
        ...(quantity !== undefined && { quantity: quantity ? parseInt(quantity, 10) : null }),
        ...(material !== undefined && { material }),
        ...(featured !== undefined && { featured: featured === true || featured === 'true' }),
        ...(publishedAt !== undefined && { publishedAt: publishedAt ? new Date(publishedAt) : null }),
      },
    });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

/** DELETE /admin/uniform-projects/:id */
export async function adminDeleteUniformProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.uniformProject.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: 'Not found' });

    await prisma.uniformProject.delete({ where: { id: Number(id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
