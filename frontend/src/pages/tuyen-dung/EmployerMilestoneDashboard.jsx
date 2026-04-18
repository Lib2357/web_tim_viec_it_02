import { useEffect, useMemo, useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import { loadHardcodedMock } from '../../data/hardcodedClient.js'

export default function EmployerMilestoneDashboard() {
  const [milestones, setMilestones] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const mock = await loadHardcodedMock()
      setMilestones(mock?.employerMilestones?.seedMilestones || [])
    }
    loadData().catch(() => setMilestones([]))
  }, [])

  const stats = useMemo(() => {
    const total = milestones.length
    const completed = milestones.filter((item) => item.status === 'Hoan thanh').length
    const inProgress = milestones.filter((item) => item.status !== 'Hoan thanh').length
    return { total, completed, inProgress }
  }, [milestones])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="milestone" />
      <main className="ml-64 min-h-screen p-5">
        <h1 className="mb-4 text-[28px] font-bold text-slate-900">Employer Milestones</h1>
        <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4">Tong milestone: {stats.total}</article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">Hoan thanh: {stats.completed}</article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">Dang lam: {stats.inProgress}</article>
        </section>
        <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
          {milestones.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-600">{item.candidate} - {item.role}</p>
              <p className="text-xs text-slate-500">{item.status} - {item.progress}% - {item.budget} - {item.deadline}</p>
              <p className="text-xs text-slate-500">{item.note}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
