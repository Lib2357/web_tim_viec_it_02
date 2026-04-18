import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import Toast from '../../components/Toast.jsx'
import { getAdminJobDetail, getAdminJobs, updateAdminJobModerationStatus } from '../../api/adminService.js'

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [blockedReason, setBlockedReason] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getAdminJobs({ page: 1, limit: 20, keyword: keyword || undefined })
      .then((data) => setJobs(data?.jobs ?? []))
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai jobs moderation.' }))
  }, [keyword])

  const handleOpenDetail = async (jobId) => {
    try {
      const detail = await getAdminJobDetail(jobId)
      setSelectedJob(detail)
      setBlockedReason(detail?.blocked_reason || '')
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the tai chi tiet job.' })
    }
  }

  const handleModeration = async (jobId, nextStatus) => {
    try {
      const payload = nextStatus === 'blocked' ? { moderation_status: nextStatus, blocked_reason: blockedReason } : { moderation_status: nextStatus }
      await updateAdminJobModerationStatus(jobId, payload)
      setToast({ type: 'success', message: 'Da cap nhat moderation status job.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the cap nhat moderation status.' })
    }
  }

  return (
    <AdminLayout title="Jobs Moderation" subtitle="Quan ly moderation_status cua jobs.">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="mb-6">
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tim title, company..." className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" />
      </section>
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {jobs.map((job) => (
            <article key={job._id} className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="font-bold text-slate-900">{job.title}</p>
                <p className="mt-1 text-sm text-slate-500">{job.company?.company_name || 'Unknown company'}</p>
              </div>
              <button type="button" onClick={() => handleOpenDetail(job._id)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">Xem</button>
            </article>
          ))}
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedJob ? (
            <>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedJob.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{selectedJob.company?.company_name}</p>
              <textarea value={blockedReason} onChange={(event) => setBlockedReason(event.target.value)} rows="4" className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px]" />
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => handleModeration(selectedJob._id, 'active')} className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white">Unblock</button>
                <button type="button" onClick={() => handleModeration(selectedJob._id, 'blocked')} className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-rose-600 text-sm font-bold text-white">Block</button>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-500">Chon mot job de xem chi tiet moderation.</div>
          )}
        </aside>
      </div>
    </AdminLayout>
  )
}
