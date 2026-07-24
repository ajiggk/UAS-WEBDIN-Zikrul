import { Request, Response } from 'express';
import pool from '../config/database';
import fs from 'fs';
import path from 'path';

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

        baseSql += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
        
        const queryParamsWithLimit = [...queryParams, Number(limit), Number(offset)];
        const [rows] = await pool.query(baseSql, queryParamsWithLimit);

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

export const updateBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah } = req.body;
        const fotoBaru = req.file ? req.file.filename : null;

        // Ambil data foto lama
        const [oldRows]: any = await pool.execute('SELECT foto FROM barang WHERE id = ?', [id]);
        let fotoFinal = oldRows.length > 0 ? oldRows[0].foto : null;

        if (fotoBaru) {
            if (fotoFinal) {
                const oldPath = path.join(__dirname, '../../uploads', fotoFinal);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            fotoFinal = fotoBaru;
        }

        const sql = `UPDATE barang SET kode_barang = ?, nama_barang = ?, kategori_id = ?, kondisi = ?, lokasi = ?, jumlah = ?, foto = ? WHERE id = ?`;
        const values = [kode_barang, nama_barang, kategori_id, kondisi, lokasi, jumlah, fotoFinal, id];

        await pool.execute(sql, values);
        res.status(200).json({ message: 'Barang berhasil diupdate' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error mengupdate barang', error: error.message });
    }
};

export const deleteBarang = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const [oldRows]: any = await pool.execute('SELECT foto FROM barang WHERE id = ?', [id]);
        if (oldRows.length > 0 && oldRows[0].foto) {
            const fotoPath = path.join(__dirname, '../../uploads', oldRows[0].foto);
            if (fs.existsSync(fotoPath)) {
                fs.unlinkSync(fotoPath);
            }
        }

        await pool.execute('DELETE FROM barang WHERE id = ?', [id]);
        res.status(200).json({ message: 'Barang berhasil dihapus' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error menghapus barang', error: error.message });
    }
};