import { Router } from 'express';
import { getBarang, createBarang } from '../controllers/barang.controller';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Semua role bisa melihat daftar barang (beserta pagination, search, filter)
router.get('/', verifyToken, getBarang);

// Hanya Admin dan Operator yang bisa menambah barang dan mengunggah foto
// Urutan middleware penting: Cek Token -> Cek Role -> Tangkap File Foto -> Controller
router.post('/', verifyToken, authorizeRole('admin', 'operator'), upload.single('foto'), createBarang);

export default router;