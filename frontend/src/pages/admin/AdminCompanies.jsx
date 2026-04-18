import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout.jsx'
import Toast from '../../components/Toast.jsx'
import { getAdminCompanies, getAdminCompanyDetail, updateAdminCompanyStatus } from '../../api/adminService.js'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getAdminCompanies({ page: 1, limit: 20, keyword: keyword || undefined })
      .then((data) => setCompanies(data?.companies ?? []))
      .catch((error) => setToast({ type: 'error', message: error.message || 'Khong the tai companies.' }))
  }, [keyword])

  const handleOpenDetail = async (companyId) => {
    try {
      const detail = await getAdminCompanyDetail(companyId)
      setSelectedCompany(detail)
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the tai chi tiet company.' })
    }
  }

  const handleVerifyChange = async (companyId, nextVerified) => {
    try {
      await updateAdminCompanyStatus(companyId, nextVerified)
      setCompanies((current) => current.map((c) => (c._id === companyId ? { ...c, verified: nextVerified } : c)))
      setToast({ type: 'success', message: 'Da cap nhat verified company.' })
    } catch (error) {
      setToast({ type: 'error', message: error.message || 'Khong the cap nhat company.' })
    }
  }

  return (
    <AdminLayout title="Companies" subtitle="Quan ly company.">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <section className="mb-6">
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tim company..." className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4" />
      </section>
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.15fr)_420px]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {companies.map((company) => (
            <article key={company._id} className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="font-bold text-slate-900">{company.company_name}</p>
                <p className="mt-1 text-sm text-slate-500">{company.website || 'No website'}</p>
              </div>
              <button type="button" onClick={() => handleOpenDetail(company._id)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">Xem</button>
            </article>
          ))}
        </section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {selectedCompany ? (
            <>
              <h2 className="text-2xl font-extrabold text-slate-900">{selectedCompany.company_name}</h2>
              <p className="mt-2 text-sm text-slate-500">{selectedCompany.website || 'No website'}</p>
              <button type="button" onClick={() => handleVerifyChange(selectedCompany._id, !selectedCompany.verified)} className="mt-4 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
                {selectedCompany.verified ? 'Unverify' : 'Verify'}
              </button>
            </>
          ) : (
            <div className="text-sm text-slate-500">Chon mot company de xem chi tiet.</div>
          )}
        </aside>
      </div>
    </AdminLayout>
  )
}
