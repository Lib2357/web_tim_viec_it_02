import { useEffect } from 'react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined

    const timeoutId = setTimeout(() => {
      onClose()
    }, 3600)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [toast, onClose])

  if (!toast) {
    return null
  }

  return (
    <div className="fixed right-6 top-6 z-50 w-full max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-2xl ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{toast.type === 'success' ? 'Thành công' : 'Lỗi'}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 break-words">{toast.message}</p>
        </div>
        <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:text-slate-700">
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  )
}
