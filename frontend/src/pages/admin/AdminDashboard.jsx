import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import { getAdminDashboardSummary } from '../../api/adminService.js'
import Toast from '../../components/Toast.jsx'

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getAdminDashboardSummary()
      .then((data) => setSummary(data))
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai admin dashboard.' }))
  }, [])

  const cards = [
    { title: 'Tong users', value: summary?.total_users ?? '--' },
    { title: 'User chua verify', value: summary?.unverified_users ?? '--' },
    { title: 'Tong companies', value: summary?.total_companies ?? '--' },
    { title: 'Company chua verify', value: summary?.unverified_companies ?? '--' },
    { title: 'Tong jobs', value: summary?.total_jobs ?? '--' },
    { title: 'Open jobs', value: summary?.open_jobs ?? '--' },
    { title: 'Tong applications', value: summary?.total_applications ?? '--' },
  ]

  return (
    <AdminLayout title="Dashboard" subtitle="Tong quan he thong admin tu GET /admin/dashboard/summary.">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{card.title}</p>
            <p className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
          </article>
        ))}
      </section>
    </AdminLayout>
  )
}
