import { useState, useMemo } from 'react'
import { kategoriData as initialData } from '../Data/kategoriData'
import KategoriTable from '../components/kategori/KategoriTable'
import KategoriCard from '../components/kategori/KategoriCard'
import KategoriModal from '../components/kategori/KategoriModal'

// ─── Icons ───────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const TableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
)

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

// ─── Summary Card ────────────────────────────────────────────────────────────
function SummaryCard({ data }) {
  const totalAmount = data.reduce((sum, k) => sum + k.totalAmount, 0)
  const totalTransaksi = data.reduce((sum, k) => sum + k.totalTransaksi, 0)
  const avgAmount = Math.round(totalAmount / data.length)

  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Total Kategori', value: data.length, color: 'text-violet-400', bg: 'bg-violet-500/5 border-violet-500/10' },
        { label: 'Total Transaksi', value: totalTransaksi, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/10' },
        { label: 'Rata-rata Amount', value: `Rp ${Math.round(avgAmount / 1000).toLocaleString('id-ID')} Rb`, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/10' },
      ].map(item => (
        <div key={item.label} className={`rounded-2xl p-4 border ${item.bg}`}>
          <p className="text-[11px] uppercase tracking-[1px] text-slate-500 font-medium mb-2">{item.label}</p>
          <p className={`text-[20px] font-bold ${item.color}`}>
            {typeof item.value === 'number' ? item.value : item.value}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function Kategori() {
  const [data, setData] = useState(initialData)
  const [view, setView] = useState('table') // 'table' or 'card'
  const [sort, setSort] = useState({ key: 'nama', dir: 'asc' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKategori, setEditingKategori] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = data.filter(k =>
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (sort.key) {
      result.sort((a, b) => {
        let aVal = a[sort.key]
        let bVal = b[sort.key]

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }

        if (sort.dir === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    return result
  }, [data, sort, searchTerm])

  // Handle add/edit
  const handleOpenModal = (kategori = null) => {
    setEditingKategori(kategori)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingKategori(null)
  }

  const handleSaveKategori = (formData) => {
    if (editingKategori) {
      // Edit
      setData(data.map(k =>
        k.id === editingKategori.id
          ? { ...k, ...formData }
          : k
      ))
    } else {
      // Add new
      const newId = Math.max(...data.map(k => k.id), 0) + 1
      setData([
        ...data,
        {
          id: newId,
          ...formData,
          totalTransaksi: 0,
          totalAmount: 0,
          bulan: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
          status: 'aktif',
        },
      ])
    }
    handleCloseModal()
  }

  const handleDeleteKategori = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setData(data.filter(k => k.id !== id))
    }
  }

  const handleSort = (newSort) => {
    setSort(newSort)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Kategori</h1>
          <p className="text-[13px] text-slate-500">Kelola kategori pengeluaran dan pemasukan</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium text-[13px] hover:shadow-lg hover:shadow-violet-500/30 transition-all"
        >
          <PlusIcon />
          Tambah Kategori
        </button>
      </div>

      {/* ── Summary ── */}
      <SummaryCard data={filteredData} />

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-slate-600 outline-none focus:border-violet-500/30 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-lg bg-white/[0.05] border border-white/[0.08]">
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-md transition-colors ${
                view === 'table'
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon />
            </button>
            <button
              onClick={() => setView('card')}
              className={`p-2 rounded-md transition-colors ${
                view === 'card'
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'text-slate-500 hover:text-slate-400'
              }`}
              title="Tampilan Kartu"
            >
              <GridIcon />
            </button>
          </div>

          {/* Export */}
          <button
            onClick={() => {
              // Simple CSV export
              const headers = ['Nama', 'Deskripsi', 'Total Transaksi', 'Total Amount', 'Status']
              const rows = filteredData.map(k => [
                k.nama,
                k.deskripsi,
                k.totalTransaksi,
                k.totalAmount,
                k.status,
              ])
              const csv = [headers, ...rows]
                .map(r => r.map(c => `"${c}"`).join(','))
                .join('\n')
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `kategori_${new Date().toISOString().split('T')[0]}.csv`
              link.click()
              URL.revokeObjectURL(url)
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Export CSV"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {view === 'table' ? (
        <KategoriTable
          data={filteredData}
          sort={sort}
          onSort={handleSort}
          onEdit={handleOpenModal}
          onDelete={handleDeleteKategori}
        />
      ) : (
        <KategoriCard
          data={filteredData}
          onEdit={handleOpenModal}
          onDelete={handleDeleteKategori}
        />
      )}

      {/* ── Modal ── */}
      <KategoriModal
        isOpen={isModalOpen}
        kategori={editingKategori}
        onClose={handleCloseModal}
        onSave={handleSaveKategori}
      />

      {/* ── Empty State ── */}
      {data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📂</div>
          <h2 className="text-xl font-semibold text-white mb-2">Belum ada kategori</h2>
          <p className="text-sm text-slate-500 mb-6">Mulai dengan menambahkan kategori pertama Anda</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
          >
            Buat Kategori
          </button>
        </div>
      )}
    </div>
  )
}
