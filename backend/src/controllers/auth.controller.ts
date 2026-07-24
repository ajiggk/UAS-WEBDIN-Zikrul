import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nama, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'viewer'; 

        const sql = `INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)`;
        await pool.execute(sql, [nama, email, hashedPassword, userRole]);

        res.status(201).json({ message: 'User berhasil didaftarkan.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal register', error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            res.status(404).json({ message: 'User tidak ditemukan.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Password salah.' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.json({ token, role: user.role, nama: user.nama });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal login', error: error.message });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            res.status(404).json({ message: 'Email tidak ditemukan di sistem.' });
            return;
        }

        res.status(200).json({ message: 'Email terverifikasi.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal memproses', error: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            res.status(400).json({ message: 'Email dan password baru wajib diisi.' });
            return;
        }

        const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            res.status(404).json({ message: 'User dengan email tersebut tidak ditemukan.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result]: any = await pool.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Gagal memperbarui password.' });
            return;
        }

        res.status(200).json({ message: 'Password berhasil diubah. Silakan login kembali.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mereset password', error: error.message });
    }
};