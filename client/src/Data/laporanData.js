// ─── Data bulanan lengkap 2025 ────────────────────────────────────────────────
export const laporanBulanan = [
  { bulan: 'Jan', pemasukan: 8200000,  pengeluaran: 5100000 },
  { bulan: 'Feb', pemasukan: 9100000,  pengeluaran: 5800000 },
  { bulan: 'Mar', pemasukan: 10500000, pengeluaran: 6200000 },
  { bulan: 'Apr', pemasukan: 9800000,  pengeluaran: 5500000 },
  { bulan: 'Mei', pemasukan: 11200000, pengeluaran: 7100000 },
  { bulan: 'Jun', pemasukan: 10800000, pengeluaran: 6400000 },
  { bulan: 'Jul', pemasukan: 12100000, pengeluaran: 7800000 },
  { bulan: 'Agu', pemasukan: 11500000, pengeluaran: 7200000 },
  { bulan: 'Sep', pemasukan: 13200000, pengeluaran: 6900000 },
  { bulan: 'Okt', pemasukan: 12800000, pengeluaran: 7500000 },
  { bulan: 'Nov', pemasukan: 14100000, pengeluaran: 6800000 },
  { bulan: 'Des', pemasukan: 12800000, pengeluaran: 7300000 },
]

// Tambahkan tabungan & hitung perubahan dari bulan ke bulan
export function buildLaporanData(rawData) {
  return rawData.map((item, i) => {
    const tabungan = item.pemasukan - item.pengeluaran
    const prev     = rawData[i - 1]

    const pctChange = (curr, prevVal) =>
      prevVal === 0 ? null : Math.round(((curr - prevVal) / prevVal) * 100 * 10) / 10

    return {
      ...item,
      tabungan,
      pctPemasukan:   prev ? pctChange(item.pemasukan,   prev.pemasukan)   : null,
      pctPengeluaran: prev ? pctChange(item.pengeluaran, prev.pengeluaran) : null,
      pctTabungan:    prev ? pctChange(tabungan, prev.pemasukan - prev.pengeluaran) : null,
    }
  })
}

// ─── Filter helper ────────────────────────────────────────────────────────────
export function filterByPeriode(data, periode) {
  if (periode === 'bulan-ini') return data.slice(-1)
  if (periode === '3-bulan')   return data.slice(-3)
  return data // tahun-ini = semua
}