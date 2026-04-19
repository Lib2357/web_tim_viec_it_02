import { useEffect, useMemo, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar.jsx'
import { loadUserUploadedCvs } from '../data/apiClient.js'

function formatDateTime(value) {
  if (!value) return 'Dang cap nhat'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Dang cap nhat'
  return date.toLocaleDateString('vi-VN')
}

export default function UploadedCvs() {
  const [cvs, setCvs] = useState([])
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const data = await loadUserUploadedCvs()
      setCvs(data || [])
    }
    loadData()
  }, [])

  const filteredCvs = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    if (!q) return cvs
    return cvs.filter((item) =>
      `${item.title} ${item.target_role} ${item.file_name} ${(item.skills || []).join(' ')}`.toLowerCase().includes(q),
    )
  }, [cvs, keyword])

  const stats = useMemo(() => {
    const total = cvs.length
    const defaultCount = cvs.filter((item) => item.is_default).length
    const usedCount = cvs.filter((item) => (item.applications_count || 0) > 0).length
    const totalApplications = cvs.reduce((sum, item) => sum + (item.applications_count || 0), 0)
    return { total, defaultCount, usedCount, totalApplications }
  }, [cvs])

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="uploaded-cvs" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold leading-none tracking-tight text-slate-900">CV da tai len</h1>
              <p className="mt-1 text-xs font-medium text-slate-500">Thu vien CV gan voi tai khoan de su dung cho luong ung tuyen qua `cv_id`.</p>
            </div>
          </div>
        </header>

        <div className="p-5">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Tong CV', value: stats.total, icon: 'folder_open', tone: 'bg-blue-100 text-blue-600' },
              { label: 'CV mac dinh', value: stats.defaultCount, icon: 'star', tone: 'bg-amber-100 text-amber-600' },
              { label: 'Da tung su dung', value: stats.usedCount, icon: 'task_alt', tone: 'bg-emerald-100 text-emerald-600' },
              { label: 'Luot ung tuyen', value: stats.totalApplications, icon: 'send', tone: 'bg-violet-100 text-violet-600' },
            ].map((card) => (
              <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-semibold text-slate-700">{card.label}</p>
                    <p className="mt-1.5 text-[30px] font-extrabold leading-none text-slate-900">{card.value}</p>
                    <p className="mt-1.5 text-[13px] text-slate-500">Mock theo docs API va flow apply</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                    <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Danh sach CV tren he thong</h2>
                  <p className="mt-1 text-sm text-slate-500">Thong tin hien thi duoc mock dua tren `cv_id` trong docs va nhu cau chon CV khi ung tuyen.</p>
                </div>
                <div className="relative w-full lg:w-[360px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-slate-400">search</span>
                  <input
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Tim theo ten CV, vi tri, ky nang..."
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {filteredCvs.map((cv) => (
                <article key={cv.cv_id} className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-bold text-slate-900">{cv.title}</h3>
                        {cv.is_default && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">CV mac dinh</span>}
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{cv.visibility}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{cv.file_name}</p>

                      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">CV ID</p>
                          <p className="mt-1 break-all text-sm font-semibold text-slate-700">{cv.cv_id}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Vi tri muc tieu</p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">{cv.target_role}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Dinh dang / Dung luong</p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">{cv.file_type} / {cv.file_size}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Kinh nghiem</p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">{cv.years_experience}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Tom tat CV</p>
                        <p className="mt-2 text-[13px] leading-6 text-slate-600">{cv.summary}</p>
                      </div>

                      {!!cv.skills?.length && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {cv.skills.map((skill) => (
                            <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid min-w-[220px] grid-cols-2 gap-3 xl:w-[250px] xl:grid-cols-1">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Tao luc</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{formatDateTime(cv.created_at)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Cap nhat gan nhat</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{formatDateTime(cv.updated_at)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Lan dung cuoi</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{formatDateTime(cv.last_used_at)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Luot ung tuyen</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{cv.applications_count}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filteredCvs.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                  Khong tim thay CV phu hop voi tu khoa hien tai.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
