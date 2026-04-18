import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadFavoriteIds, loadHomeMeta, loadJobsForHome, searchPublicJobs, toggleFavoriteJob } from './data/apiClient.js'

const homeNav = ['Việc làm IT', 'Đăng bài viết', 'AI Agent']

export default function App() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

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
        if (active) {
          setJobs(result || [])
        }
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
    const handleClickOutside = (event) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredJobs = useMemo(() => {
    return jobs
  }, [jobs, search])

  const heroTitle = homeMeta?.hero?.title || 'CHOCODE.COM.VN'
  const heroSubtitle = homeMeta?.hero?.subtitle || 'Nen tang viec lam cong nghe chat luong cho developer Viet Nam.'

  useEffect(() => {
    localStorage.setItem('favorite_job_ids', JSON.stringify(Array.from(favoriteSet)))
  }, [favoriteSet])

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

  const handleLogout = () => {
    ;['token', 'accessToken', 'refreshToken', 'user', 'authUser', 'isLoggedIn'].forEach((key) => {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    })
    setUserMenuOpen(false)
    navigate('/login')
  }

  const navPath = (label) => {
    if (label === 'Đăng bài viết' || label === 'Thảo luận' || label === 'Đăng bài Admin') return '/discussions'
    return '#'
  }

  return (
    <div className="bg-white text-on-surface">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-2">
          <div className="flex items-center gap-5">
            <div className="flex items-center text-xl font-bold tracking-tight text-[#2b59ff]">
              <span className="material-symbols-outlined mr-1 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                code
              </span>
              CHOCODE
            </div>
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
          <div className="flex items-center gap-4">
            <div className="relative" ref={userMenuRef}>
              <button type="button" className="flex items-center gap-2" onClick={() => setUserMenuOpen((prev) => !prev)}>
                <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-200 ring-2 ring-transparent transition hover:ring-blue-100">
                  <img
                    alt="User"
                    className="h-full w-full object-cover"
                    src={homeMeta?.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop'}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{homeMeta?.user?.name || 'Tai khoan nguoi dung'}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                  <Link to="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    Nguoi dung
                  </Link>
                  <Link to="/employer-dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    Nha tuyen dung
                  </Link>
                  <Link to="/admin/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    Admin
                  </Link>
                  <Link to="/messages" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    Tin nhan
                  </Link>
                  <Link to="/notifications" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" onClick={() => setUserMenuOpen(false)}>
                    Thong bao
                  </Link>
                  <button type="button" className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50" onClick={handleLogout}>
                    Dang xuat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-6 py-4">
        <div
          className={`soft-radius mb-6 flex items-center justify-between border border-slate-100 bg-white p-2.5 shadow-sm transition-all duration-300 ${
            bannerOpen ? 'max-h-28 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-orange-500">Tin hot:</span>
            <span className="text-slate-600">{homeMeta?.hero?.announcement || 'Cap nhat viec lam moi moi ngay cho cong dong lap trinh vien.'}</span>
          </div>
          <button className="text-slate-400 hover:text-slate-600" onClick={() => setBannerOpen(false)}>
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <section className="mb-10 animate-fade-up">
          <div className="soft-radius relative flex h-[280px] items-center overflow-hidden bg-gradient-to-r from-[#20c3d0] via-[#2489d2] to-[#1e58b1] shadow-lg">
            <div className="z-10 w-full px-10 text-left text-white md:w-[72%] md:px-14">
              <h1 className="mb-2 text-[42px] font-black leading-tight tracking-tight md:text-[56px]">{heroTitle}</h1>
              <p className="text-xl font-medium opacity-95 md:text-2xl">{heroSubtitle}</p>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>
        </section>

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
                <input className="soft-radius w-full border border-slate-200 py-2.5 pl-11 pr-4 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Tim kiem cong viec, ky nang, cong ty..." type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job, index) => {
                const fav = favoriteSet.has(job.id)
                return (
                  <article key={job.id} className="soft-radius group card-enter border border-slate-100 bg-white p-5 shadow-sm" style={{ animationDelay: `${180 + index * 50}ms` }}>
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
                      <button className={`${fav ? 'text-red-400' : 'text-slate-300'} transition`} onClick={() => toggleFavorite(job.id)}>
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
              })}
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-3 animate-fade-up" style={{ animationDelay: '170ms' }}>
            <div className="soft-radius border border-slate-100 bg-white p-5 shadow-sm lg:sticky lg:top-20">
              <h2 className="mb-5 flex items-center gap-2 text-[15px] font-bold text-slate-800">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                Cong viec noi bat
              </h2>
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job, i) => (
                  <Link key={job.id} to={`/job-detail/${job.id}`} className="soft-radius flex cursor-pointer items-center gap-3 p-1.5 transition-all hover:bg-slate-50">
                    <span className="text-base font-bold text-primary">{i + 1}.</span>
                    <p className="text-[13.5px] font-bold text-slate-700">{job.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
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
