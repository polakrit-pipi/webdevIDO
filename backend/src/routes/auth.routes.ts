import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/local — Login
router.post('/local', login);

export default router;
