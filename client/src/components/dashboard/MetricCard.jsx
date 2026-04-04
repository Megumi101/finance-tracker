// Helper: format angka ke Rupiah ringkas
export function formatRupiah(angka) {
  const abs = Math.abs(angka)
  if (abs >= 1000000000) return 'Rp ' + (angka / 1000000000).toFixed(1) + ' M'
  if (abs >= 1000000)    return 'Rp ' + (angka / 1000000).toFixed(1) + ' Jt'
  if (abs >= 1000)       return 'Rp ' + (angka / 1000).toFixed(0) + ' Rb'
  return 'Rp ' + angka.toLocaleString('id-ID')
}

// ─── Arrow icons ──────────────────────────────────────────────────────────────
const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18,15 12,9 6,15" />
  </svg>
)
const ArrowDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9" />
  </svg>
)

// ─── MetricCard ───────────────────────────────────────────────────────────────
export default function MetricCard({ label, value, perubahan, icon, accentColor, bgColor }) {
  const isPositive = perubahan >= 0

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden border border-white/[0.06] flex flex-col gap-3"
      style={{ background: '#0C1120' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{ background: accentColor }}
      />

      {/* Label + Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-[1.2px] uppercase text-slate-500">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px]"
          style={{ background: bgColor }}
        >
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="font-mono text-[22px] font-bold text-slate-100 tracking-tight leading-none">
        {formatRupiah(value)}
      </div>

      {/* Badge + footnote */}
      <div className="flex items-center gap-2">
        <span
          className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold
            ${isPositive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
            }
          `}
        >
          {isPositive ? <ArrowUp /> : <ArrowDown />}
          {Math.abs(perubahan)}%
        </span>
        <span className="text-[11px] text-slate-600">vs bulan lalu</span>
      </div>
    </div>
  )
}