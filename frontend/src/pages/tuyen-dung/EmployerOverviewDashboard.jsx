import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import { loadHardcodedMock } from '../../data/hardcodedClient.js'

export default function EmployerOverviewDashboard() {
  const [overviewCards, setOverviewCards] = useState([])
  const [quickActions, setQuickActions] = useState([])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const mock = await loadHardcodedMock()
      setOverviewCards(mock?.employerOverview?.overviewCards || [])
      setQuickActions(mock?.employerOverview?.quickActions || [])
      setRecentActivities(mock?.employerOverview?.recentActivities || [])
    }
    loadData().catch(() => {})
  }, [])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="employer-dashboard" />
      <main className="ml-64 min-h-screen p-5">
        <h1 className="mb-4 text-[28px] font-bold text-slate-900">Employer Dashboard</h1>
        <section className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {overviewCards.map((card) => (
            <article key={card.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">{card.icon}</span>
              </div>
            </article>
          ))}
        </section>
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((item) => (
              <Link key={item.label} to={item.to} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Recent activities</h2>
          <div className="space-y-2">
            {recentActivities.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
