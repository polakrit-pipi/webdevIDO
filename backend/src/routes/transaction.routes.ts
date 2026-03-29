import { Router } from 'express';
import { getTransactions, getTransaction, createTransaction } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTransactions);
router.get('/:documentId', authenticate, getTransaction);
router.post('/', authenticate, createTransaction);

export default router;
