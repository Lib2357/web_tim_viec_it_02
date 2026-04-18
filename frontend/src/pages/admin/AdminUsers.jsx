import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import Toast from '../../components/Toast.jsx'
import { getAdminUserDetail, getAdminUsers, updateAdminUserStatus } from '../../api/adminService.js'

const roleLabelMap = { 0: 'Candidate', 1: 'Employer', 2: 'Admin' }
const statusLabelMap = { 0: 'Active', 1: 'Banned', 2: 'Deleted' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getAdminUsers({ page: 1, limit: 20, keyword: keyword || undefined })
      .then((data) => setUsers(data?.users ?? []))
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai users.' }))
  }, [keyword])

  const handleOpenDetail = async (userId) => {
    try {
      const detail = await getAdminUserDetail(userId)
      setSelectedUser(detail)
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the tai chi tiet user.' })
    }
  }

  const handleStatusChange = async (userId, nextStatus) => {
    try {
      await updateAdminUserStatus(userId, Number(nextStatus))
      setUsers((current) => current.map((u) => (u._id === userId ? { ...u, status: Number(nextStatus) } : u)))
      setToast({ type: 'success', message: 'Da cap nhat trang thai user.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the cap nhat trang thai user.' })
    }
  }

  return (
    <AdminLayout title="Users" subtitle="Quan ly users.">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="mb-6">
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tim full name, email..." className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" />
      </section>
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {users.map((user) => (
            <article key={user._id} className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="font-bold text-slate-900">{user.fullName}</p>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              </div>
              <button type="button" onClick={() => handleOpenDetail(user._id)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">Xem</button>
            </article>
          ))}
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedUser ? (
            <>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedUser.fullName}</h2>
              <p className="mt-2 text-sm text-slate-500">{selectedUser.email}</p>
              <div className="mt-4 text-sm text-slate-600">
                <p>Role: {roleLabelMap[selectedUser.role] ?? selectedUser.role}</p>
                <p>Status: {statusLabelMap[selectedUser.status] ?? selectedUser.status}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => handleStatusChange(selectedUser._id, 0)} className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white">Active</button>
                <button type="button" onClick={() => handleStatusChange(selectedUser._id, 1)} className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-rose-600 text-sm font-bold text-white">Ban</button>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500">Chon mot user de xem chi tiet.</div>
          )}
        </aside>
      </div>
    </AdminLayout>
  )
}
