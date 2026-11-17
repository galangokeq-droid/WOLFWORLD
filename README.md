```
██╗    ██╗ ██████╗ ██╗     ███████╗██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗
██║    ██║██╔═══██╗██║     ██╔════╝██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗
██║ █╗ ██║██║   ██║██║     █████╗  ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║
██║███╗██║██║   ██║██║     ██╔══╝  ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║
╚███╔███╔╝╚██████╔╝███████╗██║     ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝
 ╚══╝╚══╝  ╚═════╝ ╚══════╝╚═╝      ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝

  > Owner & Admin Control Center
  > pesanan · pembayaran · pelanggan · produk · laporan — satu panel
```

<p align="center">
  <img src="https://img.shields.io/badge/status-in%20development-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/frontend-HTML%20%7C%20CSS%20%7C%20JS-blue?style=flat-square&logo=javascript&logoColor=white" />
  <img src="https://img.shields.io/badge/backend-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/deploy-Vercel-black?style=flat-square&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/access-private-lightgrey?style=flat-square" />
</p>

---

**WOLFWORLD Control Center** adalah panel internal untuk Owner dan Admin. Semua hak akses ditentukan di database lewat Row Level Security (RLS), jadi browser tidak pernah dipercaya untuk menentukan role sendiri.

## Visi

Menjadi platform bisnis digital yang rapi, transparan, dan mudah dikelola, sehingga setiap pesanan, pembayaran, dan proyek bisa dipantau dari satu tempat.

## Misi

1. Menyediakan satu panel kendali untuk seluruh operasional WOLFWORLD.
2. Menjaga keamanan data dengan hak akses yang jelas untuk setiap peran.
3. Mencatat setiap aktivitas penting agar keputusan bisnis selalu bisa ditelusuri.
4. Menyajikan laporan keuangan yang akurat dan mudah dipahami.
5. Membuat pengelolaan layanan dan pelanggan lebih cepat, dari HP maupun desktop.

## Fitur

| Modul | Status |
|---|---|
| Login dan pengecekan role | Dalam pengerjaan |
| Dashboard ringkasan | Dalam pengerjaan |
| Pesanan dan pembayaran | Dalam pengerjaan |
| Pelanggan dan proyek | Belum dimulai |
| Produk, layanan, dan kategori | Belum dimulai |
| Laporan keuangan dan pengeluaran | Belum dimulai |
| Admin dan permission | Belum dimulai |
| Support, log aktivitas, konten website, portofolio, promo | Belum dimulai |

## Keamanan

- Hanya **publishable key** Supabase yang ada di frontend. Service role key tidak pernah dipakai di browser.
- Semua tabel publik memakai **RLS**.
- Aksi yang menulis log aktivitas dijalankan lewat **fungsi database**, bukan langsung dari browser.
- Role dibaca dari database, bukan dari data yang dikirim browser.

## Teknologi

- **Frontend:** HTML, CSS, JavaScript (ES Modules), tanpa build step
- **Backend:** Supabase (Auth, PostgreSQL, RLS, RPC)
- **Deploy:** Vercel (static hosting)
- **Desain:** tema light blue dengan efek liquid glass, responsif untuk desktop, tablet, dan HP

## Struktur

```
index.html      Seluruh aplikasi (login, dashboard, modul)
css/            Styling (variables, reset, components, layout, navigation, modules, responsive)
```

## Menjalankan

Tidak perlu instalasi. Buka lewat deploy Vercel, lalu login dengan akun Owner.

## Roadmap

1. Login, dashboard, dan pesanan berjalan stabil
2. Pelanggan, proyek, dan produk
3. Laporan keuangan
4. Admin dan manajemen permission
5. Konten website, portofolio, dan promo

---

<p align="center"><sub>WOLFWORLD · Private project</sub></p>