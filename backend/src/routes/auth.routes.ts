import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/local — Login
router.post('/local', login);

export default router;
