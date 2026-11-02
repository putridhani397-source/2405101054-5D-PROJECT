const $ = s => document.querySelector(s);
const rp = n => 'Rp ' + Number(n).toLocaleString('id-ID');
const me = () => DB.users.find(u => u.id === DB.me);
const badge = s => `<span class="badge b-${s}">${s.replace('_', ' ')}</span>`;
const toast = t => { const e = $('#toast'); e.textContent = t; e.className = 'on'; setTimeout(() => e.className = '', 2200); };
const go = h => location.hash = h;
const addM = (d, m) => { const x = new Date(d); x.setMonth(x.getMonth() + m); return x.toISOString().slice(0, 10); };
const kosOf = id => DB.kos.find(k => k.id === id);
const roomOf = id => DB.rooms.find(r => r.id === id);
const minHarga = k => Math.min(...DB.rooms.filter(r => r.kos === k.id).map(r => r.harga));
const freeCount = k => DB.rooms.filter(r => r.kos === k.id && r.status === 'tersedia').length;
const need = role => { const u = me(); if (!u) { toast('Silakan login dahulu'); go('#/login'); return false; } if (role && u.role !== role) { toast('Akses ditolak'); go('#/'); return false; } return true; };
const table = (head, rows) => `<div class="scroll"><table class="tbl"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${head.length}">Tidak ada data.</td></tr>`}</table></div>`;
const kosCard = k => `<div class="card"><div class="img">${k.icon}</div><div class="body"><h3>${k.nama}</h3><div class="muted">${k.alamat}</div><p>${badge(k.tipe)} <span class="muted">${freeCount(k)} kamar tersedia</span></p><b>mulai ${rp(minHarga(k))}</b>/bln<p><a class="btn sm" href="#/kos/${k.id}">Lihat detail</a></p></div></div>`;

function renderMenu() {
  const u = me(), a = (h, t) => `<a href="${h}">${t}</a>`;
  $('#menu').innerHTML = !u ? a('#/', 'Beranda') + a('#/kos', 'Daftar Kos') + a('#/login', 'Login') + a('#/daftar', 'Daftar')
    : u.role === 'admin' ? a('#/admin', 'Dashboard') + a('#/admin/kos', 'Kos') + a('#/admin/kamar', 'Kamar') + a('#/admin/sewa', 'Sewa & Pembayaran') + a('#/admin/pengguna', 'Pengguna') + a('#/admin/laporan', 'Laporan') + a('#/profil', 'Profil') + `<a href="#" onclick="A.logout()">Logout</a>`
    : a('#/', 'Beranda') + a('#/kos', 'Daftar Kos') + a('#/riwayat', 'Riwayat Sewa') + a('#/profil', 'Profil') + `<a href="#" onclick="A.logout()">Logout (${u.nama.split(' ')[0]})</a>`;
}

const V = {};
V.home = () => `<div class="hero"><h1>Temukan kos impianmu, sewa dalam hitungan menit</h1><p>Cari, bandingkan, dan pesan kamar kos secara online 24 jam.</p>
<form onsubmit="return A.cari(event)"><input name="q" placeholder="Nama kos atau lokasi..." style="max-width:340px"><button class="btn gray">Cari kos</button></form></div>
<h2>Kos Populer</h2><div class="grid">${DB.kos.filter(k => k.status === 'aktif').map(kosCard).join('')}</div>`;
 
V.kos = p => {
  const q = (p.get('q') || '').toLowerCase(), t = p.get('tipe') || '', mx = +p.get('max') || 0;
  const list = DB.kos.filter(k => k.status === 'aktif' && (k.nama + k.alamat).toLowerCase().includes(q) && (!t || k.tipe === t) && (!mx || minHarga(k) <= mx));
  return `<h2>Daftar Kos</h2><form class="box form wide" onsubmit="return A.filter(event)"><label>Kata kunci<input name="q" value="${p.get('q') || ''}"></label>
<label>Tipe<select name="tipe"><option value="">Semua</option>${['putra', 'putri', 'campur'].map(x => `<option ${t === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
<label>Harga maks (Rp)<input name="max" type="number" min="0" step="50000" value="${mx || ''}"></label><button class="btn">Terapkan filter</button></form>
<div class="grid">${list.map(kosCard).join('') || '<p>Kos tidak ditemukan.</p>'}</div>`;
};
 
V.detail = id => {
  const k = kosOf(+id); if (!k) return '<p>Kos tidak ditemukan.</p>';
  const rs = DB.rooms.filter(r => r.kos === k.id);
  return `<div class="box"><h2>${k.icon} ${k.nama}</h2><p>${badge(k.tipe)} ${k.alamat}</p><p><b>Fasilitas umum:</b> ${k.fasilitas}</p><p><b>Peraturan:</b> ${k.aturan}</p></div>
<h2>Daftar Kamar</h2>${table(['No', 'Tipe', 'Ukuran', 'Fasilitas', 'Harga/bulan', 'Status', 'Aksi'], rs.map(r => [r.no, r.tipe, r.ukuran, r.fas, rp(r.harga), badge(r.status), r.status === 'tersedia' ? `<a class="btn sm" href="#/sewa/${r.id}">Sewa</a>` : '-']))}`;
};
 
V.login = () => `<div class="box form"><h2>Login</h2><form class="form" onsubmit="return A.login(event)"><label>Email<input name="email" type="email" required></label>
<label>Kata sandi<input name="pw" type="password" required></label><button class="btn">Masuk</button></form>
<p class="muted">Demo → Admin: admin@kosku.id / admin123 · Penyewa: hani@mail.com / hani456</p></div>`;
 
V.daftar = () => `<div class="box form"><h2>Registrasi</h2><form class="form" onsubmit="return A.daftar(event)"><label>Nama lengkap<input name="nama" required minlength="3"></label>
<label>Email<input name="email" type="email" required></label><label>Nomor HP<input name="hp" required pattern="08[0-9]{8,12}" placeholder="08xxxxxxxxxx"></label>
<label>Kata sandi<input name="pw" type="password" required minlength="6"></label><label>Ulangi kata sandi<input name="pw2" type="password" required></label><div class="err" id="err"></div><button class="btn">Daftar</button></form></div>`;

V.sewa = id => {
  if (!need('penyewa')) return ''; const r = roomOf(+id), k = r && kosOf(r.kos);
  if (!r || r.status !== 'tersedia') return '<p>Kamar tidak tersedia.</p>';
  const today = new Date().toISOString().slice(0, 10);
  return `<div class="box"><h2>Form Pengajuan Sewa</h2><div class="sum"><b>${k.nama}</b> – Kamar ${r.no} (${r.tipe})<br>Harga: ${rp(r.harga)}/bulan</div>
<form class="form" onsubmit="return A.ajukan(event,${r.id})"><label>Tanggal mulai<input name="mulai" type="date" min="${today}" value="${today}" required></label>
<label>Durasi (bulan)<select name="durasi" oninput="A.hitung(${r.harga})">${[1, 3, 6, 12].map(n => `<option>${n}</option>`).join('')}</select></label>
<div class="sum">Total biaya: <b id="total">${rp(r.harga)}</b></div><button class="btn">Lanjut ke konfirmasi</button></form></div>`;
};
 
V.bayar = id => {
  if (!need('penyewa')) return ''; const b = DB.bookings.find(x => x.id === +id), r = roomOf(b.room), k = kosOf(r.kos);
  return `<div class="box"><h2>Konfirmasi dan Pembayaran</h2><div class="sum"><b>${b.kode}</b> ${badge(b.status)}<br>${k.nama} – Kamar ${r.no}<br>Periode: ${b.mulai} s.d. ${b.selesai} (${b.durasi} bulan)<br>Total: <b>${rp(b.total)}</b><br><span class="muted">Batas waktu bayar: 24 jam setelah pengajuan.</span></div>
${b.status === 'menunggu_bayar' ? `<form class="form" onsubmit="return A.bayar(event,${b.id})"><label>Metode pembayaran<select name="metode"><option value="transfer_bank">Transfer bank</option><option value="e_wallet">E-wallet</option><option value="qris">QRIS</option></select></label>
<label>Unggah bukti bayar<input name="file" type="file" accept="image/*,.pdf" required></label><button class="btn ok">Kirim bukti pembayaran</button> <a class="btn gray" href="#/riwayat/${b.id}">Nanti saja</a></form>` : `<p>Pembayaran: ${badge(b.pay.status)} ${b.pay.note}</p>`}</div>`;
};
 
V.riwayat = p => {
  if (!need('penyewa')) return ''; const f = p.get('s') || '';
  const list = DB.bookings.filter(b => b.user === DB.me && (!f || b.status === f));
  return `<h2>Riwayat Sewa</h2><form class="row" onsubmit="return A.fsewa(event)"><select name="s"><option value="">Semua status</option>${['menunggu_bayar', 'menunggu_verifikasi', 'aktif', 'selesai', 'ditolak', 'dibatalkan'].map(s => `<option ${f === s ? 'selected' : ''}>${s}</option>`).join('')}</select><button class="btn sm">Filter</button></form><br>
${table(['Kode', 'Kos / Kamar', 'Periode', 'Total', 'Status', 'Aksi'], list.map(b => { const r = roomOf(b.room); return [b.kode, kosOf(r.kos).nama + ' / ' + r.no, b.mulai + ' → ' + b.selesai, rp(b.total), badge(b.status), `<a class="btn sm" href="#/riwayat/${b.id}">Detail</a>`]; }))}`;
};
 
V.dsewa = id => {
  if (!need('penyewa')) return ''; const b = DB.bookings.find(x => x.id === +id && x.user === DB.me); if (!b) return '<p>Data tidak ditemukan.</p>';
  const r = roomOf(b.room), k = kosOf(r.kos);
  return `<div class="box"><h2>Detail Sewa ${b.kode}</h2><p>Status: ${badge(b.status)}</p><p><b>${k.nama}</b>, Kamar ${r.no} (${r.tipe}, ${r.ukuran})</p><p>Periode: ${b.mulai} s.d. ${b.selesai} (${b.durasi} bulan)</p><p>Total: <b>${rp(b.total)}</b></p>
<p>Pembayaran: ${badge(b.pay.status || 'menunggu')} ${b.pay.metode ? '· ' + b.pay.metode + ' · ' + b.pay.file : '(belum ada bukti)'} ${b.pay.note ? '· ' + b.pay.note : ''}</p>
${b.status === 'menunggu_bayar' ? `<a class="btn ok" href="#/bayar/${b.id}">Bayar sekarang</a> <button class="btn bad" onclick="A.batal(${b.id})">Batalkan pengajuan</button>` : ''} <a class="btn gray" href="#/riwayat">Kembali</a></div>`;
};
 
V.profil = () => {
  if (!need()) return ''; const u = me();
  return `<div class="box"><h2>Profil Saya</h2><form class="form" onsubmit="return A.profil(event)"><label>Nama<input name="nama" value="${u.nama}" required></label><label>Email<input value="${u.email}" disabled></label>
<label>Nomor HP<input name="hp" value="${u.no_hp}" required pattern="08[0-9]{8,12}"></label><label>Kata sandi baru (opsional)<input name="pw" type="password" minlength="6"></label><button class="btn">Simpan perubahan</button></form></div>`;
};

V.admin = () => {
  if (!need('admin')) return ''; const tot = DB.rooms.length, ter = DB.rooms.filter(r => r.status === 'terisi').length;
  const pend = DB.bookings.filter(b => b.status === 'menunggu_verifikasi'), soon = DB.bookings.filter(b => b.status === 'aktif');
  return `<h2>Dashboard Admin</h2><div class="stats"><div class="stat">Kamar terisi<b>${ter}</b></div><div class="stat">Kamar kosong<b>${DB.rooms.filter(r => r.status === 'tersedia').length}</b></div><div class="stat">Tingkat hunian<b>${Math.round(ter / tot * 100)}%</b></div><div class="stat">Menunggu verifikasi<b>${pend.length}</b></div></div>
<h2>Pembayaran Menunggu Verifikasi</h2>${table(['Kode', 'Penyewa', 'Total', 'Aksi'], pend.map(b => [b.kode, DB.users.find(u => u.id === b.user).nama, rp(b.total), `<a class="btn sm" href="#/admin/sewa">Proses</a>`]))}
<h2 style="margin-top:20px">Sewa Aktif / Akan Berakhir</h2>${table(['Kode', 'Kamar', 'Berakhir'], soon.map(b => [b.kode, roomOf(b.room).no, b.selesai]))}`;
};
 
V.akos = () => need('admin') ? `<h2>Kelola Kos</h2><form class="box form wide" onsubmit="return A.addKos(event)"><label>Nama kos<input name="nama" required></label><label>Alamat<input name="alamat" required></label>
<label>Tipe<select name="tipe"><option>putra</option><option>putri</option><option>campur</option></select></label><label>Fasilitas umum<input name="fas" required></label><button class="btn">Tambah kos</button></form>
${table(['Nama', 'Alamat', 'Tipe', 'Status', 'Aksi'], DB.kos.map(k => [k.nama, k.alamat, badge(k.tipe), badge(k.status), `<button class="btn sm gray" onclick="A.togKos(${k.id})">${k.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>`]))}` : '';
 
V.akamar = () => need('admin') ? `<h2>Kelola Kamar</h2><form class="box form wide" onsubmit="return A.addRoom(event)"><label>Kos<select name="kos">${DB.kos.map(k => `<option value="${k.id}">${k.nama}</option>`).join('')}</select></label><label>Nomor kamar<input name="no" required></label>
<label>Tipe<input name="tipe" required></label><label>Harga/bulan<input name="harga" type="number" min="100000" step="50000" required></label><button class="btn">Tambah kamar</button></form>
${table(['Kos', 'No', 'Tipe', 'Harga', 'Status'], DB.rooms.map(r => [kosOf(r.kos).nama, r.no, r.tipe, rp(r.harga), `<select onchange="A.statRoom(${r.id},this.value)">${['tersedia', 'dipesan', 'terisi', 'perawatan'].map(s => `<option ${r.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>`]))}` : '';
 
V.asewa = () => need('admin') ? `<h2>Kelola Sewa dan Verifikasi Pembayaran</h2>${table(['Kode', 'Penyewa', 'Kamar', 'Bukti', 'Status', 'Aksi'], DB.bookings.map(b => [b.kode, DB.users.find(u => u.id === b.user).nama, roomOf(b.room).no, b.pay.file ? b.pay.metode + '<br>' + b.pay.file : '-', badge(b.status),
  b.status === 'menunggu_verifikasi' ? `<button class="btn sm ok" onclick="A.verif(${b.id},1)">Terima</button> <button class="btn sm bad" onclick="A.verif(${b.id},0)">Tolak</button>` : b.status === 'aktif' ? `<button class="btn sm gray" onclick="A.akhiri(${b.id})">Akhiri sewa</button>` : '-']))}` : '';
 
V.apengguna = () => need('admin') ? `<h2>Kelola Pengguna</h2>${table(['Nama', 'Email', 'HP', 'Peran', 'Status', 'Aksi'], DB.users.map(u => [u.nama, u.email, u.no_hp, u.role, badge(u.status), u.role === 'admin' ? '-' : `<button class="btn sm gray" onclick="A.togUser(${u.id})">${u.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>`]))}` : '';
 
V.alaporan = p => {
  if (!need('admin')) return ''; const m = p.get('m') || new Date().toISOString().slice(0, 7);
  const l = DB.bookings.filter(b => ['aktif', 'selesai'].includes(b.status) && b.dibuat.startsWith(m)), tot = l.reduce((s, b) => s + b.total, 0);
  return `<h2>Laporan Pendapatan</h2><form class="row" onsubmit="return A.fap(event)"><input type="month" name="m" value="${m}" style="width:auto"><button class="btn sm">Tampilkan</button></form>
<div class="stats" style="margin-top:14px"><div class="stat">Total pendapatan<b>${rp(tot)}</b></div><div class="stat">Jumlah sewa<b>${l.length}</b></div><div class="stat">Tingkat hunian<b>${Math.round(DB.rooms.filter(r => r.status === 'terisi').length / DB.rooms.length * 100)}%</b></div></div>
${table(['Kode', 'Kamar', 'Tanggal', 'Total'], l.map(b => [b.kode, roomOf(b.room).no, b.dibuat, rp(b.total)]))}`;
};

const fd = e => { e.preventDefault(); return Object.fromEntries(new FormData(e.target)); };
const A = {
  cari: e => { const d = fd(e); go('#/kos?q=' + encodeURIComponent(d.q)); return false; },
  filter: e => { const d = fd(e); go(`#/kos?q=${encodeURIComponent(d.q)}&tipe=${d.tipe}&max=${d.max}`); return false; },
  login: e => { const d = fd(e), u = DB.users.find(x => x.email === d.email && x.pw === d.pw);
    if (!u) toast('Email atau kata sandi salah'); else if (u.status !== 'aktif') toast('Akun dinonaktifkan');
    else { DB.me = u.id; save(); toast('Selamat datang, ' + u.nama); go(u.role === 'admin' ? '#/admin' : '#/kos'); } return false; },
  logout: () => { DB.me = null; save(); toast('Anda telah logout'); go('#/'); },
  daftar: e => { const d = fd(e), er = $('#err');
    if (d.pw !== d.pw2) { er.textContent = 'Kata sandi tidak sama'; return false; }
    if (DB.users.some(u => u.email === d.email || u.no_hp === d.hp)) { er.textContent = 'Email atau nomor HP sudah terdaftar'; return false; }
    DB.users.push({ id: Date.now(), nama: d.nama, email: d.email, no_hp: d.hp, pw: d.pw, role: 'penyewa', status: 'aktif' }); save(); toast('Registrasi berhasil, silakan login'); go('#/login'); return false; },
  hitung: h => { const n = +document.querySelector('[name=durasi]').value; $('#total').textContent = rp(h * n); },
  ajukan: (e, rid) => { const d = fd(e), r = roomOf(rid), n = +d.durasi, total = r.harga * n;
    if (!confirm(`Konfirmasi pengajuan:\nKamar ${r.no}\nMulai ${d.mulai}, ${n} bulan\nTotal ${rp(total)}\n\nLanjutkan?`)) return false;
    const id = Date.now(); DB.bookings.push({ id, kode: 'SWA-' + d.mulai.replace(/-/g, '') + '-' + String(DB.bookings.length + 1).padStart(3, '0'), user: DB.me, room: rid, mulai: d.mulai, durasi: n, selesai: addM(d.mulai, n), total, status: 'menunggu_bayar', dibuat: new Date().toISOString().slice(0, 10), pay: {} });
    r.status = 'dipesan'; save(); toast('Pengajuan dibuat, silakan bayar'); go('#/bayar/' + id); return false; },
  bayar: (e, id) => { const d = fd(e), b = DB.bookings.find(x => x.id === id), f = e.target.file.files[0];
    if (f && f.size > 2e6) { toast('Ukuran file maksimal 2 MB'); return false; }
    b.pay = { metode: d.metode, file: f ? f.name : '', status: 'menunggu', note: '' }; b.status = 'menunggu_verifikasi'; save(); toast('Bukti terkirim, menunggu verifikasi'); go('#/riwayat/' + id); return false; },
  batal: id => { if (!confirm('Batalkan pengajuan ini?')) return; const b = DB.bookings.find(x => x.id === id); b.status = 'dibatalkan'; roomOf(b.room).status = 'tersedia'; save(); toast('Pengajuan dibatalkan'); route(); },
  fsewa: e => { const d = fd(e); go('#/riwayat?s=' + d.s); return false; },
  profil: e => { const d = fd(e), u = me(); u.nama = d.nama; u.no_hp = d.hp; if (d.pw) u.pw = d.pw; save(); renderMenu(); toast('Profil diperbarui'); return false; },
  addKos: e => { const d = fd(e); DB.kos.push({ id: Date.now(), nama: d.nama, alamat: d.alamat, tipe: d.tipe, fasilitas: d.fas, aturan: '-', icon: '🏠', status: 'aktif' }); save(); toast('Kos ditambahkan'); route(); return false; },
  togKos: id => { const k = kosOf(id); k.status = k.status === 'aktif' ? 'nonaktif' : 'aktif'; save(); route(); },
  addRoom: e => { const d = fd(e); DB.rooms.push({ id: Date.now(), kos: +d.kos, no: d.no, tipe: d.tipe, ukuran: '3x3 m', fas: '-', harga: +d.harga, status: 'tersedia' }); save(); toast('Kamar ditambahkan'); route(); return false; },
  statRoom: (id, s) => { roomOf(id).status = s; save(); toast('Status kamar diubah'); },
  verif: (id, ok) => { const b = DB.bookings.find(x => x.id === id), r = roomOf(b.room);
    if (ok) { b.status = 'aktif'; b.pay.status = 'terverifikasi'; r.status = 'terisi'; } else { b.status = 'menunggu_bayar'; b.pay.status = 'ditolak'; b.pay.note = 'Bukti tidak valid, unggah ulang'; }
    save(); toast(ok ? 'Pembayaran diterima, sewa aktif' : 'Pembayaran ditolak'); route(); },
  akhiri: id => { const b = DB.bookings.find(x => x.id === id); b.status = 'selesai'; roomOf(b.room).status = 'tersedia'; save(); toast('Sewa diakhiri'); route(); },
  togUser: id => { const u = DB.users.find(x => x.id === id); u.status = u.status === 'aktif' ? 'nonaktif' : 'aktif'; save(); route(); },
  fap: e => { const d = fd(e); go('#/admin/laporan?m=' + d.m); return false; }
};

function route() {
  const [path, qs] = (location.hash.slice(1) || '/').split('?'), p = new URLSearchParams(qs || ''), s = path.split('/').filter(Boolean);
  const k = s.join('/'); let html;
  if (k === '') html = V.home(); else if (k === 'kos') html = V.kos(p); else if (s[0] === 'kos') html = V.detail(s[1]);
  else if (k === 'login') html = V.login(); else if (k === 'daftar') html = V.daftar(); else if (s[0] === 'sewa') html = V.sewa(s[1]);
  else if (s[0] === 'bayar') html = V.bayar(s[1]); else if (k === 'riwayat') html = V.riwayat(p); else if (s[0] === 'riwayat') html = V.dsewa(s[1]);
  else if (k === 'profil') html = V.profil(); else if (k === 'admin') html = V.admin(); else if (k === 'admin/kos') html = V.akos();
  else if (k === 'admin/kamar') html = V.akamar(); else if (k === 'admin/sewa') html = V.asewa(); else if (k === 'admin/pengguna') html = V.apengguna();
  else if (k === 'admin/laporan') html = V.alaporan(p); else html = '<p>Halaman tidak ditemukan.</p>';
  $('#app').innerHTML = html; renderMenu(); window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route); route();