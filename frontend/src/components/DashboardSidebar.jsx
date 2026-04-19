import { Link, useLocation } from 'react-router-dom'

const candidateSections = [
  {
    items: [
      { key: 'home', icon: 'home', label: 'Trang chu', to: '/' },
      { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/dashboard' },
      { key: 'switch-role', icon: 'shield', label: 'Sang nha tuyen dung', to: '/employer-dashboard' },
    ],
  },
  {
    title: 'Quan ly Job',
    items: [
      { key: 'job-list', icon: 'work', label: 'Danh sach Job', to: '/job-list' },
      { key: 'uploaded-cvs', icon: 'description', label: 'CV da tai len', to: '/uploaded-cvs' },
      { key: 'job-progress', icon: 'bar_chart', label: 'Tien do cong viec', to: '/job-progress' },
      { key: 'applied-jobs', icon: 'assignment_turned_in', label: 'Viec da ung tuyen', to: '/jobs' },
      { key: 'contracts', icon: 'description', label: 'Hop dong', to: '/contracts' },
    ],
  },
  {
    title: 'Dich vu & Milestone',
    items: [{ key: 'milestone', icon: 'target', label: 'Quan ly Milestone', to: '/milestones' }],
  },
  {
    title: 'Giao tiep',
    items: [
      { key: 'messages', icon: 'chat_bubble_outline', label: 'Tin nhan', to: '/messages', badge: '3', badgeTone: 'rose' },
      { key: 'notifications', icon: 'notifications_none', label: 'Thong bao', to: '/notifications', badge: '5', badgeTone: 'sky' },
    ],
  },
]

const employerSections = [
  {
    items: [
      { key: 'home', icon: 'home', label: 'Trang chu', to: '/' },
      { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/employer-dashboard' },
      { key: 'switch-role', icon: 'shield', label: 'Sang nguoi dung', to: '/dashboard' },
    ],
  },
  {
    title: 'Quan ly tuyen dung',
    items: [
      { key: 'job-list', icon: 'checklist', label: 'Danh sach Job', to: '/employer-job-list' },
      { key: 'post-job', icon: 'add', label: 'Dang tin moi', to: '/employer-post-job' },
    ],
  },
  {
    title: 'Quan ly ung vien',
    items: [
      { key: 'received-cv', icon: 'description', label: 'Ho so da nhan', to: '/employer-received-cv' },
      { key: 'interviews', icon: 'calendar_month', label: 'Lich phong van', to: '/employer-interviews' },
    ],
  },
  {
    title: 'Dich vu & Milestone',
    items: [{ key: 'milestone', icon: 'target', label: 'Quan ly Milestone', to: '/employer-milestones' }],
  },
  {
    title: 'Giao tiep',
    items: [
      { key: 'messages', icon: 'chat_bubble_outline', label: 'Tin nhan', to: '/employer-messages', badge: '3', badgeTone: 'rose' },
      { key: 'notifications', icon: 'notifications_none', label: 'Thong bao', to: '/employer-notifications', badge: '5', badgeTone: 'sky' },
    ],
  },
]

function toneClass(tone) {
  if (tone === 'rose') return 'bg-rose-100 text-rose-500'
  if (tone === 'sky') return 'bg-sky-100 text-sky-500'
  return 'bg-slate-100 text-slate-500'
}

export default function DashboardSidebar({ activeKey }) {
  const { pathname } = useLocation()
  const isEmployerDashboard =
    pathname.startsWith('/employer-dashboard') ||
    pathname.startsWith('/employer-job-list') ||
    pathname.startsWith('/employer-post-job') ||
    pathname.startsWith('/employer-received-cv') ||
    pathname.startsWith('/employer-interviews') ||
    pathname.startsWith('/employer-messages') ||
    pathname.startsWith('/employer-notifications') ||
    pathname.startsWith('/employer-milestones')
  const sections = isEmployerDashboard ? employerSections : candidateSections

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-100 bg-white px-4 py-6">
      <div className="mb-7 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <span className="material-symbols-outlined text-white">cycle</span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-blue-600">CHOCODE DASHBOARD</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
        {sections.map((section) => (
          <div key={section.title || 'main'}>
            {section.title && <p className="px-3 pb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">{section.title}</p>}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = activeKey === item.key
                const rowClass = isActive
                  ? item.key === 'milestone'
                    ? 'bg-emerald-50 font-bold text-emerald-600'
                    : 'bg-blue-500 font-bold text-white'
                  : item.key === 'switch-role'
                    ? 'bg-emerald-50 font-bold text-emerald-500'
                    : 'font-semibold text-slate-500 hover:bg-slate-50'

                return (
                  <Link key={item.key} to={item.to} className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${rowClass}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${toneClass(item.badgeTone)}`}>{item.badge}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {isEmployerDashboard && (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
              NA
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Nguyen Van A</p>
              <p className="text-xs font-medium text-slate-500">HR Manager</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
