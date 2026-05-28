import { Router } from 'express';
import { getTransactions, getTransaction, createTransaction, submitSlip } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getTransactions);
router.get('/:documentId', authenticate, getTransaction);
router.post('/', authenticate, createTransaction);
router.put('/:documentId/slip', authenticate, submitSlip);

export default router;
