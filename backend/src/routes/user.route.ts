import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// ==========================================
// MIDDLEWARE TINGKAT ROUTER
// ==========================================
// Variabel router.use akan menerapkan verifyToken dan authorizeRole('admin') 
// ke SEMUA endpoint yang ada di bawahnya. Ini mencegah kebocoran akses.
router.use(verifyToken, authorizeRole('admin'));

// ==========================================
// ENDPOINTS
// ==========================================
// Rute-rute ini otomatis merujuk pada /api/users jika didaftarkan dengan benar di app.ts
router.get('/', getUsers);          // Mengambil data user
router.post('/', createUser);       // Menambah user baru
router.put('/:id', updateUser);     // Mengubah data user (butuh parameter id)
router.delete('/:id', deleteUser);  // Menghapus user (butuh parameter id)

export default router;