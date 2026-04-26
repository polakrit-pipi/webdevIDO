import { Router } from 'express';
import { getCollections, getCollection } from '../controllers/collection.controller';

const router = Router();

router.get('/', getCollections);
router.get('/:documentId', getCollection);

export default router;
