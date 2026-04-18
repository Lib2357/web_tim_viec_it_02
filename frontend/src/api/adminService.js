const ADMIN_MOCK_URL = '/api/admin.json'
const ADMIN_STORAGE_KEY = 'admin-mock-overrides-v1'

let adminMockCache = null

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

async function loadAdminMock() {
  if (adminMockCache) return clone(adminMockCache)
  const res = await fetch(ADMIN_MOCK_URL)
  if (!res.ok) {
    throw new Error(`Khong the tai du lieu admin mock: ${res.status}`)
  }
  adminMockCache = await res.json()
  return clone(adminMockCache)
}

function getOverrides() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function setOverrides(next) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(next))
}

function applyOverrides(data) {
  const overrides = getOverrides()

  const users = (data.users || []).map((user) => {
    const patch = overrides.users?.[user._id]
    return patch ? { ...user, ...patch } : user
  })

  const companies = (data.companies || []).map((company) => {
    const patch = overrides.companies?.[company._id]
    return patch ? { ...company, ...patch } : company
  })

  const jobs = (data.jobs || []).map((job) => {
    const patch = overrides.jobs?.[job._id]
    return patch ? { ...job, ...patch } : job
  })

  return { ...data, users, companies, jobs }
}

async function getAdminData() {
  const base = await loadAdminMock()
  return applyOverrides(base)
}

function filterByKeyword(list, fields, keyword) {
  const kw = normalizeText(keyword)
  if (!kw) return list

  return list.filter((item) => fields.some((field) => normalizeText(item[field]).includes(kw)))
}

function withCompany(job, companiesMap) {
  return {
    ...job,
    company: companiesMap.get(job.company_id) || null,
  }
}

function paginate(items, page = 1, limit = 20) {
  const currentPage = Number(page) > 0 ? Number(page) : 1
  const perPage = Number(limit) > 0 ? Number(limit) : 20
  const start = (currentPage - 1) * perPage
  const rows = items.slice(start, start + perPage)

  return {
    items: rows,
    pagination: {
      page: currentPage,
      limit: perPage,
      total: items.length,
      total_pages: Math.max(1, Math.ceil(items.length / perPage)),
    },
  }
}

function saveEntityPatch(group, id, patch) {
  const overrides = getOverrides()
  const currentGroup = overrides[group] || {}
  const currentItem = currentGroup[id] || {}
  const next = {
    ...overrides,
    [group]: {
      ...currentGroup,
      [id]: {
        ...currentItem,
        ...patch,
      },
    },
  }
  setOverrides(next)
}

export async function adminLogin(body) {
  const data = await getAdminData()
  const adminUser = data?.auth?.adminUser
  const email = normalizeText(body?.email)
  const validEmail = normalizeText(adminUser?.email)

  if (!adminUser || !email || email !== validEmail) {
    throw new Error('Email admin khong hop le.')
  }

  return { user: adminUser }
}

export async function getAdminDashboardSummary() {
  const data = await getAdminData()
  const users = data.users || []
  const companies = data.companies || []
  const jobs = data.jobs || []
  const applications = data.applications || []

  return {
    total_users: users.length,
    unverified_users: users.filter((u) => Number(u.status) !== 0).length,
    total_companies: companies.length,
    unverified_companies: companies.filter((c) => !c.verified).length,
    total_jobs: jobs.length,
    open_jobs: jobs.filter((j) => normalizeText(j.status) === 'open').length,
    total_applications: applications.length,
  }
}

export async function getAdminUsers(params = {}) {
  const data = await getAdminData()
  const filtered = filterByKeyword(data.users || [], ['fullName', 'email', 'username', 'phone'], params.keyword)
  const paged = paginate(filtered, params.page, params.limit)
  return {
    users: paged.items,
    pagination: paged.pagination,
  }
}

export async function getAdminUserDetail(userId) {
  const data = await getAdminData()
  const user = (data.users || []).find((item) => item._id === userId)
  if (!user) throw new Error('Khong tim thay user.')
  return user
}

export async function updateAdminUserStatus(userId, status) {
  const normalizedStatus = Number(status)
  saveEntityPatch('users', userId, { status: normalizedStatus })
  const updated = await getAdminUserDetail(userId)
  return updated
}

export async function getAdminCompanies(params = {}) {
  const data = await getAdminData()
  const filtered = filterByKeyword(data.companies || [], ['company_name', 'website', 'address'], params.keyword)
  const paged = paginate(filtered, params.page, params.limit)
  return {
    companies: paged.items,
    pagination: paged.pagination,
  }
}

export async function getAdminCompanyDetail(companyId) {
  const data = await getAdminData()
  const company = (data.companies || []).find((item) => item._id === companyId)
  if (!company) throw new Error('Khong tim thay company.')
  return company
}

export async function getAdminCompanyJobs(companyId, params = {}) {
  const data = await getAdminData()
  const companiesMap = new Map((data.companies || []).map((company) => [company._id, company]))
  const scoped = (data.jobs || []).filter((job) => job.company_id === companyId).map((job) => withCompany(job, companiesMap))
  const filtered = filterByKeyword(scoped, ['title', 'location', 'job_type', 'level'], params.keyword)
  const paged = paginate(filtered, params.page, params.limit)
  return {
    jobs: paged.items,
    pagination: paged.pagination,
  }
}

export async function getAdminCompanyApplications(companyId, params = {}) {
  const data = await getAdminData()
  const usersMap = new Map((data.users || []).map((user) => [user._id, user]))
  const jobsMap = new Map((data.jobs || []).map((job) => [job._id, job]))

  const scoped = (data.applications || [])
    .filter((application) => application.company_id === companyId)
    .map((application) => ({
      ...application,
      user: usersMap.get(application.user_id) || null,
      job: jobsMap.get(application.job_id) || null,
    }))

  const filtered = filterByKeyword(scoped, ['status'], params.keyword)
  const paged = paginate(filtered, params.page, params.limit)
  return {
    applications: paged.items,
    pagination: paged.pagination,
  }
}

export async function updateAdminCompanyStatus(companyId, verified) {
  saveEntityPatch('companies', companyId, { verified: Boolean(verified) })
  const updated = await getAdminCompanyDetail(companyId)
  return updated
}

export async function getAdminJobs(params = {}) {
  const data = await getAdminData()
  const companiesMap = new Map((data.companies || []).map((company) => [company._id, company]))

  const jobs = (data.jobs || []).map((job) => withCompany(job, companiesMap))
  const filtered = filterByKeyword(jobs, ['title', 'location', 'level', 'job_type'], params.keyword)
  const paged = paginate(filtered, params.page, params.limit)

  return {
    jobs: paged.items,
    pagination: paged.pagination,
  }
}

export async function getAdminJobDetail(jobId) {
  const data = await getAdminData()
  const companiesMap = new Map((data.companies || []).map((company) => [company._id, company]))
  const job = (data.jobs || []).find((item) => item._id === jobId)
  if (!job) throw new Error('Khong tim thay job.')

  return withCompany(job, companiesMap)
}

export async function updateAdminJobModerationStatus(jobId, body) {
  const moderationStatus = normalizeText(body?.moderation_status)
  if (!['active', 'blocked'].includes(moderationStatus)) {
    throw new Error('moderation_status khong hop le.')
  }

  const patch = { moderation_status: moderationStatus }
  if (moderationStatus === 'blocked') {
    patch.blocked_reason = body?.blocked_reason || ''
  } else {
    patch.blocked_reason = ''
  }

  saveEntityPatch('jobs', jobId, patch)
  const updated = await getAdminJobDetail(jobId)
  return updated
}
