import { useEffect, useMemo, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { loadPortalMock } from '../data/mockClient.js'

export default function MessagesCenter() {
  const [query, setQuery] = useState('')
  const [threads, setThreads] = useState([])
  const [messagesByThread, setMessagesByThread] = useState({})
  const [websiteNotifications, setWebsiteNotifications] = useState([])
  const [activeThreadId, setActiveThreadId] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const mock = await loadPortalMock()
        const nextThreads = mock?.messages?.threads || []
        setThreads(nextThreads)
        setMessagesByThread(mock?.messages?.messagesByThread || {})
        setWebsiteNotifications(mock?.messages?.websiteNotifications || [])
        setActiveThreadId(nextThreads[0]?.id || '')
      } catch {
        setThreads([])
        setMessagesByThread({})
        setWebsiteNotifications([])
      }
    }
    loadData()
  }, [])

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return threads
    return threads.filter((t) => `${t.name} ${t.role} ${t.lastMessage}`.toLowerCase().includes(q))
  }, [query, threads])

  const activeThread = filteredThreads.find((t) => t.id === activeThreadId) || filteredThreads[0] || null
  const conversation = activeThread ? messagesByThread[activeThread.id] || [] : []

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="messages" />
      <main className="ml-64 h-screen overflow-hidden">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-5 py-3 backdrop-blur-md">
          <h1 className="text-[22px] font-semibold text-slate-900">Tin nhan</h1>
        </header>

        <div className="grid h-[calc(100vh-76px)] grid-cols-1 gap-4 overflow-hidden p-5 xl:grid-cols-12">
          <section className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-3">
            <div className="border-b border-slate-100 p-3.5">
              <input
                className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-[14px] outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="Tim hoi thoai..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredThreads.map((thread) => {
                const active = activeThread?.id === thread.id
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`mb-1.5 w-full rounded-lg border px-3 py-2.5 text-left transition ${
                      active ? 'border-blue-200 bg-blue-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-semibold text-slate-900">{thread.name}</p>
                      <div className="flex items-center gap-2">
                        {thread.unread > 0 && <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">{thread.unread}</span>}
                        <span className="text-[11px] text-slate-500">{thread.lastTime}</span>
                      </div>
                    </div>
                    <p className="mt-0.5 text-[12px] text-slate-500">{thread.role}</p>
                    <p className="mt-1 text-[12px] text-slate-600">{thread.lastMessage}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">{thread.type}</p>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm xl:col-span-6">
            <div className="border-b border-slate-100 px-4 py-3">
              <h2 className="text-[16px] font-semibold text-slate-900">{activeThread?.name || 'Chua co hoi thoai'}</h2>
              <p className="text-[12px] text-slate-500">{activeThread?.role || ''}</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 px-4 py-4">
              {conversation.map((msg, idx) => (
                <div key={`${msg.time}-${idx}`} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-[13px] ${msg.from === 'me' ? 'bg-blue-500 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>
                    <p>{msg.text}</p>
                    <p className={`mt-1 text-[11px] ${msg.from === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              {conversation.length === 0 && <p className="text-sm text-slate-500">Khong co tin nhan.</p>}
            </div>
          </section>

          <aside className="h-full space-y-4 overflow-y-auto xl:col-span-3">
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-[16px] font-semibold text-slate-900">Thong bao website</h3>
              <div className="space-y-2">
                {websiteNotifications.map((item) => (
                  <article key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-[13px] font-medium text-slate-700">{item.title}</p>
                    <p className={`mt-1 text-[11px] ${item.tone}`}>{item.time}</p>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
