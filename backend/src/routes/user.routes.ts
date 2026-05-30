import { Router } from 'express';
import { getMe, updateMe } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// GET /api/users/me — Get current user with populated relations
router.get('/me', authenticate, getMe);

// PUT /api/users/me — Update current user profile (name, phone, address)
router.put('/me', authenticate, updateMe);

export default router;
