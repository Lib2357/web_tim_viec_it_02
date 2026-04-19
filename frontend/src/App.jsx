import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadFavoriteIds, loadHomeMeta, loadJobsForHome, searchPublicJobs, toggleFavoriteJob } from './data/apiClient.js'

const homeNav = ['Viec lam IT', 'Bai viet', 'AI Agent']

function JobCard({ job, favoriteSet, onToggleFavorite, animationDelay = '0ms' }) {
  const fav = favoriteSet.has(job.id)

  return (
    <article className="soft-radius group card-enter border border-slate-100 bg-white p-5 shadow-sm" style={{ animationDelay }}>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-50 bg-slate-100">
            <img alt="Employer" className="h-full w-full object-cover" src={job.avatar} />
          </div>
          <div>
            <h4 className="text-[14px] font-bold text-slate-800">{job.company}</h4>
            <p className="text-[11px] text-slate-400">{job.postedAt} • <span className="material-symbols-outlined !text-[11px]">location_on</span> {job.location}</p>
          </div>
        </div>
        <button className={`${fav ? 'text-red-400' : 'text-slate-300'} transition`} onClick={() => onToggleFavorite(job.id)}>
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </div>
      <Link to={`/job-detail/${job.id}`} className="mb-3 block text-[17px] font-bold text-slate-900 transition-colors group-hover:text-primary hover:text-primary">
        {job.title}
      </Link>
      <div className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-[#28a745]">
        <span className="material-symbols-outlined !text-[16px]">payments</span> {job.salary}
      </div>
      <p className="mb-3 text-[12px] leading-relaxed text-slate-600">
        <span className="font-semibold text-slate-700">Yeu cau:</span> {job.requirements}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(job.skills || []).map((skill) => (
            <span key={skill} className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-200">
              {skill}
            </span>
          ))}
        </div>
        <Link to={`/job-detail/${job.id}`} className="rounded-lg bg-[#007bff] px-3.5 py-2 text-[12px] font-bold text-white transition hover:bg-blue-700">
          Xem chi tiet
        </Link>
      </div>
    </article>
  )
}

export default function App() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [favoriteSet, setFavoriteSet] = useState(() => {
    try {
      const raw = localStorage.getItem('favorite_job_ids')
      const parsed = raw ? JSON.parse(raw) : []
      return new Set(Array.isArray(parsed) ? parsed : [])
    } catch {
      return new Set()
    }
  })
  const [bannerOpen, setBannerOpen] = useState(true)
  const [homeMeta, setHomeMeta] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const jobsData = await loadJobsForHome()
        setJobs(jobsData || [])
      } catch (error) {
        console.error('Failed to load jobs data', error)
      }

      try {
        const homeData = await loadHomeMeta()
        setHomeMeta(homeData)
      } catch (error) {
        console.error('Failed to load home metadata', error)
      }

      try {
        const ids = await loadFavoriteIds()
        setFavoriteSet(new Set(ids))
      } catch (error) {
        console.error('Failed to load favorite ids', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let active = true

    const runSearch = async () => {
      try {
        const result = await searchPublicJobs(search)
        if (active) setJobs(result || [])
      } catch (error) {
        console.error('Failed to search jobs', error)
      }
    }

    runSearch()

    return () => {
      active = false
    }
  }, [search])

  useEffect(() => {
    localStorage.setItem('favorite_job_ids', JSON.stringify(Array.from(favoriteSet)))
  }, [favoriteSet])

  const filteredJobs = useMemo(() => jobs, [jobs])
  const featuredJobs = useMemo(() => filteredJobs.slice(0, 2), [filteredJobs])
  const latestJobs = useMemo(() => {
    return [...filteredJobs]
      .sort((a, b) => {
        const aTime = a?.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const bTime = b?.publishedAt ? new Date(b.publishedAt).getTime() : 0
        return bTime - aTime
      })
      .slice(0, 6)
  }, [filteredJobs])

  const heroTitle = homeMeta?.hero?.title || 'CHOCODE.COM.VN'
  const heroSubtitle = homeMeta?.hero?.subtitle || 'Nen tang viec lam cong nghe chat luong cho developer Viet Nam.'

  const toggleFavorite = (key) => {
    setFavoriteSet((prev) => {
      const next = new Set(prev)
      const shouldFavorite = !next.has(key)
      if (shouldFavorite) next.add(key)
      else next.delete(key)
      void toggleFavoriteJob(key, shouldFavorite)
      return next
    })
  }

  const navPath = (label) => {
    if (label === 'Viec lam IT') return '/search-jobs'
    if (label === 'Bai viet' || label === 'Dang bai viet' || label === 'Thao luan' || label === 'Dang bai Admin') return '/discussions'
    if (label === 'AI Agent') return '/ai-agent'
    return '#'
  }

  const handleSearchNavigate = () => {
    const q = search.trim()
    navigate(q ? `/search-jobs?q=${encodeURIComponent(q)}` : '/search-jobs')
  }

  return (
    <div className="bg-white text-on-surface">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
              <span className="material-symbols-outlined mr-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                code
              </span>
              CHOCODE
            </Link>
            <div className="hidden items-center gap-4 text-[13.5px] font-medium text-slate-600 lg:flex">
              {homeNav.map((item) => (
                navPath(item) === '#' ? (
                  <a key={item} className="nav-link-animate flex items-center gap-1" href="#">
                    {item}
                  </a>
                ) : (
                  <Link key={item} className="nav-link-animate flex items-center gap-1" to={navPath(item)}>
                    {item}
                  </Link>
                )
              ))}
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
                <img
                  alt="User"
                  className="h-full w-full object-cover"
                  src={homeMeta?.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop'}
                />
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

      <main className="mx-auto max-w-[1440px] px-6 py-4">
        <div className={`soft-radius mb-6 flex items-center justify-between border border-slate-100 bg-white p-2.5 shadow-sm transition-all duration-300 ${bannerOpen ? 'max-h-28 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden opacity-0'}`}>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-orange-500">Tin hot:</span>
            <span className="text-slate-600">{homeMeta?.hero?.announcement || 'Cap nhat viec lam moi moi ngay cho cong dong lap trinh vien.'}</span>
          </div>
          <button className="text-slate-400 hover:text-slate-600" onClick={() => setBannerOpen(false)}>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <section className="mx-[calc(50%-50vw+5rem)] mb-10 animate-fade-up">
          <div className="soft-radius relative flex h-[280px] items-center overflow-hidden bg-gradient-to-r from-[#20c3d0] via-[#2489d2] to-[#1e58b1] shadow-lg">
            <div className="z-10 w-full px-10 text-left text-white md:w-[72%] md:px-14">
              <h1 className="mb-2 text-[42px] font-black leading-tight tracking-tight md:text-[56px]">{heroTitle}</h1>
              <p className="text-xl font-medium opacity-95 md:text-2xl">{heroSubtitle}</p>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </section>

        <div className="mx-auto max-w-[1360px]">
          <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-12">
            <aside className="space-y-4 lg:col-span-2 animate-fade-up" style={{ animationDelay: '70ms' }}>
              <div className="soft-radius border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border border-slate-100 bg-slate-100">
                    <img alt="User" className="h-full w-full object-cover" src={homeMeta?.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop'} />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{homeMeta?.user?.name || 'Tai khoan nguoi dung'}</p>
                  <p className="text-[11px] text-slate-400">{homeMeta?.user?.id || '@chocode-user'}</p>
                </div>
                <nav className="space-y-1">
                  {[
                    { label: 'Viec lam', to: '#' },
                    { label: 'Tim Developer', to: '#' },
                    { label: 'Viec da ung tuyen', to: '/jobs' },
                    { label: 'Viec yeu thich', to: '/favorites' },
                    { label: 'Quan ly viec', to: '/dashboard' },
                  ].map((item, i) =>
                    item.to === '#' ? (
                      <a key={item.label} className={`soft-radius flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors ${i === 0 ? 'bg-blue-50 font-semibold text-primary' : 'text-slate-600 hover:bg-slate-50'}`} href="#">
                        {item.label}
                      </a>
                    ) : (
                      <Link key={item.label} className={`soft-radius flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors ${i === 0 ? 'bg-blue-50 font-semibold text-primary' : 'text-slate-600 hover:bg-slate-50'}`} to={item.to}>
                        {item.label}
                      </Link>
                    ),
                  )}
                </nav>
              </div>

              <div className="soft-radius border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-[14px] font-bold text-slate-800">Danh muc pho bien</h3>
                <div className="space-y-3 text-[13px]">
                  {(homeMeta?.categories || []).slice(0, 5).map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="text-slate-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="space-y-5 lg:col-span-7 animate-fade-up" style={{ animationDelay: '120ms' }}>
              <div className="soft-radius border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                  Tim kiem viec lam
                </div>
                <div className="relative mb-4">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input
                    className="soft-radius w-full border border-slate-200 py-2.5 pl-11 pr-32 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Tim kiem cong viec, ky nang, cong ty..."
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchNavigate()
                    }}
                  />
                  <button type="button" onClick={handleSearchNavigate} className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-md bg-[#2b59ff] px-4 text-xs font-bold text-white transition hover:bg-[#1f4bf1]">
                    Tim kiem
                  </button>
                </div>
              </div>

              <section>
                <div className="soft-radius mb-5 overflow-hidden border border-[#cae5ff] bg-[linear-gradient(135deg,#eff8ff_0%,#f8fbff_45%,#ffffff_100%)] shadow-sm">
                  <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#2b59ff]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#2b59ff]">
                        <span className="material-symbols-outlined !text-[15px]">workspace_premium</span>
                        Goi y noi bat
                      </div>
                      <h2 className="text-[24px] font-black tracking-tight text-slate-900">Viec lam tot nhat</h2>
                      <p className="mt-1 text-[13px] text-slate-600">Nhung co hoi duoc uu tien hien thi nham phu hop hon voi muc tieu cua ban.</p>
                    </div>
                    <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#20c3d0] to-[#2b59ff] text-white shadow-md md:flex">
                      <span className="material-symbols-outlined !text-[26px]">bolt</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {featuredJobs.map((job, index) => (
                    <JobCard key={`featured-${job.id}`} job={job} favoriteSet={favoriteSet} onToggleFavorite={toggleFavorite} animationDelay={`${180 + index * 50}ms`} />
                  ))}
                </div>
              </section>

              <section>
                <div className="soft-radius mb-5 overflow-hidden border border-[#d7eef2] bg-[linear-gradient(135deg,#f2fbfd_0%,#f7fdff_48%,#ffffff_100%)] shadow-sm">
                  <div className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#20c3d0]/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#168fa5]">
                        <span className="material-symbols-outlined !text-[15px]">schedule</span>
                        Moi cap nhat
                      </div>
                      <h2 className="text-[24px] font-black tracking-tight text-slate-900">Viec lam moi nhat</h2>
                      <p className="mt-1 text-[13px] text-slate-600">Cap nhat lien tuc cac tin dang moi de ban theo doi va ung tuyen nhanh hon.</p>
                    </div>
                    <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#20c3d0] to-[#2489d2] text-white shadow-md md:flex">
                      <span className="material-symbols-outlined !text-[26px]">autorenew</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {latestJobs.map((job, index) => (
                    <JobCard key={`latest-${job.id}`} job={job} favoriteSet={favoriteSet} onToggleFavorite={toggleFavorite} animationDelay={`${320 + index * 50}ms`} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5 lg:col-span-3 animate-fade-up" style={{ animationDelay: '170ms' }}>
              <div className="soft-radius border border-slate-100 bg-white p-6 shadow-sm lg:sticky lg:top-20">
                <h2 className="mb-6 flex items-center gap-2 text-[16px] font-bold text-slate-800">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                  Cong viec noi bat
                </h2>
                <div className="space-y-2.5">
                  {jobs.slice(0, 5).map((job, i) => (
                    <Link key={job.id} to={`/job-detail/${job.id}`} className="soft-radius flex cursor-pointer items-start gap-3 px-2 py-1.5 transition-all hover:bg-slate-50">
                      <span className="pt-0.5 text-[17px] font-bold text-primary">{i + 1}.</span>
                      <p className="text-[13.5px] font-medium leading-6 text-slate-700">{job.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-10 text-slate-600">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
            <div className="col-span-2">
              <div className="mb-4 flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
                <span className="material-symbols-outlined mr-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>code</span>
                CHOCODE
              </div>
              <p className="mb-6 max-w-xs text-[13px] leading-relaxed text-slate-500">{homeMeta?.footer?.brandDescription || 'Nen tang ket noi nha tuyen dung va developer chat luong cao tai Viet Nam.'}</p>
            </div>
            {(homeMeta?.footer?.columns || []).map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-slate-900">{col.title}</h4>
                <ul className="space-y-2.5 text-[13px]">
                  {(col.links || []).map((link) => (
                    <li key={link}>
                      <a className="transition-colors hover:text-primary" href="#">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
