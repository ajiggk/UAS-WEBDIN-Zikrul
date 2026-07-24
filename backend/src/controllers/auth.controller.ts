import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { transporter } from '../config/mailer';

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

        const user = rows[0];

        // Buat token khusus reset password yang berlaku 15 menit
        const resetToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        // Tautan frontend tempat user memasukkan password baru
        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

        // MENCETAK LINK KE TERMINAL SUPAYA MUDAH DIUJI UNTUK AKUN DUMMY
        console.log(`\n==================================================`);
        console.log(`LINK RESET PASSWORD UNTUK (${user.email}):`);
        console.log(resetLink);
        console.log(`==================================================\n`);

        // Kirim email menggunakan Nodemailer dengan SMTP Gmail
        await transporter.sendMail({
            from: `"Inventaris Lab" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Permintaan Reset Password - Inventaris Lab',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #059669;">Reset Password Akun</h2>
                    <p>Halo <b>${user.nama}</b>,</p>
                    <p>Anda menerima email ini karena ada permintaan untuk mereset kata sandi akun Inventaris Lab Anda.</p>
                    <p>Silakan klik tautan di bawah ini untuk melanjutkan (tautan berlaku 15 menit):</p>
                    <a href="${resetLink}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; margin-bottom: 10px;">Reset Password</a>
                    <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan saja email ini.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                    <p style="font-size: 12px; color: #777;">Sistem Inventaris Lab Otomatis</p>
                </div>
            `,
        });

        res.status(200).json({ message: 'Tautan reset password berhasil dikirim ke email.' });
    } catch (error: any) {
        console.error('Gagal kirim email:', error);
        res.status(500).json({ message: 'Gagal mengirim email reset password', error: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            res.status(400).json({ message: 'Token dan password baru wajib diisi.' });
            return;
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result]: any = await pool.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, decoded.email]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User tidak ditemukan.' });
            return;
        }

        res.status(200).json({ message: 'Password berhasil diubah. Silakan login kembali.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mereset password', error: error.message });
    }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role) {
            res.status(400).json({ message: 'Role baru wajib diisi.' });
            return;
        }

        const [result]: any = await pool.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User tidak ditemukan.' });
            return;
        }

        res.status(200).json({ message: 'Role user berhasil diperbarui.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal memperbarui role', error: error.message });
    }
};