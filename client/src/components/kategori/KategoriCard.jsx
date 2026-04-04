import { useState } from 'react'

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/>
    <path d="M10,11v6"/>
    <path d="M14,11v6"/>
  </svg>
)

function formatRupiah(v) {
  if (v >= 1000000) return 'Rp ' + (v / 1000000).toFixed(1) + ' Jt'
  if (v >= 1000) return 'Rp ' + (v / 1000).toFixed(0) + ' Rb'
  return 'Rp ' + v
}

export default function KategoriCard({ data, onEdit, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(kategori => (
        <div
          key={kategori.id}
          onMouseEnter={() => setHoveredId(kategori.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group bg-gradient-to-br from-[#0C1120]/80 to-[#1a1f35] border border-white/[0.06] rounded-xl p-5 transition-all duration-200 hover:border-white/[0.12] hover:shadow-lg hover:shadow-purple-500/5 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
            style={{ backgroundColor: kategori.warna }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header with icon and actions */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                  style={{ backgroundColor: kategori.warna + '20' }}
                >
                  {kategori.emoji}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{kategori.nama}</h3>
                  <p className="text-[11px] text-slate-500">{kategori.status}</p>
                </div>
              </div>

              {hoveredId === kategori.id && (
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
              )}
            </div>

            {/* Description */}
            <p className="text-[12px] text-slate-400 mb-4 line-clamp-2">{kategori.deskripsi}</p>

            {/* Stats */}
            <div className="space-y-2 mb-4 pb-4 border-b border-white/[0.05]">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-slate-500">Total Transaksi</span>
                <span className="text-white font-semibold">{kategori.totalTransaksi}</span>
              </div>
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-slate-500">Total Amount</span>
                <span className="font-mono text-violet-400 font-semibold">{formatRupiah(kategori.totalAmount)}</span>
              </div>
            </div>

            {/* Period */}
            <p className="text-[11px] text-slate-600">{kategori.bulan}</p>
          </div>

          {/* Color accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
            style={{
              background: `linear-gradient(90deg, ${kategori.warna}, ${kategori.warna}00)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
