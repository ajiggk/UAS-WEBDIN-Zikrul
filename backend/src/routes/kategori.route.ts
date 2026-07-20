import { Router } from 'express';
import { getKategori, createKategori, updateKategori } from '../controllers/kategori.controller';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Semua user yang sudah login (termasuk Viewer) bisa melihat daftar kategori
router.get('/', verifyToken, getKategori);

// Hanya Admin dan Operator yang diizinkan untuk menambah dan mengubah kategori
router.post('/', verifyToken, authorizeRole('admin', 'operator'), createKategori);
router.put('/:id', verifyToken, authorizeRole('admin', 'operator'), updateKategori);

export default router;