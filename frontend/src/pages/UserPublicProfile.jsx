import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { getMyProfile, getPublicProfile } from '../api/userService.js'

export default function UserPublicProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const loadProfile = id ? getPublicProfile(id) : getMyProfile()

    loadProfile
      .then((data) => setProfile(data))
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai public profile.' }))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="bg-[#f6f8fb] text-on-surface">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <main className="min-h-screen px-4 py-8 md:px-6 xl:px-8 2xl:px-10">
        <header className="mb-6 flex items-center gap-2">
          <Link to="/" className="rounded-md p-1.5 text-slate-600 transition hover:bg-slate-100">
            <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-[31px] font-semibold text-slate-900">Public Profile</h1>
            <p className="mt-1 text-sm text-slate-500">Thong tin cong khai cua nguoi dung tren he thong.</p>
          </div>
        </header>

        {loading ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">Dang tai public profile...</section>
        ) : profile ? (
          <div className="space-y-5">
            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
              <div className="h-44 bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#38bdf8]" />
              <div className="px-8 pb-8">
                <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="h-32 w-32 overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-lg">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.fullName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-blue-100 text-4xl font-extrabold text-blue-700">
                          {String(profile.fullName || profile.username || 'U').slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{profile.fullName}</h2>
                      <p className="mt-1 text-base font-semibold text-blue-700">{profile.headline || 'Thanh vien cong dong CHOCODE'}</p>
                      <p className="mt-2 text-sm text-slate-500">@{profile.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/user/profile/edit" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-slate-800">
                      Cap nhat profile
                    </Link>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">Public profile</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">{profile.address || 'Dang cap nhat dia chi'}</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Email</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{profile.email || '--'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Phone</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{profile.phone || '--'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Ngay sinh</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{profile.birthDate || '--'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Trang thai</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{profile.email_verified ? 'Da xac minh email' : 'Chua xac minh email'}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.2fr)_360px]">
              <section className="space-y-5">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900">Gioi thieu</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{profile.bio || 'Thanh vien nay chua cap nhat thong tin gioi thieu.'}</p>
                  <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Muc tieu nghe nghiep</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{profile.goals || 'Chua co muc tieu nghe nghiep.'}</p>
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900">Kinh nghiem lam viec</h3>
                  <div className="mt-5 space-y-4">
                    {(profile.experience || []).map((item) => (
                      <div key={`${item.company}-${item.startYear}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{item.role}</h4>
                            <p className="text-sm font-semibold text-blue-700">{item.company}</p>
                          </div>
                          <span className="text-sm font-semibold text-slate-500">{item.startYear} - {item.endYear}</span>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                          {(item.details || []).map((detail) => (
                            <li key={detail} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900">Hoc van</h3>
                  <div className="mt-5 space-y-4">
                    {(profile.education || []).map((item) => (
                      <div key={`${item.school}-${item.startYear}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">{item.school}</h4>
                            <p className="text-sm font-semibold text-slate-600">{item.degree}</p>
                          </div>
                          <span className="text-sm font-semibold text-slate-500">{item.startYear} - {item.endYear}</span>
                        </div>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                          {(item.details || []).map((detail) => (
                            <li key={detail} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              </section>

              <aside className="space-y-5">
                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900">Ky nang</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(profile.skills || []).map((skill) => (
                      <span key={skill} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                        {skill}
                      </span>
                    ))}
                    {!profile.skills?.length ? <span className="text-sm text-slate-500">Chua co skill cong khai.</span> : null}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-extrabold text-slate-900">So thich</h3>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {(profile.hobbies || []).map((hobby) => (
                      <li key={hobby} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="font-medium">{hobby}</span>
                      </li>
                    ))}
                    {!profile.hobbies?.length ? <li className="text-sm text-slate-500">Chua co so thich cong khai.</li> : null}
                  </ul>
                </article>
              </aside>
            </div>
          </div>
        ) : (
          <section className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">Khong tim thay public profile.</section>
        )}
      </main>
    </div>
  )
}
