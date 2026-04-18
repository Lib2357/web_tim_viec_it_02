import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api/adminService.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin({ email, password })
      navigate('/admin/dashboard')
    } catch (submitError) {
      setError(submitError.message || 'Khong the dang nhap admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#eef4ff] px-6">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">Chocode Admin</p>
        <h1 className="mt-3 text-[34px] font-extrabold tracking-tight text-slate-900">Dang nhap</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4" placeholder="admin@example.com" />
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4" placeholder="password" />
          {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#2563EB] text-sm font-bold text-white">
            {loading ? 'Dang dang nhap...' : 'Dang nhap admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
