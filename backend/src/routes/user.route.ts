import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { updateUserRole } from '../controllers/auth.controller'; // Impor fungsi update role
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// ==========================================
// MIDDLEWARE TINGKAT ROUTER
// ==========================================
router.use(verifyToken, authorizeRole('admin'));

// ==========================================
// ENDPOINTS
// ==========================================
router.get('/', getUsers);          // Mengambil data user
router.post('/', createUser);       // Menambah user baru
router.put('/:id', updateUser);     // Mengubah data user (butuh parameter id)
router.put('/:id/role', updateUserRole); // <--- TAMBAHKAN RUTE INI UNTUK UBAH ROLE
router.delete('/:id', deleteUser);  // Menghapus user (butuh parameter id)

export default router;