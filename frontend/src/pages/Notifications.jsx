import { useEffect, useMemo, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { loadPortalMock } from '../data/mockClient.js'

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all')
  const [tabs, setTabs] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const mock = await loadPortalMock()
        setTabs(mock?.notifications?.tabs || [])
        setItems(mock?.notifications?.items || [])
      } catch {
        setTabs([])
        setItems([])
      }
    }
    loadData()
  }, [])

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return items
    if (activeTab === 'unread') return items.filter((item) => !item.read)
    return items.filter((item) => item.tab === activeTab)
  }, [items, activeTab])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="notifications" />
      <main className="ml-64 min-h-screen p-5">
        <header className="mb-4 flex items-start justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-[21px] font-semibold leading-tight text-slate-900">Thong bao</h1>
            <p className="mt-1 text-[13px] text-slate-500">{items.filter((item) => !item.read).length} thong bao chua doc</p>
          </div>
        </header>

        <section className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center">
            {tabs.map((tab) => {
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  className={`relative flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[14px] font-medium transition ${
                    active ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span className="material-symbols-outlined !text-[17px]">{tab.icon}</span>
                  {tab.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold text-white ${tab.tone}`}>{tab.count}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {filteredItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Khong co thong bao nao</p>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <article key={item.id} className={`rounded-lg border px-3 py-3 ${item.read ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <span className="text-[11px] uppercase text-slate-400">{item.tab}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                  <p className={`mt-1 text-[11px] font-semibold ${item.read ? 'text-slate-400' : 'text-blue-600'}`}>{item.read ? 'Da doc' : 'Chua doc'}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
