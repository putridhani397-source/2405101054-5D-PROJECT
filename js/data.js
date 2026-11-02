const SEED = {
  me: null,
  users: [
    {id:1,nama:'Admin KosKu',email:'admin@kosku.id',no_hp:'081200000001',pw:'admin123',role:'admin',status:'aktif'},
    {id:2,nama:'Hani Chan',email:'hani@mail.com',no_hp:'081200000072',pw:'hani456',role:'penyewa',status:'aktif'}
  ],
  kos: [
    {id:1,nama:'Kos Putri Maharani',alamat:'Jl. Ki Ageng Selo No. 52, dekat kampus',tipe:'putri',fasilitas:'Wi-Fi, dapur bersama, parkir motor, jemuran baju',aturan:'Jam malam 22.00, tamu lawan jenis dilarang',icon:'🌸',status:'aktif'},
    {id:2,nama:'Kos Putra Kai House',alamat:'Jl. Slamet Riyadi No. 64',tipe:'putra',fasilitas:'Wi-Fi, laundry, ruang santai, CCTV',aturan:'Dilarang merokok di kamar',icon:'🏡',status:'aktif'},
    {id:3,nama:'Kos Harmoni Campur',alamat:'Jl. Pahlawan No. 21',tipe:'campur',fasilitas:'Wi-Fi, laundry, parkir mobil',aturan:'Tamu lapor penjaga kos',icon:'🏢',status:'aktif'}
  ],
  rooms: [
    {id:1,kos:1,no:'A01',tipe:'KM dalam',ukuran:'3x3 m',fas:'Kasur, lemari, kamar mandi dalam, kipas angin',harga:600000,status:'tersedia'},
    {id:2,kos:1,no:'A02',tipe:'AC + KM dalam',ukuran:'3x4 m',fas:'AC, kasur, lemari, kamar mandi dalam',harga:1000000,status:'terisi'},
    {id:3,kos:1,no:'A03',tipe:'Standar',ukuran:'3x3 m',fas:'Kasur, lemari, meja belajar',harga:500000,status:'tersedia'},
    {id:4,kos:2,no:'B01',tipe:'Standar',ukuran:'3x3 m',fas:'Kasur, lemari, kipas angin',harga:550000,status:'tersedia'},
    {id:5,kos:2,no:'B02',tipe:'AC + KM dalam',ukuran:'3x4 m',fas:'AC, kasur, lemari, kamar mandi dalam',harga:950000,status:'perawatan'},
    {id:6,kos:3,no:'C01',tipe:'Standar',ukuran:'3x3 m',fas:'Kasur, lemari, meja',harga:700000,status:'tersedia'},
    {id:7,kos:3,no:'C02',tipe:'AC + KM dalam',ukuran:'4x4 m',fas:'AC, kasur, lemari, kamar mandi dalam',harga:1200000,status:'dipesan'}
  ],
  bookings: [
    {id:1,kode:'SWA-20261001-001',user:2,room:2,mulai:'2026-10-01',durasi:6,selesai:'2027-04-01',total:6000000,status:'aktif',dibuat:'2026-09-28',pay:{metode:'transfer_bank',file:'bukti1.jpg',status:'terverifikasi',note:''}},
    {id:2,kode:'SWA-20261030-002',user:2,room:7,mulai:'2026-11-05',durasi:3,selesai:'2027-02-05',total:3600000,status:'menunggu_verifikasi',dibuat:'2026-10-30',pay:{metode:'qris',file:'bukti2.png',status:'menunggu',note:''}}
  ]
};
const DB = JSON.parse(localStorage.getItem('kosku_db') || 'null') || structuredClone(SEED);
const save = () => localStorage.setItem('kosku_db', JSON.stringify(DB));