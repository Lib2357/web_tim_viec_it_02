import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { loadAppliedJobs } from '../data/apiClient.js'

const statusOptions = ['Chon trang thai', 'Cho duyet', 'Dang xem xet', 'Chap nhan', 'Tu choi']

const statCards = [
  { key: 'total', title: 'Tong don ung tuyen', icon: 'description', tone: 'bg-blue-100 text-blue-600' },
  { key: 'pending', title: 'Cho duyet', icon: 'schedule', tone: 'bg-amber-100 text-amber-600' },
  { key: 'accepted', title: 'Duoc chap nhan', icon: 'check_circle', tone: 'bg-emerald-100 text-emerald-600' },
  { key: 'successRate', title: 'Ty le thanh cong', icon: 'trending_up', tone: 'bg-purple-100 text-purple-600' },
]

function normalizeLabel(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

export default function JobList() {
  const [status, setStatus] = useState(statusOptions[0])
  const [keyword, setKeyword] = useState('')
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const loadJobs = async () => {
      const data = await loadAppliedJobs()
      setJobs(data || [])
    }
    loadJobs()
  }, [])

  const stats = useMemo(() => {
    const total = jobs.length
    const pending = jobs.filter((job) => ['cho duyet', 'dang xem xet'].includes(normalizeLabel(job.status))).length
    const accepted = jobs.filter((job) => normalizeLabel(job.status) === 'chap nhan').length
    const successRate = total ? `${Math.round((accepted / total) * 100)}%` : '0%'
    return { total, pending, accepted, successRate }
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    return jobs.filter((job) => {
      const statusOk = status === 'Chon trang thai' || normalizeLabel(job.status) === normalizeLabel(status)
      if (!q) return statusOk
      return statusOk && `${job.title} ${job.company}`.toLowerCase().includes(q)
    })
  }, [jobs, status, keyword])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="applied-jobs" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold leading-none tracking-tight text-slate-900">Job da ung tuyen</h1>
              <p className="mt-1 text-xs font-medium text-slate-500">Theo doi trang thai ung tuyen va hieu qua tim viec cua ban</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="pressable rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50" onClick={() => { setStatus(statusOptions[0]); setKeyword('') }}>
              <span className="material-symbols-outlined mr-1.5 text-[16px]">refresh</span>Lam moi
            </button>
            <Link className="pressable rounded-lg bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600" to="/">
              <span className="material-symbols-outlined mr-1.5 text-[16px]">search</span>Tim viec moi
            </Link>
          </div>
        </header>

        <div className="p-5">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card, idx) => (
              <article key={card.key} className="card-enter rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm" style={{ animationDelay: `${80 + idx * 80}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-semibold text-slate-700">{card.title}</p>
                    <p className="mt-1.5 text-[30px] font-extrabold leading-none text-slate-900">{stats[card.key]}</p>
                    <p className="mt-1.5 text-[13px] text-slate-500">Cap nhat theo du lieu hien tai</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                    <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="material-symbols-outlined text-[22px]">work_history</span>
                    Danh sach ung tuyen
                  </h2>
                  <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-12">
                    <div className="relative lg:col-span-7">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">search</span>
                      <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="Tim kiem vi tri, cong ty..." type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    </div>
                    <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 lg:col-span-3" value={status} onChange={(e) => setStatus(e.target.value)}>
                      {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <button className="h-9 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 lg:col-span-2" onClick={() => { setStatus(statusOptions[0]); setKeyword('') }}>
                      Dat lai
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 p-5">
                  <div className="space-y-3">
                    {filteredJobs.map((job) => (
                      <article key={job.id} className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                            <p className="mt-1 text-sm text-slate-500">{job.company} • {job.location}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{job.status}</span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{job.postedAt}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-emerald-600">{job.salary}</p>
                            <Link className="mt-3 inline-flex rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700" to={`/job-detail/${job.id}`}>
                              Xem chi tiet
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
