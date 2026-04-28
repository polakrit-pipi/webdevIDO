import { Router } from 'express';
import { getColor } from '../controllers/color.controller';

const router = Router();

// GET /api/color — Single-type endpoint
router.get('/', getColor);

export default router;
