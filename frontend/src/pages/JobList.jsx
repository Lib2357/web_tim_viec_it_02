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

function statusTone(status) {
  const normalized = normalizeLabel(status)
  if (normalized === 'chap nhan') return 'bg-emerald-50 text-emerald-700'
  if (normalized === 'tu choi') return 'bg-rose-50 text-rose-700'
  if (normalized === 'cho duyet') return 'bg-amber-50 text-amber-700'
  return 'bg-blue-50 text-blue-700'
}

function formatDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('vi-VN')
}

export default function JobList() {
  const [status, setStatus] = useState(statusOptions[0])
  const [keyword, setKeyword] = useState('')
  const [jobs, setJobs] = useState([])
  const [openMenuId, setOpenMenuId] = useState(null)

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
      return statusOk && `${job.title} ${job.company} ${job.location} ${job.level} ${job.workMode}`.toLowerCase().includes(q)
    })
  }, [jobs, status, keyword])

  const handleWithdraw = (jobId) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: 'Da rut',
              updatedAt: new Date().toISOString(),
            }
          : job,
      ),
    )
    setOpenMenuId(null)
  }

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
              <p className="mt-1 text-xs font-medium text-slate-500">Theo doi trang thai, thong tin job va tien trinh ung tuyen cua ban</p>
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
                    <p className="mt-1.5 text-[13px] text-slate-500">Cap nhat theo du lieu API mock</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                    <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-12">
            <div className="xl:col-span-9">
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="material-symbols-outlined text-[22px]">work_history</span>
                    Danh sach ung tuyen
                  </h2>
                  <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-12">
                    <div className="relative lg:col-span-7">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">search</span>
                      <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="Tim kiem vi tri, cong ty, level..." type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
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
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <article key={job.id} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-3">
                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
                                <img alt="Employer" className="h-full w-full object-cover" src={job.avatar} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-[17px] font-bold text-slate-900">{job.title}</h4>
                                <p className="mt-1 text-sm text-slate-500">{job.company} • {job.location}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(job.status)}`}>{job.status}</span>
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Dang tuyen: {job.postedAt}</span>
                                  {job.appliedAt && <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">Ung tuyen: {formatDateTime(job.appliedAt)}</span>}
                                  {job.updatedAt && <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">Cap nhat: {formatDateTime(job.updatedAt)}</span>}
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Muc luong</p>
                                <p className="mt-1 text-sm font-bold text-emerald-600">{job.salary}</p>
                              </div>
                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Cap bac</p>
                                <p className="mt-1 text-sm font-semibold text-slate-700">{job.level}</p>
                              </div>
                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Hinh thuc</p>
                                <p className="mt-1 text-sm font-semibold text-slate-700">{job.workMode}</p>
                              </div>
                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Han nop / So luong</p>
                                <p className="mt-1 text-sm font-semibold text-slate-700">{job.deadline} • {job.openings}</p>
                              </div>
                            </div>

                            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-3">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Tom tat cong viec</p>
                              <p className="mt-2 text-[13px] leading-6 text-slate-600">{job.summary}</p>
                            </div>

                            {!!job.skills?.length && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                  <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="relative flex shrink-0 flex-row items-center justify-between gap-3 xl:w-[156px] xl:flex-col xl:items-end">
                            <div className="text-left xl:text-right">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Trang thai ho so</p>
                              <p className="mt-1 text-sm font-bold text-slate-800">{job.status}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOpenMenuId((prev) => (prev === job.id ? null : job.id))}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                            >
                              Thao tac
                              <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            {openMenuId === job.id && (
                              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)]">
                                <Link
                                  to={`/job-detail/${job.id}`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                                  Xem chi tiet
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleWithdraw(job.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                                >
                                  <span className="material-symbols-outlined text-[18px]">logout</span>
                                  Rut ho so
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}

                    {filteredJobs.length === 0 && (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                        Khong co ho so ung tuyen phu hop voi bo loc hien tai.
                      </div>
                    )}
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
