import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getTransactions, getTransaction, createTransaction, submitSlip, requestReturn } from '../controllers/transaction.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// ── Multer config for slip uploads (same as admin upload) ─────
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './public/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Upload slip image — authenticated user (NOT admin)
router.post('/upload-slip', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: { message: 'No file uploaded' } });
    return;
  }
  const relativePath = `/uploads/${req.file.filename}`;
  res.json({ url: relativePath });
});

router.get('/', authenticate, getTransactions);
router.get('/:documentId', authenticate, getTransaction);
router.post('/', authenticate, createTransaction);
router.put('/:documentId/slip', authenticate, submitSlip);

// ── Return request — customer initiates a return/replacement ──
router.post('/:documentId/return', authenticate, requestReturn);

export default router;
