import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import { getCompanyApplicationDetail } from '../../api/companyService.js'
import Toast from '../../components/Toast.jsx'

function Badge({ children, tone }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${tone}`}>{children}</span>
}

export default function EmployerCandidateDetail() {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!applicationId) return
    setLoading(true)
    getCompanyApplicationDetail(applicationId)
      .then((data) => {
        setDetail(data)
      })
      .catch((error) => {
        setToast({ type: 'error', message: error.message })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [applicationId])

  const statusTone = {
    submitted: 'bg-slate-100 text-slate-800',
    reviewing: 'bg-blue-50 text-blue-700',
    shortlisted: 'bg-emerald-50 text-emerald-700',
    interviewing: 'bg-indigo-50 text-indigo-700',
    rejected: 'bg-rose-50 text-rose-700',
    hired: 'bg-emerald-100 text-emerald-700',
    withdrawn: 'bg-slate-100 text-slate-700',
  }

  return (
    <div className="dashboard-copy-font min-h-screen bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.4),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#f6f8fc_100%)] text-slate-900">
      <DashboardSidebar activeKey="received-cv" />
      <main className="ml-64 min-h-screen px-8 py-8">
        <Toast toast={toast} onClose={() => setToast(null)} />
        <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2563EB]">Chi tiết ứng viên</p>
            <h1 className="mt-2 text-[38px] font-extrabold tracking-tight text-slate-900">Hồ sơ ứng viên</h1>
            <p className="mt-2 text-sm text-slate-500">Xem chi tiết hồ sơ, trạng thái ứng tuyển và thông tin liên hệ theo dữ liệu API.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <span className="material-symbols-outlined mr-2">arrow_back</span>
              Quay lại
            </button>
            <Link
              to="/employer-received-cv"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              Danh sách ứng viên
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">Đang tải dữ liệu ứng viên...</div>
          ) : !detail ? (
            <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-10 text-center text-rose-700 shadow-sm">
              Không tìm thấy hồ sơ ứng viên. Vui lòng kiểm tra lại liên kết hoặc quay lại danh sách.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_340px]">
              <section className="space-y-6">
                <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-[28px] font-extrabold text-slate-900">{detail.resume_snapshot?.full_name || 'Ứng viên chưa đặt tên'}</h2>
                      <p className="mt-2 text-sm text-slate-500">Trạng thái ứng tuyển</p>
                    </div>
                    <Badge tone={statusTone[detail.status] ?? 'bg-slate-100 text-slate-700'}>{detail.status}</Badge>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">{detail.resume_snapshot?.email || 'Không có dữ liệu'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Điện thoại</p>
                      <p className="mt-3 text-lg font-semibold text-slate-900">{detail.resume_snapshot?.phone || 'Không có dữ liệu'}</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Giới thiệu bản thân</p>
                      <p className="mt-4 text-[17px] leading-8 text-slate-600">
                        {detail.resume_snapshot?.summary || 'Ứng viên chưa cập nhật phần giới thiệu. Dữ liệu API đang tải về hồ sơ cơ bản.'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Kỹ năng</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Array.isArray(detail.resume_snapshot?.skills) && detail.resume_snapshot.skills.length > 0 ? (
                          detail.resume_snapshot.skills.map((skill) => (
                            <span key={skill} className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-[#2563EB]">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <div className="text-sm text-slate-500">Không có dữ liệu kỹ năng từ API.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>

                <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900">Thông tin hồ sơ</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Ngày nộp</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{detail.applied_at ? new Date(detail.applied_at).toLocaleString('vi-VN') : 'Không có dữ liệu'}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Cập nhật gần nhất</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{detail.updated_at ? new Date(detail.updated_at).toLocaleString('vi-VN') : 'Không có dữ liệu'}</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Link CV / hồ sơ</p>
                    <p className="mt-2 break-all">{detail.resume_snapshot?.cv_url || 'Chưa có dữ liệu CV'}</p>
                  </div>
                </article>
              </section>

              <aside className="space-y-6">
                <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-slate-900">Hoạt động gần đây</h3>
                    <Badge tone="bg-slate-100 text-slate-700">Ứng viên API</Badge>
                  </div>
                  <div className="mt-6 space-y-4 text-sm text-slate-600">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">CV snapshot</p>
                      <p className="mt-2">Dữ liệu bao gồm tên, email, điện thoại và kỹ năng ứng viên.</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Trạng thái tuyển dụng</p>
                      <p className="mt-2">{detail.status || 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Nút hành động</p>
                      <p className="mt-2">Bạn có thể cập nhật trạng thái ứng tuyển từ admin hoặc company endpoint tương ứng.</p>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
