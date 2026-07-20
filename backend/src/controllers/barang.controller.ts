import { Request, Response } from 'express';
import pool from '../config/database';

export const getBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        
        const search = req.query.search as string;
        const kategori_id = req.query.kategori_id as string;
        const kondisi = req.query.kondisi as string;

        let baseSql = `SELECT b.*, k.nama_kategori FROM barang b JOIN kategori_barang k ON b.kategori_id = k.id WHERE 1=1`;
        let countSql = `SELECT COUNT(*) as total FROM barang b WHERE 1=1`;
        
        const queryParams: any[] = [];

        if (search) {
            baseSql += ` AND (b.nama_barang LIKE ? OR b.kode_barang LIKE ?)`;
            countSql += ` AND (b.nama_barang LIKE ? OR b.kode_barang LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (kategori_id) {
            baseSql += ` AND b.kategori_id = ?`;
            countSql += ` AND b.kategori_id = ?`;
            queryParams.push(kategori_id);
        }

        if (kondisi) {
            baseSql += ` AND b.kondisi = ?`;
            countSql += ` AND b.kondisi = ?`;
            queryParams.push(kondisi);
        }

        const [countResult]: any = await pool.execute(countSql, queryParams);
        const totalItems = countResult[0].total;

        // Tambahkan Pagination
        baseSql += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit.toString(), offset.toString());

        const [rows] = await pool.execute(baseSql, queryParams);

        res.status(200).json({
            data: rows,
            pagination: {
                total_items: totalItems,
                total_pages: Math.ceil(totalItems / limit),
                current_page: page,
                limit: limit
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error mengambil data barang', error: error.message });
    }
};

export const createBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah } = req.body;
        const foto = req.file ? req.file.filename : null; 

        const sql = `INSERT INTO barang (kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah, foto) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah, foto];

        await pool.execute(sql, values);
        res.status(201).json({ message: 'Barang berhasil ditambahkan' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error menambahkan barang', error: error.message });
    }
};