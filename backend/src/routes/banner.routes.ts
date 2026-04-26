import { Router } from 'express';
import { getBanner } from '../controllers/banner.controller';

const router = Router();

// GET /api/banner — Single-type endpoint
router.get('/', getBanner);

export default router;
