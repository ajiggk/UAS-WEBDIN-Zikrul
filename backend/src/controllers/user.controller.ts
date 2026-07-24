import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';

// READ: Mengambil semua data user (Kecuali password untuk keamanan)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // PERBAIKAN: Menghapus 'updated_at' dari query karena kolom tersebut tidak ada di database
        const sqlQuery = 'SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC';
        const [rows] = await pool.execute(sqlQuery);
        
        res.status(200).json({ data: rows });
    } catch (error: any) {
        res.status(500).json({ message: 'Error mengambil data user', error: error.message });
    }
};

// CREATE: Admin menambahkan user baru
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, email, password, role } = req.body;

        if (!nama || !email || !password || !role) {
            res.status(400).json({ message: 'Semua field (nama, email, password, role) wajib diisi.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sqlQuery = 'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)';
        
        await pool.execute(sqlQuery, [nama, email, hashedPassword, role]);
        res.status(201).json({ message: 'User berhasil ditambahkan oleh Admin.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error menambahkan user', error: error.message });
    }
};

// UPDATE: Admin mengubah data user (nama, email, atau role)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { nama, email, role } = req.body;

        const sqlQuery = 'UPDATE users SET nama = ?, email = ?, role = ? WHERE id = ?';
        const [result]: any = await pool.execute(sqlQuery, [nama, email, role, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User tidak ditemukan.' });
            return;
        }

        res.status(200).json({ message: 'Data user berhasil diperbarui.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error memperbarui user', error: error.message });
    }
};

// DELETE: Admin menghapus user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const sqlQuery = 'DELETE FROM users WHERE id = ?';
        const [result]: any = await pool.execute(sqlQuery, [id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User tidak ditemukan.' });
            return;
        }

        res.status(200).json({ message: 'User berhasil dihapus.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error menghapus user', error: error.message });
    }
};