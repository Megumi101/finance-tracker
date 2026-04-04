import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { formatRp } from './LaporanSummary'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 shadow-2xl min-w-[180px]">
      <p className="text-[11px] text-slate-500 font-medium mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-6 mb-1 last:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: p.fill }} />
            <span className="text-[12px] text-slate-400 capitalize">{p.dataKey}</span>
          </div>
          <span className="text-[12px] font-mono font-semibold text-slate-200">{formatRp(p.value)}</span>
        </div>
      ))}
      <div className="border-t border-white/[0.06] mt-2 pt-2 flex justify-between">
        <span className="text-[11px] text-slate-600">Tabungan</span>
        <span className="text-[11px] font-mono font-semibold text-violet-400">
          {formatRp(payload[0]?.value - payload[1]?.value)}
        </span>
      </div>
    </div>
  )
}

export default function TrenChart({ data }) {
  const fmtY = (v) => {
    if (v >= 1000000) return (v / 1000000).toFixed(0) + 'Jt'
    return v
  }

  return (
    <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-100">Tren Keuangan</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">Perbandingan pemasukan & pengeluaran</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { color: '#7C3AED', label: 'Pemasukan'   },
            { color: '#F87171', label: 'Pengeluaran' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span className="text-[12px] text-slate-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="28%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="bulan" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} dy={8} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmtY} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
            <Bar dataKey="pemasukan" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((_, i) => <Cell key={i} fill="#7C3AED" fillOpacity={0.85} />)}
            </Bar>
            <Bar dataKey="pengeluaran" fill="#F87171" radius={[4, 4, 0, 0]} maxBarSize={32}>
              {data.map((_, i) => <Cell key={i} fill="#F87171" fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}