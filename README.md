# Pengumpulan UTS Pemrograman Web Dasar 

## Identitas Mahasiswa

- Nama: Putri Ramadhani Pasyawati
- NIM: 2405101054
- Kelas: 5D
- Program Studi: Teknik Informatika
- Mata Kuliah: Pemrograman Web Dasar
- Tahun Akademik: 2026

## Deskripsi

Repository ini berisi source code, dokumentasi hasil pengerjaan Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web Dasar berupa aplikasi website penyewaan kos bernama **KosKu**.

## Deskripsi Pengerjaan UTS

Aplikasi **KosKu** dikembangkan sebagai *Single Page Application* (SPA) berbasis web frontend menggunakan HTML5, CSS3, dan JavaScript murni dengan penyimpanan data sementara menggunakan `localStorage`. Aplikasi ini dirancang untuk memudahkan pencarian kamar kos, pengelolaan data kos, pengajuan sewa, hingga verifikasi pembayaran oleh admin tanpa memerlukan instalasi database kompleks (seperti PHP/MySQL) pada tahap UTS ini.

## Fitur yang Diimplementasikan

1. **Sistem Multi-Role (Hak Akses)**: Pemisahan tampilan dan hak akses antara Pengunjung, Penyewa, dan Administrator.
2. **Pencarian & Filter Kos**: Fitur pencarian berdasarkan nama/lokasi, filter tipe kos (putra/putri/campur), serta batas harga maksimal.
3. **Pengajuan & Manajemen Sewa**: Alur pemesanan kamar lengkap dengan perhitungan total harga otomatis berdasarkan durasi bulan.
4. **Unggah Bukti Pembayaran**: Fitur simulasi pembayaran dengan opsi metode transfer bank, e-wallet, atau QRIS beserta validasi file.
5. **Dashboard & Kelola Admin**: Panel kontrol admin untuk verifikasi pembayaran, manajemen data kos, kamar, pengguna, serta laporan pendapatan bulanan.

## Struktur Folder

- `KosKu/`: Folder utama yang berisi source code aplikasi (index.html, aset CSS, dan logika JavaScript).
- `README.md`: Dokumentasi penjelasan projek UTS.

## Cara Menjalankan Aplikasi

1. Pastikan memiliki browser (Google Chrome, Mozilla Firefox, atau Microsoft Edge).
2. Unduh atau *clone* repository ini ke perangkat komputer.
3. Masuk ke dalam folder `KosKu/`.
4. Buka file **`index.html`** dengan cara klik dua kali atau klik kanan lalu pilih *Open with* browser.
5. **Akun Demo Login**:
   - **Admin**: `admin@kosku.id` / `admin123`
   - **Penyewa**: `hani@mail.com` / `hani456`

## Referensi

- Modul Praktikum Pemrograman Web Dasar
