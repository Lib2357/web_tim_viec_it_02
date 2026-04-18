import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import { loadHardcodedMock } from '../../data/hardcodedClient.js'

export default function EmployerReceivedProfiles() {
  const [candidates, setCandidates] = useState([])
  const [statusOptions, setStatusOptions] = useState([])
  const [statusFilter, setStatusFilter] = useState('Moi nhan')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const mock = await loadHardcodedMock()
      const data = mock?.employerReceivedProfiles || {}
      setCandidates(data.candidates || [])
      setStatusOptions(data.applicationStatusOptions || [])
      setStatusFilter((data.applicationStatusOptions || [])[0] || 'Moi nhan')
    }
    loadData().catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return candidates.filter((item) => {
      const statusOk = !statusFilter || item.status === statusFilter
      const qOk = !q || `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(q)
      return statusOk && qOk
    })
  }, [candidates, statusFilter, search])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="received-cv" />
      <main className="ml-64 min-h-screen p-5">
        <h1 className="mb-4 text-[24px] font-bold">Ho so da nhan</h1>
        <section className="mb-4 flex flex-wrap gap-2">
          <input className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" placeholder="Tim ung vien..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statusOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </section>

        <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {filtered.map((candidate) => (
            <article key={candidate.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div>
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-slate-600">{candidate.email} - {candidate.role}</p>
                <p className="text-xs text-slate-500">{candidate.experience} - {candidate.submittedAt} - {candidate.status}</p>
              </div>
              <Link to={`/employer-received-cv/${candidate.id}`} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                Xem chi tiet
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
