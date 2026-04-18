import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadHardcodedMock } from '../data/hardcodedClient.js'

export default function AuthPortal({ mode }) {
  const [content, setContent] = useState(null)
  const [trustStats, setTrustStats] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const mock = await loadHardcodedMock()
      setTrustStats(mock?.authPortal?.trustStats || [])
      setContent(mock?.authPortal?.modes?.[mode] || null)
    }
    loadData().catch(() => setContent(null))
  }, [mode])

  if (!content) return <div className="p-8 text-sm text-slate-500">Dang tai du lieu...</div>

  return (
    <div className="min-h-screen bg-[#eef5ff] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px]">
          <section className="bg-gradient-to-br from-[#e8f1ff] via-[#f2f7ff] to-[#ffffff] p-8 lg:p-10">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#2b59ff]">
              <span className="material-symbols-outlined">code</span>CHOCODE
            </Link>
            <h1 className="mt-6 text-[34px] font-black leading-tight text-slate-900">{content.heading}</h1>
            <p className="mt-3 max-w-xl text-[15px] text-slate-600">{content.description}</p>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {trustStats.map((item) => (
                <article key={item.label} className="rounded-2xl border border-blue-100 bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-2xl font-extrabold text-blue-700">{item.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="bg-white p-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{content.label}</p>
            <form className="space-y-3">
              <input className="auth-input" placeholder="Email" />
              {mode !== 'forgot' && <input className="auth-input" placeholder="Mat khau" />}
              <button className="h-12 w-full rounded-2xl bg-[#1f2937] text-sm font-bold text-white transition hover:bg-[#111827]">{content.submit}</button>
            </form>
            <p className="mt-4 text-sm text-slate-600">
              {content.helper} <Link to={content.helperTo} className="font-bold text-blue-700">{content.helperCta}</Link>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {content.secondary} <Link to={content.secondaryTo} className="font-bold text-blue-700">{content.secondaryCta}</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
