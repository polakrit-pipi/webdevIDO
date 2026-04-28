import { Router } from 'express';
import { getMe } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/users/me — Get current user with populated relations
router.get('/me', authenticate, getMe);

export default router;
