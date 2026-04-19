import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { loadPortalMock } from '../data/mockClient.js'

const overviewShells = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-600',
]

const actionTones = [
  'bg-blue-500 hover:bg-blue-600',
  'bg-emerald-500 hover:bg-emerald-600',
  'bg-amber-500 hover:bg-amber-600',
  'bg-rose-500 hover:bg-rose-600',
  'bg-slate-700 hover:bg-slate-800',
]

export default function Dashboard() {
  const [overviewCards, setOverviewCards] = useState([])
  const [quickActions, setQuickActions] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const mock = await loadPortalMock()
        setOverviewCards(mock?.dashboard?.overviewCards || [])
        setQuickActions(mock?.dashboard?.quickActions || [])
        setActivities(mock?.dashboard?.activities || [])
      } catch {
        setOverviewCards([])
        setQuickActions([])
        setActivities([])
      }
    }
    loadData()
  }, [])

  return (
    <div className="bg-[#f6f8fb] text-on-surface">
      <DashboardSidebar activeKey="dashboard" />
      <main className="ml-64 min-h-screen p-5">
        <header className="mb-4 flex items-center gap-2">
          <Link to="/" className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100">
            <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
          </Link>
          <h1 className="text-[31px] font-semibold text-slate-900">Trang chu</h1>
        </header>

        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-[18px] font-semibold text-slate-900">Tong quan hoat dong</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {overviewCards.map((card, index) => (
              <article key={card.key} className={`rounded-lg bg-gradient-to-br p-4 text-white ${overviewShells[index % overviewShells.length]}`}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="material-symbols-outlined !text-[24px]">{card.icon}</span>
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">{card.badge}</span>
                </div>
                <p className="text-[30px] font-extrabold leading-none">{card.value}</p>
                <p className="mt-1 text-[14px] font-medium text-white/95">{card.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-[18px] font-semibold text-slate-900">Thao tac nhanh</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {quickActions.map((item, index) => (
              <button key={item.label} className={`rounded-md px-3 py-2.5 text-[15px] font-semibold text-white transition ${actionTones[index % actionTones.length]}`}>
                <span className="material-symbols-outlined mr-1 !text-[18px]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-[18px] font-semibold text-slate-900">Hoat dong gan day</h2>
          <div className="space-y-2">
            {activities.map((item) => (
              <article key={item.title} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                <p className="text-[14px] font-medium text-slate-700">{item.title}</p>
                <span className={`text-[12px] font-semibold ${item.tone}`}>{item.time}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
