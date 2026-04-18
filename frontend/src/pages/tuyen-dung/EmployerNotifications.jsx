import { useEffect, useMemo, useState } from 'react'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import { loadHardcodedMock } from '../../data/hardcodedClient.js'

export default function EmployerNotifications() {
  const [tabs, setTabs] = useState([])
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('Tat ca')

  useEffect(() => {
    const loadData = async () => {
      const mock = await loadHardcodedMock()
      setTabs(mock?.employerNotifications?.tabs || [])
      setItems(mock?.employerNotifications?.items || [])
    }
    loadData().catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    if (activeTab === 'Tat ca') return items
    if (activeTab === 'Chua doc') return items.filter((item) => !item.read)
    return items.filter((item) => item.type === activeTab)
  }, [items, activeTab])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="employer-notifications" />
      <main className="ml-64 min-h-screen p-5">
        <h1 className="mb-4 text-[24px] font-bold">Employer Notifications</h1>
        <div className="mb-4 flex gap-2">
          {tabs.map((tab) => (
            <button key={tab} className={`rounded-lg px-3 py-2 text-sm ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {filtered.map((item) => (
            <article key={item.id} className={`rounded-lg border px-3 py-3 ${item.read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{item.title}</p>
                <span className="text-[11px] uppercase text-slate-400">{item.type}</span>
              </div>
              <p className="text-xs text-slate-500">{item.time}</p>
              <p className={`mt-1 text-[11px] font-semibold ${item.read ? 'text-slate-400' : 'text-blue-600'}`}>{item.read ? 'Da doc' : 'Chua doc'}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
