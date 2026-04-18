import { Link, useLocation } from 'react-router-dom'

export default function AdminLayout({ title, subtitle, children }) {
  const { pathname } = useLocation()
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/admin/dashboard', icon: 'dashboard' },
    { key: 'users', label: 'Users', to: '/admin/users', icon: 'group' },
    { key: 'companies', label: 'Companies', to: '/admin/companies', icon: 'apartment' },
    { key: 'jobs', label: 'Jobs', to: '/admin/jobs', icon: 'work' },
    { key: 'user-dashboard', label: 'Ve nguoi dung', to: '/dashboard', icon: 'person' },
    { key: 'employer-dashboard', label: 'Ve nha tuyen dung', to: '/employer-dashboard', icon: 'business_center' },
  ]

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-100 bg-white px-4 py-6">
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <span className="material-symbols-outlined text-white">shield</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-blue-600">ADMIN DASHBOARD</h2>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.to
            return (
              <Link
                key={item.key}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isActive ? 'bg-blue-500 font-bold text-white' : 'font-semibold text-slate-500 hover:bg-slate-50'
                }`}
                to={item.to}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="ml-64 min-h-screen p-5">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </header>
        {children}
      </main>
    </div>
  )
}
