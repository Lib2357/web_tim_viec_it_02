import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { loadJobDetail, loadOtherJobDetails } from '../data/apiClient.js'

export default function JobDetail() {
  const { id } = useParams()
  const [jobs, setJobs] = useState([])
  const [job, setJob] = useState(null)

  useEffect(() => {
    const loadJobs = async () => {
      const [jobData, otherJobs] = await Promise.all([loadJobDetail(id), loadOtherJobDetails(id)])
      setJob(jobData)
      setJobs(jobData ? [jobData, ...(otherJobs || [])] : otherJobs || [])
    }
    loadJobs()
  }, [id])

  const otherJobs = useMemo(() => {
    if (!job) return []
    return jobs.filter((item) => item.id !== job.id)
  }, [jobs, job])

  const companyFacts = useMemo(() => {
    if (!job) return []

    return [
      { icon: 'apartment', label: 'Quy mo', value: job.companyFacts?.size || 'Dang cap nhat' },
      { icon: 'category', label: 'Linh vuc', value: job.tags?.join(', ') || 'Dang cap nhat' },
      { icon: 'schedule', label: 'Thoi gian', value: job.workMode || 'Dang cap nhat' },
      { icon: 'language', label: 'Website', value: job.companyFacts?.website || 'Dang cap nhat' },
    ]
  }, [job])

  if (!job) {
    return <div className="min-h-screen bg-[#f3f7fb] p-10 text-center text-slate-600">Dang tai du lieu cong viec...</div>
  }

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
              <span className="material-symbols-outlined mr-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                code
              </span>
              CHOCODE
            </Link>
            <div className="hidden items-center gap-4 text-sm font-medium text-slate-600 lg:flex">
              <a className="nav-link-animate" href="#">
                Viec lam IT
              </a>
              <a className="nav-link-animate" href="#">
                Tim Developer
              </a>
              <a className="nav-link-animate" href="#">
                AI Analysis
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/jobs" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Job da ung tuyen
            </Link>
            <Link to="/dashboard" className="rounded-full bg-[#007bff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="border-b border-blue-500/20 bg-gradient-to-r from-[#20c3d0] via-[#2489d2] to-[#1e58b1]">
        <div className="mx-auto grid max-w-[1240px] gap-3 px-6 py-4 lg:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="h-12 w-full rounded-xl border border-white/30 bg-white px-12 text-sm outline-none transition focus:ring-4 focus:ring-white/20" placeholder="Tim vi tri tuyen dung" type="text" />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
            <input className="h-12 w-full rounded-xl border border-white/30 bg-white px-12 text-sm outline-none transition focus:ring-4 focus:ring-white/20" placeholder="Dia diem lam viec" type="text" />
          </div>
          <button className="h-12 rounded-xl bg-[#007bff] px-7 text-sm font-bold text-white transition hover:bg-blue-700">Tim kiem</button>
        </div>
      </div>

      <main className="mx-auto max-w-[1240px] px-6 py-5">
        <div className="mb-5 text-sm font-medium text-slate-500">
          <Link to="/" className="text-[#2489d2] hover:underline">
            Trang chu
          </Link>{' '}
          /{' '}
          <Link to="/jobs" className="text-[#2489d2] hover:underline">
            Job da ung tuyen
          </Link>{' '}
          / <span className="text-slate-700">{job.title}</span>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">{job.status}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{job.workMode}</span>
                  </div>
                  <h1 className="max-w-4xl text-[25px] font-black leading-tight tracking-tight text-slate-950">{job.title}</h1>
                  <p className="mt-1.5 text-[16px] font-bold text-slate-800">{job.company}</p>
                  <p className="mt-3 max-w-3xl text-[14px] leading-6 text-slate-600">{job.summary}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-600">
                  Han nop ho so
                  <p className="mt-1 text-[18px] font-black text-slate-900">{job.deadline}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { icon: 'payments', label: 'Thu nhap', value: job.salary },
                  { icon: 'location_on', label: 'Dia diem', value: job.location },
                  { icon: 'work_history', label: 'Kinh nghiem', value: job.experience },
                ].map((item) => (
                  <article key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e58b1] text-white shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <p className="text-[13px] text-slate-500">{item.label}</p>
                    <p className="mt-1 text-[15px] font-bold text-slate-900">{item.value}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button className="flex-1 rounded-xl bg-[#007bff] px-5 py-3 text-base font-bold text-white transition hover:bg-blue-700">Ung tuyen ngay</button>
                <button className="rounded-xl border border-[#007bff] bg-white px-5 py-3 text-base font-bold text-[#007bff] transition hover:bg-blue-50">Luu tin</button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-8">
                  <button className="border-b-2 border-[#007bff] pb-3 text-[15px] font-bold text-[#007bff]">Chi tiet tin tuyen dung</button>
                  <button className="pb-3 text-[15px] font-bold text-slate-400">Viec lam lien quan</button>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-4 flex items-center gap-3 text-[17px] font-black text-slate-950">
                  <span className="h-7 w-1.5 rounded-full bg-[#007bff]" />
                  The cong viec
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-[13px] font-semibold text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="mb-3 text-[17px] font-black text-slate-950">Mo ta cong viec</h3>
                  <ul className="space-y-2 text-[14px] leading-7 text-slate-700">
                    {job.responsibilities.map((item) => (
                      <li key={item} className="ml-5 list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 text-[17px] font-black text-slate-950">Yeu cau ung vien</h3>
                  <ul className="space-y-2 text-[14px] leading-7 text-slate-700">
                    {job.requirements.map((item) => (
                      <li key={item} className="ml-5 list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 text-[17px] font-black text-slate-950">Quyen loi</h3>
                  <ul className="space-y-2 text-[14px] leading-7 text-slate-700">
                    {job.benefits.map((item) => (
                      <li key={item} className="ml-5 list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
              <h3 className="mb-4 text-[19px] font-black text-slate-950">Chi tiet cac cong viec khac</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {otherJobs.map((item) => (
                  <article key={item.id} className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">{item.company}</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-600">{item.salary}</p>
                    <Link className="mt-3 inline-flex text-sm font-bold text-[#007bff] hover:underline" to={`/job-detail/${item.id}`}>
                      Xem chi tiet
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
              <h2 className="text-[24px] font-black leading-tight text-slate-950">{job.company}</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">{job.companyDescription || 'Dang cap nhat thong tin cong ty.'}</p>

              <div className="mt-6 space-y-4">
                {companyFacts.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#007bff]">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-[13px] text-slate-500">{item.label}</p>
                      <p className="mt-1 text-[15px] font-bold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
              <h3 className="mb-4 text-[19px] font-black text-slate-950">Thong tin chung</h3>
              <div className="space-y-3 text-[13px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Cap bac</span>
                  <span className="font-bold text-slate-800">{job.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">So luong tuyen</span>
                  <span className="font-bold text-slate-800">{job.openings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hinh thuc</span>
                  <span className="font-bold text-slate-800">{job.workMode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Dia chi cong ty</span>
                  <span className="font-bold text-slate-800">{job.companyFacts?.address || 'Dang cap nhat'}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.4)]">
              <h3 className="mb-4 text-[19px] font-black text-slate-950">Cong viec trong danh sach</h3>
              <div className="space-y-2.5">
                {jobs.map((item) => (
                  <Link
                    key={item.id}
                    className={`block rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      item.id === job.id ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    to={`/job-detail/${item.id}`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
