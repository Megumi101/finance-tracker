import { useState } from 'react'

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
    <path d="M10,11v6"/>
    <path d="M14,11v6"/>
  </svg>
)

const SortIcon = ({ dir }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {dir === 'asc' && <polyline points="18,15 12,9 6,15"/>}
    {dir === 'desc' && <polyline points="6,9 12,15 18,9"/>}
    {!dir && (
      <>
        <polyline points="18,15 12,9 6,15" opacity="0.35"/>
        <polyline points="6,15 12,21 18,15" opacity="0.35"/>
      </>
    )}
  </svg>
)

function formatRupiah(v) {
  if (v >= 1000000) return 'Rp ' + (v / 1000000).toFixed(1) + ' Jt'
  if (v >= 1000) return 'Rp ' + (v / 1000).toFixed(0) + ' Rb'
  return 'Rp ' + v
}

const COLS = [
  { key: 'nama', label: 'Kategori' },
  { key: 'deskripsi', label: 'Deskripsi' },
  { key: 'totalTransaksi', label: 'Transaksi' },
  { key: 'totalAmount', label: 'Total Amount' },
  { key: 'bulan', label: 'Periode' },
  { key: 'status', label: 'Status' },
]

function StatusBadge({ status }) {
  const statusConfig = {
    aktif: { label: 'Aktif', cls: 'bg-emerald-500/10 text-emerald-400' },
    nonaktif: { label: 'Nonaktif', cls: 'bg-slate-500/10 text-slate-400' },
  }
  const config = statusConfig[status] || statusConfig.aktif
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.cls}`}>
      {config.label}
    </span>
  )
}

export default function KategoriTable({ data, sort, onSort, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState(sort || {})

  const handleSort = (key) => {
    const newSort = {}
    if (sortConfig.key === key) {
      newSort.key = key
      newSort.dir = sortConfig.dir === 'asc' ? 'desc' : 'asc'
    } else {
      newSort.key = key
      newSort.dir = 'asc'
    }
    setSortConfig(newSort)
    onSort(newSort)
  }

  if (data.length === 0) {
    return (
      <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-16 flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-3">📂</div>
        <p className="text-[14px] font-medium text-slate-400">Tidak ada kategori ditemukan</p>
        <p className="text-[12px] text-slate-600 mt-1">Mulai dengan menambahkan kategori baru</p>
      </div>
    )
  }

  return (
    <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-white/[0.05]">
            {COLS.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="text-left px-5 py-3.5 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.5px] font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                    {col.label}
                  </span>
                  <SortIcon dir={sortConfig.key === col.key ? sortConfig.dir : null} />
                </div>
              </th>
            ))}
            <th className="text-left px-5 py-3.5 w-20">
              <span className="text-[11px] uppercase tracking-[0.5px] font-semibold text-slate-400">Aksi</span>
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {data.map((kategori, i) => (
            <tr
              key={kategori.id}
              className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                i === data.length - 1 ? 'border-b-0' : ''
              }`}
            >
              {/* Nama + Emoji */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: kategori.warna + '20' }}
                  >
                    {kategori.emoji}
                  </div>
                  <span className="font-medium text-[13px] text-white">{kategori.nama}</span>
                </div>
              </td>

              {/* Deskripsi */}
              <td className="px-5 py-4">
                <p className="text-[12px] text-slate-400 line-clamp-1">{kategori.deskripsi}</p>
              </td>

              {/* Total Transaksi */}
              <td className="px-5 py-4">
                <span className="text-[12px] font-semibold text-slate-300">{kategori.totalTransaksi}</span>
              </td>

              {/* Total Amount */}
              <td className="px-5 py-4">
                <span className="text-[12px] font-mono font-semibold text-violet-400">
                  {formatRupiah(kategori.totalAmount)}
                </span>
              </td>

              {/* Periode */}
              <td className="px-5 py-4">
                <span className="text-[12px] text-slate-500">{kategori.bulan}</span>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <StatusBadge status={kategori.status} />
              </td>

              {/* Aksi */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(kategori)}
                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Edit"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => onDelete(kategori.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Hapus"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
