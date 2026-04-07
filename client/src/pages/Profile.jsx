// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { userApi } from '../lib/api'

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await userApi.getProfile()
      setProfile(res.data || user)
      setFormData({
        name: res.data?.name || user?.name || '',
        email: res.data?.email || user?.email || '',
      })
    } catch (err) {
      console.error('Gagal fetch profile:', err)
      setProfile(user)
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await userApi.updateProfile(formData)
      setProfile(res.data)
      setIsEditing(false)
    } catch (err) {
      console.error('Gagal update profile:', err)
      alert('Gagal menyimpan profile: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Memuat profile...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold text-slate-100 tracking-tight">
          Profil Pengguna
        </h1>
        <p className="text-[13px] text-slate-500 mt-1">
          Kelola informasi akun Anda
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0C1120] border border-white/[0.06] rounded-2xl overflow-hidden">
        
        {/* Header dengan Avatar */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border-b border-white/[0.06] px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-[32px] font-bold text-white">
                  {(profile?.name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-slate-100">
                  {profile?.name || 'Pengguna'}
                </h2>
                <p className="text-[13px] text-slate-500 mt-1">
                  {profile?.email}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 text-[13px] font-medium transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex flex-col gap-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[1px] mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#0F1829] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] px-4 py-2.5 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-[1px] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#0F1829] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] px-4 py-2.5 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 text-[13px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 text-[13px] font-medium transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info Item: Name */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                  <UserIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-600 uppercase tracking-[1px] font-medium">
                    Nama Lengkap
                  </p>
                  <p className="text-[13px] text-slate-200 font-medium mt-0.5">
                    {profile?.name || '-'}
                  </p>
                </div>
              </div>

              {/* Info Item: Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <EmailIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-600 uppercase tracking-[1px] font-medium">
                    Email
                  </p>
                  <p className="text-[13px] text-slate-200 font-medium mt-0.5 break-all">
                    {profile?.email || '-'}
                  </p>
                </div>
              </div>

              {/* Info Item: Joined Date */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <CalendarIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-600 uppercase tracking-[1px] font-medium">
                    Bergabung Sejak
                  </p>
                  <p className="text-[13px] text-slate-200 font-medium mt-0.5">
                    {profile?.createdAt 
                      ? new Date(profile.createdAt).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })
                      : '-'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
