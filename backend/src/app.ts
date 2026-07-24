import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route';
import barangRoutes from './routes/barang.route';
import kategoriRoutes from './routes/kategori.route';
import userRoutes from './routes/user.route';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan akses publik untuk folder uploads di root backend
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/barang', barangRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Selamat datang di API Sistem Inventaris Lab' });
});

app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});

export default app;