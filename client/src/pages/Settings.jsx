// src/pages/Settings.jsx
import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../lib/api'

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await userApi.getSettings()
      setSettings(res.data || {})
    } catch (err) {
      console.error('Gagal fetch settings:', err)
      setSettings({})
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      await userApi.updateSettings(settings)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      console.error('Gagal save settings:', err)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Memuat pengaturan...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-slate-100 tracking-tight">
          Pengaturan
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Kelola preferensi dan tema aplikasi
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Tema Section */}
        <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                  <MoonIcon />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400">
                  <SunIcon />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-slate-100">
                  Tema Aplikasi
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Pilih tema terang atau gelap
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 flex gap-3">
            {/* Dark Theme Button */}
            <button
              onClick={toggleTheme}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'border-violet-600 bg-violet-600/10 text-violet-400'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MoonIcon />
                <span className="text-[13px] font-medium">Mode Gelap</span>
                {theme === 'dark' && <CheckIcon />}
              </div>
            </button>

            {/* Light Theme Button */}
            <button
              onClick={toggleTheme}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                theme === 'light'
                  ? 'border-amber-600 bg-amber-600/10 text-amber-400'
                  : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <SunIcon />
                <span className="text-[13px] font-medium">Mode Terang</span>
                {theme === 'light' && <CheckIcon />}
              </div>
            </button>
          </div>
        </div>

        {/* Notifikasi Section */}
        <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                <BellIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-slate-100">
                  Notifikasi
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Kelola preferensi notifikasi
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            {[
              {
                key: 'notifTransaksi',
                label: 'Notifikasi Transaksi',
                desc: 'Terima notifikasi ketika ada transaksi baru'
              },
              {
                key: 'notifLaporan',
                label: 'Notifikasi Laporan Mingguan',
                desc: 'Dapatkan laporan ringkas setiap minggu'
              },
              {
                key: 'notifBudget',
                label: 'Peringatan Budget',
                desc: 'Tegur saat budget sudah mencapai 80%'
              },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-slate-200">{item.label}</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleToggleSetting(item.key)}
                    className={`w-12 h-7 rounded-full transition-all relative ${
                      settings[item.key] 
                        ? 'bg-violet-600' 
                        : 'bg-slate-700'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                      settings[item.key] ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keamanan Section */}
        <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                <ShieldIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-slate-100">
                  Keamanan
                </h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Kelola keamanan akun Anda
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-3">
            <button className="w-full py-2.5 px-4 text-left text-[13px] text-slate-300 hover:text-slate-100 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg transition-all flex items-center justify-between">
              <span>Ubah Password</span>
              <span className="text-slate-600">→</span>
            </button>
            <button 
              onClick={logout}
              className="w-full py-2.5 px-4 text-left text-[13px] text-red-400 hover:text-red-300 bg-red-600/10 hover:bg-red-600/20 rounded-lg transition-all flex items-center justify-between"
            >
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex-1 py-2.5 px-4 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-lg text-[13px] font-medium flex items-center gap-2 ${
          saveStatus === 'success'
            ? 'bg-emerald-600/10 text-emerald-400'
            : 'bg-red-600/10 text-red-400'
        }`}>
          {saveStatus === 'success' ? (
            <>
              <span>✓</span>
              Pengaturan berhasil disimpan
            </>
          ) : (
            <>
              <span>✗</span>
              Gagal menyimpan pengaturan
            </>
          )}
        </div>
      )}
    </div>
  )
}
