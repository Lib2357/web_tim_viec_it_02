import { Link, useLocation, useNavigate } from 'react-router-dom'

const authContent = {
  login: {
    label: 'Dang nhap',
    heading: 'Trang dang nhap',
    description:
      'Dang nhap de quan ly viec da ung tuyen, luu job yeu thich va theo doi tin nhan voi nha tuyen dung.',
    submit: 'Dang nhap',
    helper: 'Chua co tai khoan?',
    helperCta: 'Dang ky ngay',
    helperTo: '/register',
    secondary: 'Quen mat khau?',
    secondaryCta: 'Khoi phuc tai khoan',
    secondaryTo: '/forgot-password',
  },
  register: {
    label: 'Sign up',
    heading: 'Trang dang ky tai khoan',
    description:
      'Tao tai khoan de xay dung profile chuyen nghiep, nhan de xuat job phu hop va san sang cho nhung du an moi.',
    submit: 'Tao tai khoan',
    helper: 'Da co tai khoan?',
    helperCta: 'Dang nhap',
    helperTo: '/login',
    secondary: 'Can khoi phuc email?',
    secondaryCta: 'Quen mat khau',
    secondaryTo: '/forgot-password',
  },
  forgot: {
    label: 'Reset',
    heading: 'Khoi phuc mat khau',
    description:
      'Nhap email de nhan lien ket dat lai mat khau. Chung toi gui huong dan ngan gon va an toan toi hop thu cua ban.',
    submit: 'Gui lien ket',
    helper: 'Da nho mat khau?',
    helperCta: 'Quay lai dang nhap',
    helperTo: '/login',
    secondary: 'Chua co tai khoan?',
    secondaryCta: 'Tao tai khoan',
    secondaryTo: '/register',
  },
  reset: {
    label: 'New password',
    heading: 'Dat lai mat khau',
    description:
      'Nhap mat khau moi de hoan tat qua trinh khoi phuc. Hay chon mat khau du manh va de quan ly.',
    submit: 'Cap nhat mat khau',
    helper: 'Da doi mat khau?',
    helperCta: 'Quay lai dang nhap',
    helperTo: '/login',
    secondary: 'Can gui lai email khoi phuc?',
    secondaryCta: 'Quay lai buoc truoc',
    secondaryTo: '/forgot-password',
  },
}

const trustStats = [
  { value: '32k+', label: 'Ung vien cong nghe' },
  { value: '1.2k+', label: 'Job moi moi tuan' },
]

function AuthPortal({ mode }) {
  const content = authContent[mode]
  const location = useLocation()
  const navigate = useNavigate()
  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isForgot) {
      navigate('/reset-password')
      return
    }
    if (isReset) {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eef8ff_0%,#f7fbff_40%,#eef5ff_100%)] text-slate-900">
      <div className="relative mx-auto min-h-screen max-w-[1440px] px-5 py-6 md:px-8">
        <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[420px] w-[420px] rotate-[18deg] rounded-[48px] border border-sky-300/40 bg-sky-400/18" />
        <div className="pointer-events-none absolute right-[8%] top-[6%] h-[540px] w-[420px] rotate-[22deg] rounded-[56px] bg-[linear-gradient(180deg,rgba(14,165,233,0.95),rgba(37,99,235,0.92))]" />
        <div className="pointer-events-none absolute right-[16%] top-[14%] h-[520px] w-[360px] rotate-[22deg] rounded-[48px] border border-white/30 bg-sky-200/12" />
        <div className="pointer-events-none absolute right-[5%] top-[18%] h-[420px] w-[280px] rotate-[22deg] rounded-[40px] border border-white/25 bg-white/8" />

        <header className="relative z-10 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-[#2b59ff]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              code
            </span>
            CHOCODE
          </Link>
        </header>

        <main className="relative z-10 grid min-h-[calc(100vh-72px)] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="mx-auto w-full max-w-[560px] lg:ml-[10%] lg:mr-0">
            <div className="mb-5 flex items-center gap-3 text-[30px] font-black tracking-tight text-[#2b59ff] md:text-[38px]">
              <span className="material-symbols-outlined !text-[38px] md:!text-[46px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                code
              </span>
              CHOCODE
            </div>
            <h1 className="max-w-[460px] text-[40px] font-black leading-[1.05] tracking-tight text-slate-950 md:text-[56px]">
              {content.heading}
            </h1>
            <p className="mt-4 text-lg font-medium text-sky-700">Tu A-Z</p>
            <p className="mt-8 max-w-[440px] text-[15px] leading-7 text-slate-600">{content.description}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              {trustStats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-[22px] border border-white/80 bg-white/80 px-4 py-3 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.55)] backdrop-blur"
                >
                  <p className="text-xl font-black text-slate-950">{item.value}</p>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 text-xs leading-6 text-slate-500">
              <p>Website: chocode.vn</p>
              <p>Lien he: support@chocode.vn</p>
              <p>Facebook: facebook.com/chocode.vn</p>
            </div>
          </section>

          <section className="relative mx-auto w-full max-w-[388px] lg:mx-0 lg:justify-self-end lg:-translate-x-12">
            <div className="rounded-[22px] border border-white/90 bg-white/96 p-5 shadow-[0_35px_70px_-35px_rgba(15,23,42,0.55)] backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">{content.label}</span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-sky-800 shadow-sm">
                  {location.pathname.replace('/', '') || 'home'}
                </span>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {isRegister && <input className="auth-input auth-input-compact" type="text" placeholder="Ho ten" />}

                <input className="auth-input auth-input-compact" type="email" placeholder="Email" />

                {!isForgot && !isReset && <input className="auth-input auth-input-compact" type="password" placeholder="Mat khau" />}

                {isReset && (
                  <>
                    <input className="auth-input auth-input-compact" type="password" placeholder="Mat khau moi" />
                    <input className="auth-input auth-input-compact" type="password" placeholder="Xac nhan mat khau moi" />
                  </>
                )}

                {isRegister && (
                  <>
                    <input className="auth-input auth-input-compact" type="text" placeholder="Ky nang chinh" />
                    <input className="auth-input auth-input-compact" type="text" placeholder="Vai tro mong muon" />
                  </>
                )}

                {isForgot && (
                  <div className="rounded-2xl border border-sky-100 bg-white px-3 py-2 text-xs font-semibold leading-5 text-sky-900 shadow-sm">
                    Chung toi se gui mot lien ket dat lai mat khau den email ban vua nhap.
                  </div>
                )}

                {!isForgot && !isReset && (
                  <div className="flex items-center justify-between gap-3 pt-1 text-[12px] text-slate-700">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-sky-600" />
                      <span className="font-semibold">{isRegister ? 'Dong y dieu khoan' : 'Ghi nho dang nhap'}</span>
                    </label>
                    {!isRegister && (
                      <Link to="/forgot-password" className="font-bold text-sky-800 transition hover:text-sky-900">
                        Quen mat khau?
                      </Link>
                    )}
                  </div>
                )}

                {isReset && (
                  <div className="rounded-2xl border border-sky-100 bg-white px-3 py-2 text-xs font-semibold leading-5 text-sky-900 shadow-sm">
                    Mat khau moi nen co it nhat 8 ky tu, bao gom chu hoa, chu thuong va so.
                  </div>
                )}

                <button type="submit" className="w-full rounded-full bg-[#30353b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f2937]">
                  {content.submit}
                </button>
              </form>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-[13px] text-slate-700 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.4)]">
                <p>
                  {content.helper}{' '}
                  <Link to={content.helperTo} className="font-black text-slate-950 transition hover:text-sky-800">
                    {content.helperCta}
                  </Link>
                </p>
                <p className="mt-2">
                  {content.secondary}{' '}
                  <Link to={content.secondaryTo} className="font-black text-sky-800 transition hover:text-sky-900">
                    {content.secondaryCta}
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AuthPortal
