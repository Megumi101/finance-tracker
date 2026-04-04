import { useState, useEffect } from 'react'

const EMOJI_OPTIONS = [
  '🍔', '🚗', '🛒', '💊', '🎮', '📚', '🏠', '💵',
  '🏦', '✈️', '🎭', '💻', '🎁', '⚽', '🍕', '🎬',
]

const COLOR_OPTIONS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#F38181',
  '#AA96DA', '#FCBAD3', '#A8D8EA', '#55EFC4',
  '#FFB347', '#87CEEB', '#DDA0DD', '#F08080',
]

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function KategoriModal({ isOpen, kategori, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    emoji: '🍔',
    warna: '#FF6B6B',
    deskripsi: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (kategori) {
      setFormData({
        nama: kategori.nama,
        emoji: kategori.emoji,
        warna: kategori.warna,
        deskripsi: kategori.deskripsi,
      })
    } else {
      setFormData({
        nama: '',
        emoji: '🍔',
        warna: '#FF6B6B',
        deskripsi: '',
      })
    }
    setErrors({})
  }, [kategori, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama kategori harus diisi'
    }
    if (formData.nama.trim().length < 2) {
      newErrors.nama = 'Nama minimal 2 karakter'
    }
    if (!formData.deskripsi.trim()) {
      newErrors.deskripsi = 'Deskripsi harus diisi'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData)
      setFormData({
        nama: '',
        emoji: '🍔',
        warna: '#FF6B6B',
        deskripsi: '',
      })
      setErrors({})
    } else {
      setErrors(newErrors)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-[#0C1120] to-[#1a1f35] border border-white/[0.08] rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/[0.05] bg-[#0C1120]">
          <h2 className="text-lg font-semibold text-white">
            {kategori ? 'Edit Kategori' : 'Tambah Kategori'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] transition-colors text-slate-400 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Emoji Selector */}
          <div>
            <label className="block text-[12px] uppercase tracking-[0.5px] font-semibold text-slate-400 mb-3">
              Emoji
            </label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                  className={`
                    h-10 rounded-lg flex items-center justify-center text-xl transition-all
                    ${formData.emoji === emoji
                      ? 'bg-violet-600 scale-110'
                      : 'bg-white/[0.05] hover:bg-white/[0.1]'
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-[12px] uppercase tracking-[0.5px] font-semibold text-slate-400 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Makanan"
              className={`
                w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border transition-colors
                placeholder:text-slate-600 text-white text-[13px] outline-none
                ${errors.nama
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/[0.08] focus:border-violet-500/30'
                }
              `}
            />
            {errors.nama && <p className="text-[11px] text-red-400 mt-1.5">{errors.nama}</p>}
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="deskripsi" className="block text-[12px] uppercase tracking-[0.5px] font-semibold text-slate-400 mb-2">
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Jelaskan pengunaan kategori ini..."
              rows="3"
              className={`
                w-full px-4 py-2.5 rounded-lg bg-white/[0.03] border transition-colors resize-none
                placeholder:text-slate-600 text-white text-[13px] outline-none
                ${errors.deskripsi
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/[0.08] focus:border-violet-500/30'
                }
              `}
            />
            {errors.deskripsi && <p className="text-[11px] text-red-400 mt-1.5">{errors.deskripsi}</p>}
          </div>

          {/* Warna */}
          <div>
            <label className="block text-[12px] uppercase tracking-[0.5px] font-semibold text-slate-400 mb-3">
              Warna Kategori
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, warna: color }))}
                  className={`
                    h-10 rounded-lg transition-all ${
                      formData.warna === color ? 'ring-2 ring-white scale-110' : ''
                    }
                  `}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <p className="text-[11px] text-slate-500 uppercase tracking-[0.5px] mb-3">Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: formData.warna + '30', borderLeft: `3px solid ${formData.warna}` }}
              >
                {formData.emoji}
              </div>
              <div>
                <p className="text-sm text-white font-medium">{formData.nama || 'Nama Kategori'}</p>
                <p className="text-[11px] text-slate-500">{formData.deskripsi.substring(0, 30)}{formData.deskripsi.length > 30 ? '...' : ''}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-white/[0.05] text-white font-medium text-[13px] hover:bg-white/[0.08] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white font-medium text-[13px] hover:shadow-lg hover:shadow-violet-500/50 transition-all"
            >
              {kategori ? 'Perbarui' : 'Tambah'} Kategori
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
