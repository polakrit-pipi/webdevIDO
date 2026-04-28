import { Router } from 'express';
import { getCategories, getCategory } from '../controllers/category.controller';

const router = Router();

router.get('/', getCategories);
router.get('/:documentId', getCategory);

export default router;
