import { useState, useMemo } from 'react'
import { laporanBulanan, buildLaporanData, filterByPeriode } from '../Data/laporanData'
import { PeriodeSelector, SummaryCards, formatRp } from '../components/laporan/LaporanSummary'
import TrenChart from '../components/laporan/TrenChart'
import KomparasiBulan from '../components/laporan/KomparasiBulan'

// ─── Icons ────────────────────────────────────────────────────────────────────
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

// ─── Export helpers ───────────────────────────────────────────────────────────
function exportCSV(data, periode) {
  const header = ['Bulan', 'Pemasukan', 'Pengeluaran', 'Tabungan', '% Pemasukan', '% Pengeluaran', '% Tabungan']
  const rows = data.map(d => [
    d.bulan,
    d.pemasukan,
    d.pengeluaran,
    d.tabungan,
    d.pctPemasukan   ?? '-',
    d.pctPengeluaran ?? '-',
    d.pctTabungan    ?? '-',
  ])
  const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `laporan_${periode}_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function exportPDF(data, periode) {
  const totalMasuk  = data.reduce((s, d) => s + d.pemasukan,   0)
  const totalKeluar = data.reduce((s, d) => s + d.pengeluaran, 0)
  const totalSaldo  = totalMasuk - totalKeluar

  const rows = data.map(d => {
    const rasio = d.pemasukan > 0 ? Math.round((d.tabungan / d.pemasukan) * 100) : 0
    const pct = (val) => val === null ? '—' : (val >= 0 ? '▲ ' : '▼ ') + Math.abs(val) + '%'
    return `
      <tr>
        <td><strong>${d.bulan}</strong></td>
        <td style="color:#10B981">${formatRp(d.pemasukan)}</td>
        <td style="color:${d.pctPemasukan >= 0 ? '#10B981' : '#F87171'};font-size:11px">${pct(d.pctPemasukan)}</td>
        <td style="color:#F87171">${formatRp(d.pengeluaran)}</td>
        <td style="color:${d.pctPengeluaran >= 0 ? '#10B981' : '#F87171'};font-size:11px">${pct(d.pctPengeluaran)}</td>
        <td style="color:#A78BFA;font-weight:600">${formatRp(d.tabungan)}</td>
        <td style="color:${d.pctTabungan >= 0 ? '#10B981' : '#F87171'};font-size:11px">${pct(d.pctTabungan)}</td>
        <td style="color:${rasio >= 30 ? '#10B981' : rasio >= 15 ? '#F59E0B' : '#F87171'}">${rasio}%</td>
      </tr>`
  }).join('')

  const periodeLabel = { 'bulan-ini': 'Bulan Ini', '3-bulan': '3 Bulan Terakhir', 'tahun-ini': 'Tahun Ini' }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Laporan Keuangan FinTrack</title>
  <style>
    body { font-family: sans-serif; font-size: 13px; color: #1e293b; padding: 40px; background: #fff; }
    .header { margin-bottom: 32px; }
    .header h1 { font-size: 22px; margin: 0 0 4px; color: #0f172a; }
    .header p  { color: #64748b; margin: 0; font-size: 12px; }
    .summary { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 32px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
    .card label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 6px; }
    .card .val { font-size: 20px; font-weight: 700; font-family: monospace; }
    h2 { font-size: 15px; margin: 0 0 12px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
    tfoot td { font-weight: 700; background: #f8fafc; border-top: 2px solid #e2e8f0; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Laporan Keuangan FinTrack</h1>
    <p>Periode: ${periodeLabel[periode]} · Diekspor ${new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</p>
  </div>
  <div class="summary">
    <div class="card"><label>Total Pemasukan</label><div class="val" style="color:#10B981">${formatRp(totalMasuk)}</div></div>
    <div class="card"><label>Total Pengeluaran</label><div class="val" style="color:#F87171">${formatRp(totalKeluar)}</div></div>
    <div class="card"><label>Total Tabungan</label><div class="val" style="color:#7C3AED">${formatRp(totalSaldo)}</div></div>
  </div>
  <h2>Ringkasan Per Bulan</h2>
  <table>
    <thead><tr><th>Bulan</th><th>Pemasukan</th><th>Δ</th><th>Pengeluaran</th><th>Δ</th><th>Tabungan</th><th>Δ</th><th>Rasio</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td>Total</td>
        <td style="color:#10B981">${formatRp(totalMasuk)}</td><td></td>
        <td style="color:#F87171">${formatRp(totalKeluar)}</td><td></td>
        <td style="color:#7C3AED">${formatRp(totalSaldo)}</td><td></td>
        <td>—</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url  = URL.createObjectURL(blob)
  const win  = window.open(url)
  win.onload = () => { win.print(); URL.revokeObjectURL(url) }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Laporan() {
  const [periode,     setPeriode]     = useState('tahun-ini')
  const [showExport,  setShowExport]  = useState(false)

  // Build & filter data
  const allData      = useMemo(() => buildLaporanData(laporanBulanan), [])
  const filteredData = useMemo(() => filterByPeriode(allData, periode), [allData, periode])

  const periodeLabel = { 'bulan-ini': 'Bulan Ini', '3-bulan': '3 Bulan Terakhir', 'tahun-ini': 'Tahun Ini' }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-100 tracking-tight">Laporan Keuangan</h1>
          <p className="text-[12px] text-slate-500 mt-0.5">
            {periodeLabel[periode]} · {filteredData.length} bulan data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodeSelector value={periode} onChange={(v) => setPeriode(v)} />

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExport(e => !e)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] text-slate-400 border border-white/[0.07] hover:text-slate-200 hover:bg-white/[0.04] transition-all duration-200"
            >
              <DownloadIcon /> Ekspor ▾
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl py-1.5 z-10">
                <button
                  onClick={() => { exportCSV(filteredData, periode); setShowExport(false) }}
                  className="w-full text-left px-4 py-2.5 text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
                >
                  📄 Export CSV
                </button>
                <button
                  onClick={() => { exportPDF(filteredData, periode); setShowExport(false) }}
                  className="w-full text-left px-4 py-2.5 text-[12px] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
                >
                  🖨️ Export PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <SummaryCards data={filteredData} />

      {/* ── Tren chart ── */}
      <TrenChart data={filteredData} />

      {/* ── Komparasi bulan ke bulan ── */}
      <KomparasiBulan data={filteredData} />

    </div>
  )
}