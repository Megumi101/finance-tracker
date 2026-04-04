// ─── helpers ─────────────────────────────────────────────────────────────────
export function formatRp(v) {
  const abs = Math.abs(v)
  if (abs >= 1000000000) return 'Rp ' + (v / 1000000000).toFixed(1) + ' M'
  if (abs >= 1000000)    return 'Rp ' + (abs / 1000000).toFixed(1) + ' Jt'
  if (abs >= 1000)       return 'Rp ' + (abs / 1000).toFixed(0) + ' Rb'
  return 'Rp ' + abs
}

const PERIODES = [
  { value: 'bulan-ini', label: 'Bulan Ini' },
  { value: '3-bulan',   label: '3 Bulan'   },
  { value: 'tahun-ini', label: 'Tahun Ini' },
]

// ─── PeriodeSelector ──────────────────────────────────────────────────────────
export function PeriodeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-[#080C14] rounded-xl p-1 border border-white/[0.05]">
      {PERIODES.map(p => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`
            px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-200
            ${value === p.value
              ? 'bg-[#1A1F35] text-violet-400'
              : 'text-slate-500 hover:text-slate-300'
            }
          `}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// ─── Arrow badge ──────────────────────────────────────────────────────────────
function PctBadge({ pct }) {
  if (pct === null) return <span className="text-[11px] text-slate-600">—</span>
  const up = pct >= 0
  return (
    <span className={`
      inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md
      ${up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}
    `}>
      {up ? '▲' : '▼'} {Math.abs(pct)}%
    </span>
  )
}

// ─── SummaryCards ─────────────────────────────────────────────────────────────
export function SummaryCards({ data }) {
  const totalMasuk  = data.reduce((s, d) => s + d.pemasukan,   0)
  const totalKeluar = data.reduce((s, d) => s + d.pengeluaran, 0)
  const totalSaldo  = totalMasuk - totalKeluar

  // avg monthly change (pemasukan)
  const changes = data.filter(d => d.pctPemasukan !== null).map(d => d.pctPemasukan)
  const avgChange = changes.length
    ? Math.round((changes.reduce((s, c) => s + c, 0) / changes.length) * 10) / 10
    : null

  const cards = [
    {
      label:   'Total Pemasukan',
      value:   totalMasuk,
      pct:     avgChange,
      icon:    '📈',
      accent:  'linear-gradient(90deg,#0D9488,#0891B2)',
      bg:      'rgba(13,148,136,0.08)',
      valCls:  'text-emerald-400',
    },
    {
      label:   'Total Pengeluaran',
      value:   totalKeluar,
      pct:     null,
      icon:    '📉',
      accent:  'linear-gradient(90deg,#BE185D,#9F1239)',
      bg:      'rgba(190,24,93,0.08)',
      valCls:  'text-red-400',
    },
    {
      label:   'Total Tabungan',
      value:   totalSaldo,
      pct:     null,
      icon:    '💰',
      accent:  'linear-gradient(90deg,#7C3AED,#4F46E5)',
      bg:      'rgba(124,58,237,0.08)',
      valCls:  totalSaldo >= 0 ? 'text-violet-400' : 'text-red-400',
    },
    {
      label:   'Rata-rata Tabungan/Bulan',
      value:   Math.round(totalSaldo / Math.max(data.length, 1)),
      pct:     null,
      icon:    '🎯',
      accent:  'linear-gradient(90deg,#D97706,#B45309)',
      bg:      'rgba(217,119,6,0.08)',
      valCls:  'text-amber-400',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="relative bg-[#0C1120] border border-white/[0.06] rounded-2xl p-5 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: card.accent }} />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-medium tracking-[1px] uppercase text-slate-500">{card.label}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[14px]" style={{ background: card.bg }}>
              {card.icon}
            </div>
          </div>
          <div className={`font-mono text-[21px] font-bold tracking-tight leading-none mb-2 ${card.valCls}`}>
            {formatRp(card.value)}
          </div>
          {card.pct !== null
            ? <PctBadge pct={card.pct} />
            : <span className="text-[11px] text-slate-600">periode terpilih</span>
          }
        </div>
      ))}
    </div>
  )
}