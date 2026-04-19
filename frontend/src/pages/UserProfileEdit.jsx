import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { getMyProfile, updateMyProfile } from '../api/userService.js'

function toSkillText(skills) {
  return Array.isArray(skills) ? skills.join(', ') : ''
}

function toSkillArray(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function UserProfileEdit() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    address: '',
    skillsText: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data)
        setForm({
          fullName: data.fullName || '',
          bio: data.bio || '',
          address: data.address || '',
          skillsText: toSkillText(data.skills),
        })
      })
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai profile.' }))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const updated = await updateMyProfile({
        fullName: form.fullName,
        bio: form.bio,
        address: form.address,
        skills: toSkillArray(form.skillsText),
      })
      setProfile(updated)
      setForm((current) => ({ ...current, skillsText: toSkillText(updated.skills) }))
      setToast({ type: 'success', message: 'Da cap nhat profile.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the cap nhat profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[#f6f8fb] text-on-surface">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <main className="min-h-screen px-6 py-8 xl:px-10 2xl:px-14">
        <header className="mb-6 flex items-center gap-2">
          <Link to="/" className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100">
            <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-[31px] font-semibold text-slate-900">Cap nhat profile</h1>
            <p className="mt-1 text-sm text-slate-500">Cap nhat thong tin ca nhan va ky nang de ho so cua ban day du hon.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_340px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {loading ? (
              <div className="text-sm text-slate-500">Dang tai profile...</div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
                  <input value={form.fullName} onChange={(event) => handleChange('fullName', event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" placeholder="Nhap full name" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Bio</label>
                  <textarea value={form.bio} onChange={(event) => handleChange('bio', event.target.value)} rows="5" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Mo ta ngan ve ban than" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
                  <input value={form.address} onChange={(event) => handleChange('address', event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" placeholder="Nhap dia chi" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Skills</label>
                  <textarea
                    value={form.skillsText}
                    onChange={(event) => handleChange('skillsText', event.target.value)}
                    rows="4"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    placeholder="React, Vite, Tailwind CSS"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Nhap danh sach skill, ngan cach bang dau phay. API PATCH dung field <code className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">skills: string[]</code>.
                  </p>
                </div>
                <button type="submit" disabled={saving} className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white disabled:opacity-60">
                  {saving ? 'Dang luu...' : 'Cap nhat profile'}
                </button>
              </form>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Profile hien tai</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-900">Username:</span> {profile?.username || '--'}</p>
                <p><span className="font-semibold text-slate-900">Email:</span> {profile?.email || '--'}</p>
                <p><span className="font-semibold text-slate-900">Full Name:</span> {profile?.fullName || '--'}</p>
                <p><span className="font-semibold text-slate-900">Address:</span> {profile?.address || '--'}</p>
              </div>
              {profile?.username ? (
                <Link to={`/user/profile/${profile.username}`} className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700">
                  Xem profile public
                </Link>
              ) : null}
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
