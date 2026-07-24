```markdown
# Sistem Inventaris Laboratorium Komputer

Aplikasi pengelolaan dan inventaris barang laboratorium berbasis web yang dilengkapi dengan sistem manajemen hak akses (*Role-Based Access Control*), manajemen user, serta fitur autentikasi yang aman.

---

## 🚀 Fitur Utama
* **Autentikasi & Manajemen Akun:** Login, Register, dan Reset/Lupa Password.
* **Manajemen Barang:** Tambah, edit, hapus, dan lihat daftar inventaris barang lab lengkap dengan unggah foto serta pencarian/filter.
* **Manajemen Kategori:** Pengelompokan inventaris berdasarkan kategori tertentu.
* **Manajemen User (Khusus Admin):** Mengontrol daftar pengguna dan mengatur *role* akun secara langsung.

---

## 🛠️ Teknologi yang Digunakan
* **Frontend:** Next.js (App Router), Tailwind CSS, TypeScript
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** MySQL
* **Keamanan:** JSON Web Token (JWT), Bcrypt.js

---

## ⚙️ Cara Instalasi & Konfigurasi

Pastikan komputer Anda sudah terpasang **Node.js** dan **XAMPP / MySQL**.

### 1. Clone Repository & Setup Database
1. Clone repository ini ke komputer Anda:
   ```bash
   git clone [https://github.com/USERNAME_ANDA/NAMA_REPOSITORY.git](https://github.com/USERNAME_ANDA/NAMA_REPOSITORY.git)
   cd NAMA_REPOSITORY

```

2. Buat database baru di MySQL (phpMyAdmin) dengan nama **`inventaris_lab`**.

---

### 2. Konfigurasi & Menjalankan Backend

1. Masuk ke folder backend:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. Buat file `.env` di dalam folder `backend`, lalu sesuaikan konfigurasi berikut:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventaris_lab
JWT_SECRET=rahasia_jwt_inventaris_lab_sangat_aman

```


4. Jalankan server backend:
```bash
npm run dev

```


*(Backend akan berjalan di `http://localhost:5000`)*

---

### 3. Konfigurasi & Menjalankan Frontend

1. Buka terminal baru, lalu masuk ke folder frontend:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Jalankan server frontend:
```bash
npm run dev

```


4. Buka browser dan akses **`http://localhost:3000`**.

---

## 👥 Daftar Akun Uji Coba (Seed Accounts)

Anda dapat mendaftarkan akun baru melalui halaman Register, atau menggunakan *role* berikut untuk pengujian:

| Role | Hak Akses |
| --- | --- |
| **Admin** | Akses penuh (Manajemen Barang, Kategori, dan Manajemen User). |
| **Operator** | Dapat mengelola data barang dan kategori. |
| **Viewer** | Hanya dapat melihat daftar inventaris tanpa dapat mengubah/menghapus data. |

---

## 📡 Daftar Endpoint API (Backend)

Berikut adalah daftar *endpoint* utama yang tersedia pada REST API backend:

### **Autentikasi (`/api/auth`)**

* `POST /api/auth/register` — Mendaftarkan akun user baru.
* `POST /api/auth/login` — Masuk ke sistem dan mendapatkan token JWT serta *role*.
* `POST /api/auth/forgot-password` — Memverifikasi email untuk proses lupa password.
* `POST /api/auth/reset-password-direct` — Mengubah/mereset password baru secara langsung.

### **Barang (`/api/barang`)**

* `GET /api/barang` — Mengambil seluruh data barang.
* `POST /api/barang` — Menambahkan barang baru *(Admin/Operator)*.
* `PUT /api/barang/:id` — Mengubah data barang berdasarkan ID *(Admin/Operator)*.
* `DELETE /api/barang/:id` — Menghapus barang berdasarkan ID *(Admin/Operator)*.

### **Kategori (`/api/kategori`)**

* `GET /api/kategori` — Mengambil daftar kategori.
* `POST /api/kategori` — Menambahkan kategori baru *(Admin/Operator)*.
* `DELETE /api/kategori/:id` — Menghapus kategori *(Admin/Operator)*.

### **Manajemen User (`/api/users` - Khusus Admin)**

* `GET /api/users` — Mengambil daftar seluruh pengguna sistem.
* `DELETE /api/users/:id` — Menghapus akun pengguna.

```

```
