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