
# Dokumentasi Huawei Test

## Deskripsi 
Proyek ini dikembangkan sebagai bagian dari evaluasi teknis yang mencakup kemampuan:
- Membangun API menggunakan Node.js dan Express.
- Mengimplementasikan otomasi pengambilan data eksternal (data collection automation) menggunakan cron job.
- Melakukan manajemen data melalui mekanisme pembersihan otomatis (data cleansing).
- Menggunakan PostgreSQL sebagai sistem basis data untuk menjalankan query dan menyelesaikan studi kasus terkait SQL.

## Teknologi yang digunakan

| Komponen                        | Teknologi                    |
| ------------------------------- | ---------------------------- |
| Bahasa Pemrograman              | JavaScript (Node.js Runtime) |
| Backend API                     | Express.js                   |
| Automasi                        | Cron Job (Linux crontab)     |
| Database                        | PostgreSQL                   |
| Sistem Operasi Direkomendasikan | Linux / MacOS                |

## Clone

```bash
git clone https://github.com/wisenuuu/huawei_test.git
cd huawei_test
```
    
## Struktur Direktori Proyek

```bash
huawei_test/
│
├── 1_api/                      # Backend API (Node.js + Express)
│   ├── index.js
│   ├── controllers/
│   │   └── user.controller.js
│   ├── routes/
│   │   └── user.route.js
│   ├── public/
│   │   ├── index.html
│   │   ├── create.html
│   │   ├── delete.html
│   │   └── update.html
│   └── package.json
│
├── 2_automation/               # Automation scripts (Cron jobs)
│   ├── index.js                # Script: collect data
│   ├── delete.js               # Script: delete old files
│   └── home/cron/              # Output directory for generated files
│
├── 3_query/                    # SQL database setup + answers
│   └── query.sql
│
└── README.md
```

## Installation

### 1_api

Masuk ke direktori
```bash
  cd 1_api
  npm install
```

Menjalankan 1_api
```bash
  node index.js
```
Project akan berjalan di http://localhost:3000/

### 2_automation
Masuk ke direktori
```bash
  cd 2_automation
  npm install
```
Jalankan Perintah
```bash
  pwd
```
Ini bertujuan untuk mendapatkan direktori absolut anda, kemudian catat direktori tersebut.

Buka crontab
```bash
  crontab -e
```
Lalu tambahkan ke dalam cronnya seperti dibawah ini untuk menjalankan index.js yang berjalan pada pukul 8.00 WIB, 12.00 WIB, 15.00 WIB
```bash
0 8,12,15 * * * node /path/huawei_test/2_automation/index.js
```
Tambahkan delete.js untuk menghapus file yang berada di home/cron/ setiap sebulan sekalinya kedalam cron
```bash
0 0 1 * * node /path/huawei_test/2_automation/delete.js
```

### 3_query
Pada direktori 3_query terdapat sebuah file SQL yang telah disiapkan lengkap dengan perintah CREATE TABLE serta data dan jawaban dari soal. File ini dapat langsung dijalankan untuk mengeksekusi seluruh query tanpa memerlukan penyiapan tambahan.