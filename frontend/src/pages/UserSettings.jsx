import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { getMyProfile, getUserSetting, requestChangePasswordOtp, resendVerificationMail, setNewPasswordWithOtp, updateUserSetting } from '../api/userService.js'

export default function UserSettings() {
  const [profile, setProfile] = useState(null)
  const [setting, setSetting] = useState(null)
  const [phone, setPhone] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmNewPassword: '',
    OtpCode: '',
  })
  const [loading, setLoading] = useState(true)
  const [savingPhone, setSavingPhone] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    Promise.all([getMyProfile(), getUserSetting()])
      .then(([profileData, settingData]) => {
        setProfile(profileData)
        setSetting(settingData)
        setPhone(settingData.phone || '')
      })
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai cai dat user.' }))
      .finally(() => setLoading(false))
  }, [])

  const handlePhoneSubmit = async (event) => {
    event.preventDefault()
    setSavingPhone(true)
    try {
      const updated = await updateUserSetting({ phone })
      setSetting(updated)
      setToast({ type: 'success', message: 'Da cap nhat setting user.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the cap nhat setting.' })
    } finally {
      setSavingPhone(false)
    }
  }

  const handleResendMail = async () => {
    try {
      const result = await resendVerificationMail()
      setToast({ type: 'success', message: result.message || 'Da gui lai email xac minh.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the gui lai email xac minh.' })
    }
  }

  const handleSendOtp = async () => {
    try {
      const result = await requestChangePasswordOtp()
      setToast({ type: 'success', message: `Da gui OTP doi mat khau. OTP mock: ${result.otpCode}` })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the gui OTP doi mat khau.' })
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setSavingPassword(true)
    try {
      const result = await setNewPasswordWithOtp(passwordForm)
      setPasswordForm({ newPassword: '', confirmNewPassword: '', OtpCode: '' })
      setToast({ type: 'success', message: result.message || 'Da dat mat khau moi.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the dat mat khau moi.' })
    } finally {
      setSavingPassword(false)
    }
  }

  const handlePasswordField = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="bg-[#f6f8fb] text-on-surface">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <main className="min-h-screen px-6 py-8 xl:px-10 2xl:px-14">
        <header className="mb-6 flex items-center gap-2">
          <Link to="/" className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100">
            <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-[31px] font-semibold text-slate-900">Cai dat</h1>
            <p className="mt-1 text-sm text-slate-500">Quan ly thong tin lien he, email xac minh va doi mat khau bang OTP.</p>
          </div>
        </header>

        {loading ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-500">Dang tai cai dat user...</section>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_360px]">
            <section className="space-y-5">
              <form className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handlePhoneSubmit}>
                <h2 className="text-lg font-bold text-slate-900">Thong tin setting</h2>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" placeholder="+84 ..." />
                </div>
                <button type="submit" disabled={savingPhone} className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white disabled:opacity-60">
                  {savingPhone ? 'Dang luu...' : 'Cap nhat setting'}
                </button>
              </form>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Email xac minh</h2>
                <p className="mt-3 text-sm text-slate-600">Email hien tai: <span className="font-semibold text-slate-900">{profile?.email || '--'}</span></p>
                <p className="mt-1 text-sm text-slate-600">Trang thai: <span className={`font-semibold ${profile?.email_verified ? 'text-emerald-600' : 'text-amber-600'}`}>{profile?.email_verified ? 'Da xac minh' : 'Chua xac minh'}</span></p>
                <button type="button" onClick={handleResendMail} className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700">
                  Gui lai email xac minh
                </button>
              </section>

              <form className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handlePasswordChange}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Doi mat khau bang OTP</h2>
                  <button type="button" onClick={handleSendOtp} className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white">
                    Gui OTP
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">Nhan nut Gui OTP de lay ma xac thuc demo, sau do nhap mat khau moi va OTP de cap nhat.</p>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">New Password</label>
                    <input type="password" value={passwordForm.newPassword} onChange={(event) => handlePasswordField('newPassword', event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm New Password</label>
                    <input type="password" value={passwordForm.confirmNewPassword} onChange={(event) => handlePasswordField('confirmNewPassword', event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">OTP Code</label>
                  <input value={passwordForm.OtpCode} onChange={(event) => handlePasswordField('OtpCode', event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" placeholder="Nhap OTP" />
                </div>
                <button type="submit" disabled={savingPassword} className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white disabled:opacity-60">
                  {savingPassword ? 'Dang cap nhat...' : 'Dat mat khau moi'}
                </button>
              </form>
            </section>

            <aside className="space-y-5">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Thong tin hien tai</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-900">Email:</span> {profile?.email || '--'}</p>
                  <p><span className="font-semibold text-slate-900">Phone:</span> {setting?.phone || '--'}</p>
                  <p><span className="font-semibold text-slate-900">Username:</span> {profile?.username || '--'}</p>
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
