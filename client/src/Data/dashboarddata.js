// ─── Summary Metrics ─────────────────────────────────────────────────────────
export const summaryMetrics = {
  totalSaldo: 24500000,
  totalPemasukan: 12800000,
  totalPengeluaran: 7300000,
  totalTabungan: 5500000,
  perubahan: {
    saldo: +8.3,
    pemasukan: +12.9,
    pengeluaran: -5.1,
    tabungan: +25.4,
  },
}

// ─── Chart Data: Bulanan ──────────────────────────────────────────────────────
export const dataChart = {
  bulanan: [
    { label: 'Jan', pemasukan: 8200000,  pengeluaran: 5100000, tabungan: 3100000 },
    { label: 'Feb', pemasukan: 9100000,  pengeluaran: 5800000, tabungan: 3300000 },
    { label: 'Mar', pemasukan: 10500000, pengeluaran: 6200000, tabungan: 4300000 },
    { label: 'Apr', pemasukan: 9800000,  pengeluaran: 5500000, tabungan: 4300000 },
    { label: 'Mei', pemasukan: 11200000, pengeluaran: 7100000, tabungan: 4100000 },
    { label: 'Jun', pemasukan: 10800000, pengeluaran: 6400000, tabungan: 4400000 },
    { label: 'Jul', pemasukan: 12100000, pengeluaran: 7800000, tabungan: 4300000 },
    { label: 'Agu', pemasukan: 11500000, pengeluaran: 7200000, tabungan: 4300000 },
    { label: 'Sep', pemasukan: 13200000, pengeluaran: 6900000, tabungan: 6300000 },
    { label: 'Okt', pemasukan: 12800000, pengeluaran: 7500000, tabungan: 5300000 },
    { label: 'Nov', pemasukan: 14100000, pengeluaran: 6800000, tabungan: 7300000 },
    { label: 'Des', pemasukan: 12800000, pengeluaran: 7300000, tabungan: 5500000 },
  ],
  harian: [
    { label: '1', pemasukan: 0,       pengeluaran: 85000,  tabungan: 0 },
    { label: '2', pemasukan: 0,       pengeluaran: 120000, tabungan: 0 },
    { label: '3', pemasukan: 500000,  pengeluaran: 200000, tabungan: 300000 },
    { label: '4', pemasukan: 0,       pengeluaran: 75000,  tabungan: 0 },
    { label: '5', pemasukan: 0,       pengeluaran: 310000, tabungan: 0 },
    { label: '6', pemasukan: 1200000, pengeluaran: 150000, tabungan: 1050000 },
    { label: '7', pemasukan: 0,       pengeluaran: 95000,  tabungan: 0 },
    { label: '8', pemasukan: 0,       pengeluaran: 220000, tabungan: 0 },
    { label: '9', pemasukan: 750000,  pengeluaran: 180000, tabungan: 570000 },
    { label: '10', pemasukan: 0,      pengeluaran: 430000, tabungan: 0 },
    { label: '11', pemasukan: 0,      pengeluaran: 65000,  tabungan: 0 },
    { label: '12', pemasukan: 0,      pengeluaran: 290000, tabungan: 0 },
    { label: '13', pemasukan: 3500000,pengeluaran: 850000, tabungan: 2650000 },
    { label: '14', pemasukan: 0,      pengeluaran: 110000, tabungan: 0 },
    { label: '15', pemasukan: 0,      pengeluaran: 175000, tabungan: 0 },
    { label: '16', pemasukan: 0,      pengeluaran: 395000, tabungan: 0 },
    { label: '17', pemasukan: 0,      pengeluaran: 88000,  tabungan: 0 },
    { label: '18', pemasukan: 600000, pengeluaran: 240000, tabungan: 360000 },
    { label: '19', pemasukan: 0,      pengeluaran: 155000, tabungan: 0 },
    { label: '20', pemasukan: 0,      pengeluaran: 320000, tabungan: 0 },
    { label: '21', pemasukan: 0,      pengeluaran: 54990,  tabungan: 0 },
    { label: '22', pemasukan: 3500000,pengeluaran: 200000, tabungan: 3300000 },
    { label: '23', pemasukan: 0,      pengeluaran: 85000,  tabungan: 0 },
    { label: '24', pemasukan: 0,      pengeluaran: 2500000,tabungan: 0 },
    { label: '25', pemasukan:12800000,pengeluaran: 500000, tabungan: 12300000 },
    { label: '26', pemasukan: 0,      pengeluaran: 130000, tabungan: 0 },
    { label: '27', pemasukan: 0,      pengeluaran: 270000, tabungan: 0 },
    { label: '28', pemasukan: 450000, pengeluaran: 95000,  tabungan: 355000 },
    { label: '29', pemasukan: 0,      pengeluaran: 185000, tabungan: 0 },
    { label: '30', pemasukan: 0,      pengeluaran: 340000, tabungan: 0 },
    { label: '31', pemasukan: 0,      pengeluaran: 212000, tabungan: 0 },
  ],
}

// ─── Category Summary ─────────────────────────────────────────────────────────
export const kategoris = [
  { id: 1, nama: 'Makanan',    emoji: '🍔', warna: '#7C3AED', jumlah: 2100000, transaksi: 18, persen: 85 },
  { id: 2, nama: 'Belanja',    emoji: '🛒', warna: '#EF4444', jumlah: 1800000, transaksi: 9,  persen: 70 },
  { id: 3, nama: 'Transport',  emoji: '🚗', warna: '#0D9488', jumlah: 1400000, transaksi: 12, persen: 55 },
  { id: 4, nama: 'Kesehatan',  emoji: '💊', warna: '#D97706', jumlah: 780000,  transaksi: 5,  persen: 30 },
  { id: 5, nama: 'Hiburan',    emoji: '🎮', warna: '#3B82F6', jumlah: 650000,  transaksi: 7,  persen: 25 },
  { id: 6, nama: 'Pendidikan', emoji: '📚', warna: '#EC4899', jumlah: 570000,  transaksi: 3,  persen: 22 },
]

// ─── Recent Transactions ──────────────────────────────────────────────────────
export const recentTransactions = [
  { id: 1,  nama: 'Gaji Bulanan',      kategori: 'Pemasukan',  tanggal: '25 Des 2025', jumlah: 12800000,  tipe: 'masuk',  status: 'berhasil' },
  { id: 2,  nama: 'Sewa Kos',          kategori: 'Perumahan',  tanggal: '24 Des 2025', jumlah: -2500000,  tipe: 'keluar', status: 'berhasil' },
  { id: 3,  nama: 'Grab Food',         kategori: 'Makanan',    tanggal: '23 Des 2025', jumlah: -85000,    tipe: 'keluar', status: 'berhasil' },
  { id: 4,  nama: 'Freelance Design',  kategori: 'Pemasukan',  tanggal: '22 Des 2025', jumlah: 3500000,   tipe: 'masuk',  status: 'tertunda' },
  { id: 5,  nama: 'Spotify Premium',   kategori: 'Hiburan',    tanggal: '21 Des 2025', jumlah: -54990,    tipe: 'keluar', status: 'gagal'    },
  { id: 6,  nama: 'Belanja Mingguan',  kategori: 'Belanja',    tanggal: '20 Des 2025', jumlah: -320000,   tipe: 'keluar', status: 'berhasil' },
  { id: 7,  nama: 'Transfer Masuk',    kategori: 'Pemasukan',  tanggal: '18 Des 2025', jumlah: 600000,    tipe: 'masuk',  status: 'berhasil' },
]