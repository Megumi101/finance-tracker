import { KATEGORI_OPTIONS } from '../../Data/transaksiData'

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const FilterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
  </svg>
)
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const selectCls = `
  bg-[#0F1829] border border-white/[0.07] rounded-lg
  text-[12px] text-slate-400 px-3 py-2 outline-none
  hover:border-white/[0.12] focus:border-violet-500/40
  transition-all duration-200 cursor-pointer
  appearance-none pr-8
`

export default function TransaksiFilter({ filters, onChange, onReset, activeCount }) {
  const hasActive = activeCount > 0

  return (
    <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl p-4">
      <div className="flex items-center gap-3 flex-wrap">

        {/* Search */}
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-[200px]
          bg-[#0F1829] border transition-all duration-200
          ${filters.search ? 'border-violet-500/40' : 'border-white/[0.07]'}
        `}>
          <span className="text-slate-500 flex-shrink-0"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Cari nama transaksi..."
            value={filters.search}
            onChange={e => onChange('search', e.target.value)}
            className="bg-transparent text-[12px] text-slate-300 placeholder-slate-600 outline-none w-full"
          />
          {filters.search && (
            <button onClick={() => onChange('search', '')} className="text-slate-600 hover:text-slate-400">
              <XIcon />
            </button>
          )}
        </div>

        {/* Tipe */}
        <div className="relative">
          <select
            value={filters.tipe}
            onChange={e => onChange('tipe', e.target.value)}
            className={selectCls}
            style={{ minWidth: 130 }}
          >
            <option value="">Semua Tipe</option>
            <option value="masuk">Pemasukan</option>
            <option value="keluar">Pengeluaran</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-[10px]">▾</span>
        </div>

        {/* Kategori */}
        <div className="relative">
          <select
            value={filters.kategori}
            onChange={e => onChange('kategori', e.target.value)}
            className={selectCls}
            style={{ minWidth: 140 }}
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.map(k => (
              <option key={k.value} value={k.value}>{k.emoji} {k.label}</option>
            ))}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-[10px]">▾</span>
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={e => onChange('status', e.target.value)}
            className={selectCls}
            style={{ minWidth: 130 }}
          >
            <option value="">Semua Status</option>
            <option value="berhasil">Berhasil</option>
            <option value="tertunda">Tertunda</option>
            <option value="gagal">Gagal</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-[10px]">▾</span>
        </div>

        {/* Date range */}
        <input
          type="date"
          value={filters.dari}
          onChange={e => onChange('dari', e.target.value)}
          className={selectCls}
          style={{ minWidth: 140, colorScheme: 'dark' }}
        />
        <span className="text-slate-600 text-[12px]">–</span>
        <input
          type="date"
          value={filters.sampai}
          onChange={e => onChange('sampai', e.target.value)}
          className={selectCls}
          style={{ minWidth: 140, colorScheme: 'dark' }}
        />

        {/* Reset */}
        {hasActive && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] text-slate-400 hover:text-red-400 border border-white/[0.07] hover:border-red-500/30 transition-all duration-200"
          >
            <XIcon /> Reset ({activeCount})
          </button>
        )}
      </div>
    </div>
  )
}