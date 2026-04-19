import { useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar.jsx'

export default function UploadCv() {
  const [form, setForm] = useState({
    title: '',
    targetRole: '',
    summary: '',
    skills: '',
    fileName: '',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (saved) setSaved(false)
  }

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="upload-cv" />
      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">upload_file</span>
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold leading-none tracking-tight text-slate-900">Dang CV</h1>
              <p className="mt-1 text-xs font-medium text-slate-500">Tai len va cap nhat thong tin CV de san sang ung tuyen.</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                setSaved(true)
              }}
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Ten CV</label>
                <input
                  value={form.title}
                  onChange={(event) => handleChange('title', event.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="VD: CV Frontend React Product"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Vi tri muc tieu</label>
                  <input
                    value={form.targetRole}
                    onChange={(event) => handleChange('targetRole', event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Frontend Developer"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Ten file CV</label>
                  <input
                    value={form.fileName}
                    onChange={(event) => handleChange('fileName', event.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="cv-frontend-react.pdf"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tom tat CV</label>
                <textarea
                  value={form.summary}
                  onChange={(event) => handleChange('summary', event.target.value)}
                  rows="6"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="Tom tat diem manh, kinh nghiem va dinh huong nghe nghiep cua ban."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Ky nang</label>
                <textarea
                  value={form.skills}
                  onChange={(event) => handleChange('skills', event.target.value)}
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="React, Vite, Tailwind CSS, UX Thinking"
                />
              </div>

              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <span className="material-symbols-outlined">upload</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">Khu vuc tai file CV</p>
                <p className="mt-1 text-xs text-slate-500">Chua noi backend. Hien tai la giao dien mock de bo sung vao dashboard.</p>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700">
                  Luu CV
                </button>
                {saved && <span className="text-sm font-semibold text-emerald-600">Da luu form mock.</span>}
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Huong dan nhanh</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Dat ten CV ro theo vi tri ung tuyen.</li>
                <li>Tom tat ngan gon, tap trung vao diem manh chinh.</li>
                <li>Bo sung ky nang dung voi job ban nham toi.</li>
                <li>Sau khi luu, ban co the xem lai trong muc `CV da tai len`.</li>
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
