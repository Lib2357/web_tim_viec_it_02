const COMPANY_MOCK_URL = '/api/company.json'
const COMPANY_JOBS_STORAGE_KEY = 'company_jobs_mock'
const COMPANY_APPS_STORAGE_KEY = 'company_application_status_mock'

async function loadCompanyMock() {
  const response = await fetch(COMPANY_MOCK_URL)
  if (!response.ok) {
    throw new Error('Khong the tai du lieu mock company.')
  }
  return response.json()
}

function readStorageJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function writeStorageJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

async function getStoredCompanyJobs() {
  const cached = readStorageJson(COMPANY_JOBS_STORAGE_KEY, null)
  if (Array.isArray(cached) && cached.length > 0) return cached

  const mock = await loadCompanyMock()
  const jobs = Array.isArray(mock.jobs) ? mock.jobs : []
  writeStorageJson(COMPANY_JOBS_STORAGE_KEY, jobs)
  return jobs
}

function normalizePayloadToMockJob(payload = {}, id) {
  return {
    _id: String(id),
    title: payload.title || 'Untitled Job',
    description: payload.description || '',
    requirements: payload.requirements || '',
    benefits: payload.benefits || '',
    salary: payload.salary || {},
    location: payload.location || '',
    job_type: payload.job_type || 'full-time',
    level: payload.level || 'senior',
    status: payload.status || 'draft',
    category: Array.isArray(payload.category) ? payload.category : [],
    skills: Array.isArray(payload.skills) ? payload.skills : [],
    quantity: Number(payload.quantity) || 1,
    expired_at: payload.expired_at || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export async function createCompanyJob(payload) {
  const jobs = await getStoredCompanyJobs()
  const nextId = `mock-job-${Date.now()}`
  const created = normalizePayloadToMockJob(payload, nextId)
  const nextJobs = [created, ...jobs]
  writeStorageJson(COMPANY_JOBS_STORAGE_KEY, nextJobs)
  return { status: 'success', data: { job: created } }
}

export async function updateCompanyJob(jobId, payload) {
  const jobs = await getStoredCompanyJobs()
  let updatedJob = null

  const nextJobs = jobs.map((job) => {
    const currentId = String(job._id || job.id || '')
    if (currentId !== String(jobId)) return job
    updatedJob = {
      ...job,
      ...normalizePayloadToMockJob(payload, currentId),
      _id: currentId,
      updated_at: new Date().toISOString(),
    }
    return updatedJob
  })

  writeStorageJson(COMPANY_JOBS_STORAGE_KEY, nextJobs)
  if (!updatedJob) throw new Error('Khong tim thay job can cap nhat.')
  return { status: 'success', data: { job: updatedJob } }
}

export async function getCompanyJobs(params = {}) {
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 20
  const status = params.status ? String(params.status) : ''
  const jobs = await getStoredCompanyJobs()
  const filtered = status ? jobs.filter((job) => job.status === status) : jobs
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  return {
    items,
    pagination: {
      page,
      limit,
      total: filtered.length,
    },
  }
}

export async function getCompanyJobApplications(jobId, status, page = 1, limit = 20) {
  const mock = await loadCompanyMock()
  const allApplications = Array.isArray(mock.applications) ? mock.applications : []
  const byJob = allApplications.filter((item) => String(item.job_id) === String(jobId))
  const filtered = status ? byJob.filter((item) => item.status === status) : byJob
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  return {
    items,
    pagination: {
      page,
      limit,
      total: filtered.length,
    },
  }
}

export async function getCompanyApplicationDetail(applicationId) {
  const mock = await loadCompanyMock()
  const details = Array.isArray(mock.applicationDetails) ? mock.applicationDetails : []
  const statusMap = readStorageJson(COMPANY_APPS_STORAGE_KEY, {})
  const detail = details.find((item) => String(item._id) === String(applicationId))

  if (!detail) throw new Error('Khong tim thay ho so ung vien.')
  return {
    ...detail,
    status: statusMap[String(applicationId)] || detail.status,
  }
}

export async function updateCompanyApplicationStatus(applicationId, status) {
  const statusMap = readStorageJson(COMPANY_APPS_STORAGE_KEY, {})
  statusMap[String(applicationId)] = status
  writeStorageJson(COMPANY_APPS_STORAGE_KEY, statusMap)
  return { status: 'success', message: 'Cap nhat trang thai thanh cong.' }
}

export async function getUserProfile(userName) {
  const mock = await loadCompanyMock()
  const profiles = Array.isArray(mock.userProfiles) ? mock.userProfiles : []
  const item = profiles.find((profile) => String(profile.user_name).toLowerCase() === String(userName).toLowerCase())
  if (!item) throw new Error('Khong tim thay thong tin user.')
  return item
}
