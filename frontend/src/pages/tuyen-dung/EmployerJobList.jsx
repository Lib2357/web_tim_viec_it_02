import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import EmployerSectionTabs from '../../components/EmployerSectionTabs.jsx'
import { deleteRecruitmentJob, formatDate, getRecruitmentJobs, getStatCards, statusClass, statusOptions } from './employerData.js'

const jobsPerPage = 5

export default function EmployerJobList() {
  const navigate = useNavigate()
  const location = useLocation()
  const [jobs, setJobs] = useState(() => getRecruitmentJobs())
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState(statusOptions[0])
  const [fromDate, setFromDate] = useState('2026-04-01')
  const [toDate, setToDate] = useState('2026-12-31')
  const [currentPage, setCurrentPage] = useState(1)
  const [highlightId, setHighlightId] = useState(location.state?.createdJobId ?? location.state?.updatedJobId ?? null)

  useEffect(() => {
    setJobs(getRecruitmentJobs())
  }, [location.key])

  useEffect(() => {
    setHighlightId(location.state?.createdJobId ?? location.state?.updatedJobId ?? null)
  }, [location.state])

  useEffect(() => {
    if (!highlightId) return undefined
    const timeoutId = window.setTimeout(() => setHighlightId(null), 3500)
    return () => window.clearTimeout(timeoutId)
  }, [highlightId])

  const filteredJobs = useMemo(() => {
    const query = keyword.trim().toLowerCase()

    return jobs.filter((job) => {
      const matchesKeyword = !query || `${job.title} ${job.department} ${job.type} ${job.location}`.toLowerCase().includes(query)
      const matchesStatus = status === statusOptions[0] || job.status === status
      const matchesFromDate = !fromDate || job.postedAt >= fromDate
      const matchesToDate = !toDate || job.postedAt <= toDate
      return matchesKeyword && matchesStatus && matchesFromDate && matchesToDate
    })
  }, [fromDate, jobs, keyword, status, toDate])

  const statCards = useMemo(() => getStatCards(jobs), [jobs])
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * jobsPerPage
    return filteredJobs.slice(startIndex, startIndex + jobsPerPage)
  }, [currentPage, filteredJobs])

  const handleDeleteJob = (job) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa job "${job.title}" không?`)
    if (!confirmed) return

    const nextJobs = deleteRecruitmentJob(job.id)
    setJobs(nextJobs)
    setHighlightId(null)
  }

  const handleEditJob = (job) => {
    navigate('/employer-post-job', { state: { editJobId: job.id } })
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const showingFrom = filteredJobs.length === 0 ? 0 : (currentPage - 1) * jobsPerPage + 1
  const showingTo = Math.min(currentPage * jobsPerPage, filteredJobs.length)

  return (
    <div className="dashboard-copy-font min-h-screen bg-[#F9FAFB] text-slate-900">
      <DashboardSidebar activeKey="job-list" />

      <main className="ml-64 min-h-screen bg-[#F9FAFB]">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="relative block w-full max-w-[560px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Tìm kiếm hệ thống..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <div className="flex items-center justify-between gap-4 xl:justify-end">
              <div className="flex items-center gap-2">
                <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100">
                  <span className="material-symbols-outlined">help</span>
                </button>
              </div>

              <div className="hidden h-8 w-px bg-slate-200 md:block" />
              <p className="text-lg font-semibold text-slate-800">Quản lý tuyển dụng</p>
            </div>
          </div>
        </header>

        <div className="space-y-6 px-6 py-8">
          <EmployerSectionTabs />

          <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-[42px] font-extrabold tracking-tight text-slate-900">Danh sách công việc</h1>
              <p className="mt-2 text-lg text-slate-500">Quản lý và theo dõi hiệu quả các vị trí đang tuyển dụng.</p>
            </div>

            <Link
              to="/employer-post-job"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#2563EB] px-5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="material-symbols-outlined mr-2 text-[18px]">add_circle</span>
              Tạo job mới
            </Link>
          </section>

          {location.state?.createdJobId && (
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700 shadow-sm">
              Tin "{location.state.createdTitle}" đã được tạo thành công và đã xuất hiện trong danh sách job.
            </section>
          )}

          {location.state?.updatedJobId && (
            <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-700 shadow-sm">
              Job "{location.state.updatedTitle}" đã được cập nhật thành công trong danh sách.
            </section>
          )}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {statCards.map((card) => (
              <article key={card.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-8 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconTone}`}>
                    <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${card.deltaTone}`}>{card.delta}</span>
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{card.title}</p>
                <p className="mt-2 text-5xl font-extrabold tracking-tight text-slate-900">{card.value}</p>
              </article>
            ))}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(260px,1.4fr)_220px_280px_150px]">
              <label className="relative block">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => {
                    setKeyword(event.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Tìm kiếm tên công việc..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  {statusOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">expand_more</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="relative block">
                  <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(event) => {
                      setFromDate(event.target.value)
                      setCurrentPage(1)
                    }}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-3 text-[15px] outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => {
                    setToDate(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <Link
                to="/employer-post-job"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <span className="material-symbols-outlined mr-2 text-[18px]">post_add</span>
                Đăng tin
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr className="text-left">
                    <th className="border-b border-slate-200 px-8 py-5 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Tên công việc</th>
                    <th className="border-b border-slate-200 px-6 py-5 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Ngày đăng</th>
                    <th className="border-b border-slate-200 px-6 py-5 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Hạn chót</th>
                    <th className="border-b border-slate-200 px-6 py-5 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Ứng viên</th>
                    <th className="border-b border-slate-200 px-6 py-5 text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Trạng thái</th>
                    <th className="border-b border-slate-200 px-8 py-5 text-right text-sm font-bold uppercase tracking-[0.12em] text-slate-400">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-16 text-center">
                        <div className="mx-auto flex max-w-md flex-col items-center">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <span className="material-symbols-outlined text-[32px]">work_off</span>
                          </div>
                          <p className="text-xl font-bold text-slate-800">Không tìm thấy công việc phù hợp</p>
                          <p className="mt-2 text-sm text-slate-500">Hãy thử thay đổi từ khóa, trạng thái hoặc khoảng thời gian lọc.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentJobs.map((job) => {
                      const isNew = highlightId === job.id

                      return (
                        <tr key={job.id} className={`transition ${isNew ? 'bg-blue-50/80' : 'hover:bg-slate-50/70'}`}>
                          <td className="border-b border-slate-100 px-8 py-6 align-middle">
                            <div className="text-left">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="text-[18px] font-extrabold text-slate-900">{job.title}</p>
                                  <p className="mt-1 text-sm text-slate-400">
                                    {job.department} • {job.type} • {job.location}
                                  </p>
                                </div>
                                {isNew && <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">Mới đăng</span>}
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-slate-100 px-6 py-6 text-[15px] font-medium text-slate-700">{formatDate(job.postedAt)}</td>
                          <td className="border-b border-slate-100 px-6 py-6 text-[15px] font-medium text-slate-700">{formatDate(job.deadline)}</td>
                          <td className="border-b border-slate-100 px-6 py-6">
                            <div className="flex items-center">
                              <div className="flex">
                                {job.applicants.slice(0, 3).map((applicant, index) => (
                                  <div
                                    key={`${job.id}-${applicant.name}`}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm ${applicant.tone} ${index > 0 ? '-ml-3' : ''}`}
                                    title={applicant.name}
                                  >
                                    {applicant.initials}
                                  </div>
                                ))}
                              </div>
                              <div className="ml-3 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">+{job.extraApplicants}</div>
                            </div>
                          </td>
                          <td className="border-b border-slate-100 px-6 py-6">
                            <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${statusClass(job.status)}`}>{job.status}</span>
                          </td>
                          <td className="border-b border-slate-100 px-8 py-6">
                            <div className="flex items-center justify-end gap-2 text-slate-400">
                              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100 hover:text-blue-600">
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditJob(job)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100 hover:text-amber-600"
                              >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteJob(job)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-slate-100 hover:text-rose-600"
                              >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 px-8 py-5 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-400">
                Hiển thị {showingFrom} - {showingTo} trong {filteredJobs.length} công việc
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-10 min-w-10 rounded-lg border text-sm font-semibold transition ${
                      currentPage === pageNumber
                        ? 'border-[#2563EB] bg-[#2563EB] text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
