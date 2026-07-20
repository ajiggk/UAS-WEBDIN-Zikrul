import { Request, Response } from 'express';
import pool from '../config/database';

export const getKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        // sqlQuery: Variabel string untuk menyimpan perintah SQL yang mengambil seluruh data kategori
        const sqlQuery = 'SELECT * FROM kategori_barang ORDER BY nama_kategori ASC';
        
        // rows: Variabel array destrukturisasi yang menampung hasil eksekusi query dari database
        const [rows] = await pool.execute(sqlQuery);
        
        res.status(200).json({ data: rows });
    } catch (error: any) {
        res.status(500).json({ message: 'Error mengambil data kategori', error: error.message });
    }
};

export const createKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        // nama_kategori: Variabel yang diekstrak dari body request (inputan dari frontend)
        const { nama_kategori } = req.body;

        if (!nama_kategori) {
            res.status(400).json({ message: 'Nama kategori wajib diisi.' });
            return;
        }

        const sqlQuery = 'INSERT INTO kategori_barang (nama_kategori) VALUES (?)';
        // result: Menampung metadata hasil eksekusi (seperti ID yang baru saja dibuat)
        const [result]: any = await pool.execute(sqlQuery, [nama_kategori]);

        res.status(201).json({ 
            message: 'Kategori berhasil ditambahkan', 
            id: result.insertId 
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error menambahkan kategori', error: error.message });
    }
};

export const updateKategori = async (req: Request, res: Response): Promise<void> => {
    try {
        // id: Variabel parameter dari URL (misal: /api/kategori/5)
        const { id } = req.params;
        const { nama_kategori } = req.body;

        const sqlQuery = 'UPDATE kategori_barang SET nama_kategori = ? WHERE id = ?';
        const [result]: any = await pool.execute(sqlQuery, [nama_kategori, id]);

        // affectedRows: Variabel numerik bawaan MySQL untuk mengecek apakah ada baris yang berhasil diubah
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Kategori tidak ditemukan.' });
            return;
        }

        res.status(200).json({ message: 'Kategori berhasil diperbarui.' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error memperbarui kategori', error: error.message });
    }
};