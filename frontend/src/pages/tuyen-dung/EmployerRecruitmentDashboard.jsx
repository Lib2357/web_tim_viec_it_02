import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../../components/DashboardSidebar.jsx'
import { createCompanyJob } from '../../api/companyService.js'
import { loadHardcodedMock } from '../../data/hardcodedClient.js'

export default function EmployerRecruitmentDashboard() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState([])
  const [options, setOptions] = useState({ departments: [], levels: [], experienceOptions: [], workModes: [], packageOptions: [] })
  const [form, setForm] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const mock = await loadHardcodedMock()
      const data = mock?.employerRecruitment || {}
      setSteps(data.steps || [])
      setOptions(data.options || { departments: [], levels: [], experienceOptions: [], workModes: [], packageOptions: [] })
      setForm(data.initialForm || null)
    }
    loadData().catch(() => setForm(null))
  }, [])

  const canNext = currentStep < steps.length
  const salaryLabel = useMemo(() => {
    if (!form) return ''
    if (form.negotiable) return 'Thoa thuan'
    return `${form.salaryMin || 0} - ${form.salaryMax || 0} USD`
  }, [form])

  const submit = async () => {
    if (!form) return
    setLoading(true)
    try {
      await createCompanyJob({
        title: form.title,
        description: form.description,
        requirements: form.requirements,
        benefits: form.benefits,
        salary: { min: Number(form.salaryMin || 0), max: Number(form.salaryMax || 0), currency: 'USD', is_negotiable: !!form.negotiable },
        location: form.location,
        job_type: form.workMode,
        level: form.level,
        status: 'draft',
        category: [form.department],
        skills: form.skills || [],
        quantity: Number(form.openings || 1),
        expired_at: new Date(form.deadline).toISOString()
      })
      navigate('/employer-job-list')
    } finally {
      setLoading(false)
    }
  }

  if (!form) return <div className="p-8 text-sm text-slate-500">Dang tai du lieu...</div>

  return (
    <div className="bg-[#f7f9fc] text-on-surface">
      <DashboardSidebar activeKey="post-job" />
      <main className="ml-64 min-h-screen p-5">
        <h1 className="mb-3 text-[30px] font-bold">Employer Recruitment</h1>
        <p className="mb-4 text-sm text-slate-500">Buoc {currentStep}/{steps.length || 1}: {steps.find((s) => s.id === currentStep)?.label || ''}</p>

        <section className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
          <input className="h-10 rounded-lg border border-slate-300 px-3" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tieu de cong viec" />
          <input className="h-10 rounded-lg border border-slate-300 px-3" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Dia diem" />
          <select className="h-10 rounded-lg border border-slate-300 px-3" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            {options.departments.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-slate-300 px-3" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            {options.levels.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-slate-300 px-3" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
            {options.experienceOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-slate-300 px-3" value={form.workMode} onChange={(e) => setForm({ ...form, workMode: e.target.value })}>
            {options.workModes.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-lg border border-slate-300 px-3" value={form.packageType} onChange={(e) => setForm({ ...form, packageType: e.target.value })}>
            {options.packageOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="h-10 rounded-lg border border-slate-300 px-3" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <textarea className="min-h-[110px] rounded-lg border border-slate-300 p-3 md:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="min-h-[110px] rounded-lg border border-slate-300 p-3 md:col-span-2" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          <textarea className="min-h-[110px] rounded-lg border border-slate-300 p-3 md:col-span-2" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />
        </section>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="font-semibold">Preview thong tin tu JSON mock</p>
          <p className="mt-2">Salary: {salaryLabel}</p>
          <p>Skills: {(form.skills || []).join(', ')}</p>
        </section>

        <div className="mt-4 flex gap-2">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm" disabled={currentStep <= 1} onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}>Back</button>
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm" disabled={!canNext} onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}>Next</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={loading} onClick={submit}>{loading ? 'Dang luu...' : 'Luu job'}</button>
        </div>
      </main>
    </div>
  )
}
