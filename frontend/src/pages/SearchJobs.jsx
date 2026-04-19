import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { loadHomeMeta, loadJobsForHome } from '../data/apiClient.js'

const homeNav = ['Viec lam IT', 'Bai viet', 'AI Agent']
const locationOptions = ['Tat ca dia diem', 'TP.HCM', 'Ha Noi', 'Da Nang']
const categories = ['Tat ca', 'Software Testing', 'Information Security', 'Frontend', 'Backend', 'Mobile']
const suggestedKeywords = ['tester tieng nhat', 'tester intern', 'manual tester', 'automation tester', 'fresher tester']

function matchesKeyword(job, keyword) {
  if (!keyword) return true
  const text = `${job.title} ${job.company} ${job.location} ${(job.skills || []).join(' ')}`.toLowerCase()
  return text.includes(keyword.toLowerCase())
}

export default function SearchJobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [homeMeta, setHomeMeta] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [location, setLocation] = useState(searchParams.get('location') || locationOptions[0])
  const [category, setCategory] = useState('Tat ca')

  useEffect(() => {
    const loadData = async () => {
      const [jobsData, homeData] = await Promise.all([loadJobsForHome(), loadHomeMeta()])
      setJobs(jobsData || [])
      setHomeMeta(homeData || null)
    }
    loadData().catch(() => {
      setJobs([])
      setHomeMeta(null)
    })
  }, [])

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const byKeyword = matchesKeyword(job, keyword.trim())
      const byLocation = location === locationOptions[0] || (job.location || '').toLowerCase().includes(location.toLowerCase())
      const byCategory = category === 'Tat ca' || (job.skills || []).some((skill) => skill.toLowerCase().includes(category.toLowerCase()))
      return byKeyword && byLocation && byCategory
    })
  }, [jobs, keyword, location, category])

  const submitSearch = () => {
    const next = {}
    if (keyword.trim()) next.q = keyword.trim()
    if (location && location !== locationOptions[0]) next.location = location
    setSearchParams(next)
  }

  return (
    <div className="min-h-screen bg-[#f2f5fa] text-on-surface">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-2">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
              <span className="material-symbols-outlined mr-1 text-2xl">code</span>
              CHOCODE
            </Link>
            <div className="hidden items-center gap-4 text-[13.5px] font-medium text-slate-600 lg:flex">
              {homeNav.map((item) => {
                if (item === 'Viec lam IT') return <Link key={item} className="nav-link-animate" to="/">{item}</Link>
                if (item === 'Bai viet') return <Link key={item} className="nav-link-animate" to="/discussions">{item}</Link>
                return <Link key={item} className="nav-link-animate" to="/ai-agent">{item}</Link>
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/notifications" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200">
              <span className="material-symbols-outlined">notifications</span>
            </Link>
            <Link to="/messages" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200">
              <span className="material-symbols-outlined">chat</span>
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="block h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-200 transition hover:ring-2 hover:ring-blue-100"
              >
                <img alt="User" className="h-full w-full object-cover" src={homeMeta?.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop'} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 z-[60] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)]">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-sm font-bold text-slate-800">{homeMeta?.user?.name || 'Tai khoan nguoi dung'}</p>
                    <p className="text-xs text-slate-400">{homeMeta?.user?.id || '@chocode-user'}</p>
                  </div>
                  <div className="pt-2">
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      Dashboard
                    </Link>
                    <Link to="/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                      Viec yeu thich
                    </Link>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Dang xuat
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="search-hero-enter bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#0ea5e9] py-5 shadow-sm">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-5 lg:flex-row lg:items-center">
          <div className="flex h-11 flex-1 items-center rounded-xl bg-white px-3">
            <span className="material-symbols-outlined text-slate-500">menu</span>
            <select className="ml-2 h-10 border-0 bg-transparent pr-2 text-[14px] font-semibold text-slate-700 outline-none">
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <span className="mx-2 h-6 w-px bg-slate-200" />
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input
              className="h-10 flex-1 border-0 px-2 text-[14px] outline-none"
              placeholder="Tim kiem cong viec..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitSearch()
              }}
            />
            <span className="mx-2 h-6 w-px bg-slate-200" />
            <span className="material-symbols-outlined text-slate-400">location_on</span>
            <select className="ml-1 h-10 border-0 bg-transparent text-[14px] font-semibold text-slate-700 outline-none" value={location} onChange={(e) => setLocation(e.target.value)}>
              {locationOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <button type="button" onClick={submitSearch} className="search-cta h-11 rounded-xl bg-[#2b59ff] px-8 text-[15px] font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-[#1f4bf1]">
            Tim kiem
          </button>
        </div>
      </section>

      <main className="search-page-enter mx-auto max-w-[1180px] px-5 py-4">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-extrabold leading-tight text-slate-900">Tuyen dung {filteredJobs.length} viec lam {keyword ? keyword : ''}</h1>
            <p className="mt-1 text-sm text-slate-500">
              <Link to="/" className="font-semibold text-blue-600">Trang chu</Link> {'>'} Viec lam {'>'} {keyword || 'Tat ca'}
            </p>
          </div>
          <button className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700">
            Tao thong bao viec lam
          </button>
        </header>

        <section className="search-page-enter mb-4 rounded-2xl border border-slate-200 bg-white p-3" style={{ animationDelay: '70ms' }}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-slate-500">Tu khoa goi y:</p>
            {suggestedKeywords.map((item, index) => (
              <button key={item} onClick={() => setKeyword(item)} className="search-chip-enter rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-blue-100 hover:text-blue-700" style={{ animationDelay: `${120 + index * 40}ms` }}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="search-page-enter rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" style={{ animationDelay: '100ms' }}>
            <p className="mb-3 text-[20px] font-extrabold leading-none text-slate-900">Loc nang cao</p>

            <div className="mb-3 border-b border-slate-100 pb-3">
              <p className="mb-2 text-[17px] font-bold text-slate-800">Nghi thu 7</p>
              <div className="grid grid-cols-1 gap-1.5 text-[13px] text-slate-700">
                <label className="flex items-center gap-2"><input type="radio" name="weekend" defaultChecked /> Khong loc</label>
                <label className="flex items-center gap-2"><input type="radio" name="weekend" /> Lam thu 7</label>
                <label className="flex items-center gap-2"><input type="radio" name="weekend" /> Nghi thu 7</label>
                <label className="flex items-center gap-2"><input type="radio" name="weekend" /> Khong de cap</label>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[17px] font-bold text-slate-800">Theo danh muc nghe</p>
              <div className="space-y-2">
                {categories.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-[13px] text-slate-700">
                    <input type="radio" name="category" checked={category === item} onChange={() => setCategory(item)} />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-2.5">
            <div className="search-page-enter flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-2" style={{ animationDelay: '130ms' }}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">Tim kiem theo:</span>
                <button className="rounded-full border border-blue-500 bg-blue-50 px-4 py-1 text-sm font-bold text-blue-700">Ten viec lam</button>
                <button className="rounded-full bg-slate-100 px-4 py-1 text-sm font-bold text-slate-600">Ten cong ty</button>
                <button className="rounded-full bg-slate-100 px-4 py-1 text-sm font-bold text-slate-600">Ca hai</button>
              </div>
              <button className="rounded-full bg-slate-100 px-4 py-1 text-sm font-bold text-slate-600">Sap xep: Moi nhat</button>
            </div>

            {filteredJobs.map((job, index) => (
              <article key={job.id} className="search-card-enter rounded-2xl border border-blue-200 bg-[#f8fbff] p-3 shadow-sm" style={{ animationDelay: `${170 + index * 60}ms` }}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="h-[84px] w-[84px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img src={job.avatar} alt={job.company} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link to={`/job-detail/${job.id}`} className="text-[17px] font-bold leading-tight text-slate-900 hover:text-blue-700">
                          {job.title}
                        </Link>
                        <p className="mt-1 text-[13px] font-semibold text-slate-500">{job.company}</p>
                      </div>
                      <p className="text-[17px] font-bold text-blue-700">{job.salary}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600">{job.location}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-600">{job.postedAt}</span>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-600">{job.requirements}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(job.skills || []).map((skill) => (
                        <span key={skill} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {!filteredJobs.length && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                Khong tim thay cong viec phu hop.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
