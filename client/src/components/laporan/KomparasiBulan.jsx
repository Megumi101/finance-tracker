import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts'
import { formatRp } from './LaporanSummary'

// ─── Pct badge inline ─────────────────────────────────────────────────────────
function Pct({ val }) {
  if (val === null) return <span className="text-slate-700 text-[11px]">—</span>
  const up = val >= 0
  return (
    <span className={`
      inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md
      ${up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}
    `}>
      {up ? '▲' : '▼'} {Math.abs(val)}%
    </span>
  )
}

// ─── Custom tooltip for delta chart ──────────────────────────────────────────
function DeltaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const v = payload[0]?.value ?? 0
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className={`text-[13px] font-mono font-semibold ${v >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {v >= 0 ? '+' : ''}{formatRp(v)}
      </p>
      <p className="text-[11px] text-slate-600 mt-0.5">Selisih vs bulan sebelumnya</p>
    </div>
  )
}

// ─── KomparasiBulan ───────────────────────────────────────────────────────────
export default function KomparasiBulan({ data }) {
  // Delta tabungan: tabungan[i] - tabungan[i-1]
  const deltaData = data.map((d, i) => ({
    bulan:  d.bulan,
    delta:  i === 0 ? 0 : d.tabungan - data[i - 1].tabungan,
  }))

  return (
    <div className="flex flex-col gap-4">

      {/* ── Delta chart ── */}
      <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="text-[15px] font-semibold text-slate-100">Perbandingan Bulan ke Bulan</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">Perubahan tabungan dibanding bulan sebelumnya</p>
        </div>
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deltaData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="bulan" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis
                tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={40}
                tickFormatter={v => {
                  const abs = Math.abs(v)
                  return (v < 0 ? '-' : '') + (abs >= 1000000 ? (abs / 1000000).toFixed(0) + 'Jt' : v)
                }}
              />
              <Tooltip content={<DeltaTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              <Bar
                dataKey="delta"
                radius={[4, 4, 4, 4]}
                maxBarSize={28}
                shape={(props) => {
                  const { x, y, width, height, value } = props
                  const fill = value >= 0 ? '#10B981' : '#F87171'
                  const rx = 4
                  return <rect x={x} y={y} width={width} height={Math.abs(height)} rx={rx} fill={fill} fillOpacity={0.85} />
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Detail table ── */}
      <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h2 className="text-[15px] font-semibold text-slate-100">Ringkasan Per Bulan</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">Detail lengkap dengan persentase perubahan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {['Bulan', 'Pemasukan', 'Δ', 'Pengeluaran', 'Δ', 'Tabungan', 'Δ', 'Rasio Tabungan'].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left">
                    <span className="text-[10px] font-medium tracking-[1.2px] uppercase text-slate-600">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.map((row, i) => {
                const rasio = row.pemasukan > 0
                  ? Math.round((row.tabungan / row.pemasukan) * 100)
                  : 0
                const rasioColor = rasio >= 30 ? 'text-emerald-400' : rasio >= 15 ? 'text-amber-400' : 'text-red-400'

                return (
                  <tr key={row.bulan} className="hover:bg-white/[0.02] transition-colors duration-150">
                    {/* Bulan */}
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-semibold text-slate-200">{row.bulan}</span>
                    </td>
                    {/* Pemasukan */}
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-mono text-emerald-400">{formatRp(row.pemasukan)}</span>
                    </td>
                    <td className="px-5 py-4"><Pct val={row.pctPemasukan} /></td>
                    {/* Pengeluaran */}
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-mono text-red-400">{formatRp(row.pengeluaran)}</span>
                    </td>
                    <td className="px-5 py-4"><Pct val={row.pctPengeluaran} /></td>
                    {/* Tabungan */}
                    <td className="px-5 py-4">
                      <span className={`text-[13px] font-mono font-semibold ${row.tabungan >= 0 ? 'text-violet-400' : 'text-red-400'}`}>
                        {formatRp(row.tabungan)}
                      </span>
                    </td>
                    <td className="px-5 py-4"><Pct val={row.pctTabungan} /></td>
                    {/* Rasio tabungan */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: Math.min(rasio, 100) + '%',
                              background: rasio >= 30 ? '#10B981' : rasio >= 15 ? '#F59E0B' : '#F87171',
                            }}
                          />
                        </div>
                        <span className={`text-[12px] font-semibold font-mono ${rasioColor}`}>{rasio}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>

            {/* Footer total */}
            {data.length > 1 && (
              <tfoot>
                <tr className="border-t border-white/[0.08] bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <span className="text-[12px] font-semibold text-slate-400">Total</span>
                  </td>
                  <td className="px-5 py-4" colSpan={2}>
                    <span className="text-[13px] font-mono font-bold text-emerald-400">
                      {formatRp(data.reduce((s, d) => s + d.pemasukan, 0))}
                    </span>
                  </td>
                  <td className="px-5 py-4" colSpan={2}>
                    <span className="text-[13px] font-mono font-bold text-red-400">
                      {formatRp(data.reduce((s, d) => s + d.pengeluaran, 0))}
                    </span>
                  </td>
                  <td className="px-5 py-4" colSpan={3}>
                    <span className="text-[13px] font-mono font-bold text-violet-400">
                      {formatRp(data.reduce((s, d) => s + d.tabungan, 0))}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}