import { Router } from 'express';
import { getBarang, createBarang, updateBarang, deleteBarang } from '../controllers/barang.controller';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.get('/', verifyToken, getBarang);
router.post('/', verifyToken, authorizeRole('admin', 'operator'), upload.single('foto'), createBarang);
router.put('/:id', verifyToken, authorizeRole('admin', 'operator'), upload.single('foto'), updateBarang);
router.delete('/:id', verifyToken, authorizeRole('admin', 'operator'), deleteBarang);

export default router;