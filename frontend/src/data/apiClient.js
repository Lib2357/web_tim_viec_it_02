const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '')

const FAVORITE_STORAGE_KEY = 'favorite_job_ids'

function getAccessToken() {
  return (
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('accessToken') ||
    sessionStorage.getItem('token') ||
    ''
  )
}

async function requestJson(path, options = {}) {
  const url = `${API_BASE_URL}${path}`
  const token = getAccessToken()
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth && token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`)
  }

  return res.json()
}

async function loadMockJobs() {
  const res = await fetch('/api/jobs.json')
  return res.json()
}

async function loadMockHome() {
  const res = await fetch('/api/home.json')
  return res.json()
}

async function loadMockUserCvs() {
  const res = await fetch('/api/user-cvs.json')
  return res.json()
}

async function loadMockProfileEdit() {
  const res = await fetch('/api/profile-edit.json')
  return res.json()
}

function formatSalary(salary) {
  if (!salary || typeof salary !== 'object') return 'Thoa thuan'
  if (salary.is_negotiable && salary.min == null && salary.max == null) return 'Thoa thuan'

  const unit = salary.currency === 'USD' ? 'USD' : 'VNĐ'
  const formatAmount = (value) => {
    if (typeof value !== 'number') return null
    if (salary.currency === 'USD') return value.toLocaleString('en-US')
    return `${Math.round(value / 1000000)}M`
  }

  const min = formatAmount(salary.min)
  const max = formatAmount(salary.max)

  if (min && max) return `${min} - ${max} ${unit}`
  if (min) return `Tu ${min} ${unit}`
  if (max) return `Den ${max} ${unit}`
  return 'Thoa thuan'
}

function formatDate(value) {
  if (!value) return 'Dang cap nhat'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Dang cap nhat'
  return date.toLocaleDateString('vi-VN')
}

function formatRelativeTime(value) {
  if (!value) return 'Moi dang'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Moi dang'
  const diffDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000))
  if (diffDays === 0) return 'Hom nay'
  if (diffDays === 1) return '1 ngay truoc'
  return `${diffDays} ngay truoc`
}

function splitTextList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return String(value)
    .split('\n')
    .map((item) => item.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean)
}

function mapApplicationStatus(status) {
  switch (status) {
    case 'submitted':
      return 'Cho duyet'
    case 'reviewing':
      return 'Dang xem xet'
    case 'shortlisted':
    case 'hired':
      return 'Chap nhan'
    case 'rejected':
      return 'Tu choi'
    case 'interviewing':
      return 'Dang xem xet'
    case 'withdrawn':
      return 'Da rut'
    default:
      return 'Dang xem xet'
  }
}

function mapJobLifecycleStatus(status) {
  switch (status) {
    case 'open':
      return 'Dang mo'
    case 'paused':
      return 'Tam dung'
    case 'closed':
      return 'Da dong'
    case 'expired':
      return 'Het han'
    case 'draft':
      return 'Ban nhap'
    default:
      return 'Dang mo'
  }
}

function mapJobType(value) {
  switch (value) {
    case 'full_time':
      return 'Toan thoi gian'
    case 'part_time':
      return 'Ban thoi gian'
    case 'remote':
      return 'Remote'
    case 'hybrid':
      return 'Hybrid'
    default:
      return value || 'Dang cap nhat'
  }
}

function mapLevel(value) {
  switch (value) {
    case 'intern':
      return 'Intern'
    case 'fresher':
      return 'Fresher'
    case 'junior':
      return 'Junior'
    case 'middle':
      return 'Middle'
    case 'senior':
      return 'Senior'
    case 'lead':
      return 'Lead'
    default:
      return value || 'Dang cap nhat'
  }
}

function normalizePublicJob(job) {
  const company = job.company || {}
  const applicationStatus = job.my_application?.status || job.application_status || job.applied_status
  const requirements = splitTextList(job.requirements)
  const responsibilities = splitTextList(job.description)
  const benefits = splitTextList(job.benefits)

  return {
    id: job._id || job.id,
    title: job.title,
    company: company.company_name || job.company_name || job.company || 'Dang cap nhat',
    avatar: company.logo || job.logo || job.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=96&h=96&fit=crop',
    salary: formatSalary(job.salary),
    location: job.location || company.address || 'Dang cap nhat',
    status: applicationStatus ? mapApplicationStatus(applicationStatus) : mapJobLifecycleStatus(job.status),
    postedAt: formatRelativeTime(job.published_at),
    publishedAt: job.published_at,
    appliedAt: job.my_application?.applied_at || job.applied_at || '',
    updatedAt: job.my_application?.updated_at || job.updated_at || '',
    skills: Array.isArray(job.skills) ? job.skills : [],
    requirements: requirements[0] || 'Dang cap nhat yeu cau',
    deadline: formatDate(job.expired_at),
    experience: mapLevel(job.level),
    level: mapLevel(job.level),
    openings: typeof job.quantity === 'number' ? `${String(job.quantity).padStart(2, '0')} nguoi` : 'Dang cap nhat',
    workMode: mapJobType(job.job_type),
    summary: responsibilities[0] || company.description || 'Dang cap nhat',
    tags: [...new Set([...(job.skills || []), ...(job.category || [])])],
    responsibilities,
    requirementsList: requirements,
    benefits,
    companyDescription: company.description || 'Dang cap nhat',
    companyFacts: {
      size: company.size || company.company_size || '',
      website: company.website || '',
      address: company.address || '',
      verified: company.verified || false,
    },
  }
}

function normalizeJobDetail(job, company, myApplication) {
  const requirements = splitTextList(job.requirements)
  const responsibilities = splitTextList(job.description)
  const benefits = splitTextList(job.benefits)

  return {
    id: job._id || job.id,
    title: job.title,
    company: company?.company_name || 'Dang cap nhat',
    salary: formatSalary(job.salary),
    deadline: formatDate(job.expired_at),
    location: job.location || company?.address || 'Dang cap nhat',
    experience: mapLevel(job.level),
    level: mapLevel(job.level),
    openings: typeof job.quantity === 'number' ? `${String(job.quantity).padStart(2, '0')} nguoi` : 'Dang cap nhat',
    workMode: mapJobType(job.job_type),
    status: myApplication?.status ? mapApplicationStatus(myApplication.status) : mapJobLifecycleStatus(job.status),
    postedAt: formatRelativeTime(job.published_at),
    summary: responsibilities[0] || company?.description || 'Dang cap nhat',
    tags: [...new Set([...(job.skills || []), ...(job.category || [])])],
    responsibilities,
    requirements,
    benefits,
    companyDescription: company?.description || 'Dang cap nhat',
    companyFacts: {
      size: company?.size || company?.company_size || '',
      website: company?.website || '',
      address: company?.address || '',
      verified: company?.verified || false,
    },
    companyInfo: company || {},
    myApplication: myApplication || null,
  }
}

export async function loadHomeMeta() {
  return loadMockHome()
}

export async function loadJobsForHome() {
  const mock = await loadMockJobs()
  return mock.jobs || []
}

export async function searchPublicJobs(query) {
  if (!query || query.trim().length < 2) {
    const mock = await loadMockJobs()
    return mock.jobs || []
  }

  try {
    const payload = await requestJson(`/jobs/search?q=${encodeURIComponent(query.trim())}`)
    const items = Array.isArray(payload?.data?.jobs)
      ? payload.data.jobs
      : Array.isArray(payload?.data?.items)
        ? payload.data.items
        : Array.isArray(payload?.data)
          ? payload.data
          : []

    if (!items.length) return []
    return items.map((item) => normalizePublicJob(item))
  } catch {
    const mock = await loadMockJobs()
    const q = query.trim().toLowerCase()
    return (mock.jobs || []).filter((job) => `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(q))
  }
}

export async function loadJobDetail(id) {
  try {
    const payload = await requestJson(`/jobs/${id}`)
    const job = payload?.data?.job
    const company = payload?.data?.company
    const myApplication = payload?.data?.my_application
    if (job) {
      return normalizeJobDetail(job, company, myApplication)
    }
  } catch {}

  const mock = await loadMockJobs()
  const appliedItems = Array.isArray(mock?.appliedJobsResponse?.data?.jobs) ? mock.appliedJobsResponse.data.jobs : []
  const appliedMatch = appliedItems.find((item) => {
    const jobId = item?.job?._id || item?.job?.id
    return String(jobId) === String(id)
  })

  if (appliedMatch?.job) {
    return normalizeJobDetail(appliedMatch.job, appliedMatch.job.company, appliedMatch.my_application || null)
  }

  const details = mock.jobDetails || []
  return details.find((item) => item.id === id) || details[0] || null
}

export async function loadOtherJobDetails(currentId) {
  const mock = await loadMockJobs()
  return (mock.jobDetails || []).filter((item) => item.id !== currentId)
}

export async function loadAppliedJobs() {
  try {
    const payload = await requestJson('/jobs/me/applied', { auth: true })
    const items = Array.isArray(payload?.data?.jobs)
      ? payload.data.jobs
      : Array.isArray(payload?.data?.items)
        ? payload.data.items
        : Array.isArray(payload?.data)
          ? payload.data
          : []

    if (items.length) {
      return items.map((item) => {
        const baseJob = item.job || item
        const merged = {
          ...baseJob,
          my_application: item.my_application || item.application || item.my_application,
          application_status: item.status || item.application_status || item.my_application?.status,
        }
        return normalizePublicJob(merged)
      })
    }
  } catch {}

  const mock = await loadMockJobs()
  const fallbackItems = Array.isArray(mock?.appliedJobsResponse?.data?.jobs)
    ? mock.appliedJobsResponse.data.jobs
    : Array.isArray(mock?.appliedJobs)
      ? mock.appliedJobs
      : []

  if (fallbackItems.length) {
    return fallbackItems.map((item) => {
      const baseJob = item.job || item
      const merged = {
        ...baseJob,
        my_application: item.my_application || item.application || item.my_application,
        application_status: item.status || item.application_status || item.my_application?.status,
      }
      return normalizePublicJob(merged)
    })
  }

  return mock.jobs || []
}

export async function loadFavoriteJobs() {
  const token = getAccessToken()
  if (token) {
    try {
      const payload = await requestJson('/user/favorite-jobs', { auth: true })
      const items = Array.isArray(payload?.data?.jobs)
        ? payload.data.jobs
        : Array.isArray(payload?.data?.items)
          ? payload.data.items
          : Array.isArray(payload?.data)
            ? payload.data
            : []

      if (items.length) {
        return items.map((item) => normalizePublicJob(item.job || item))
      }
    } catch {}
  }

  const mock = await loadMockJobs()
  const raw = localStorage.getItem(FAVORITE_STORAGE_KEY)
  const ids = raw ? JSON.parse(raw) : []
  const set = new Set(Array.isArray(ids) ? ids : [])
  return (mock.jobs || []).filter((job) => set.has(job.id))
}

export async function loadFavoriteIds() {
  const token = getAccessToken()
  if (token) {
    try {
      const payload = await requestJson('/user/favorite-jobs', { auth: true })
      const items = Array.isArray(payload?.data?.jobs)
        ? payload.data.jobs
        : Array.isArray(payload?.data)
          ? payload.data
          : []
      if (items.length) {
        return items.map((item) => item.job?._id || item.job?.id || item._id || item.id).filter(Boolean)
      }
    } catch {}
  }

  try {
    const raw = localStorage.getItem(FAVORITE_STORAGE_KEY)
    const ids = raw ? JSON.parse(raw) : []
    return Array.isArray(ids) ? ids : []
  } catch {
    return []
  }
}

export async function toggleFavoriteJob(jobId, shouldFavorite) {
  const token = getAccessToken()
  if (!token) return false

  try {
    if (shouldFavorite) {
      await requestJson(`/user/favorite-jobs/${jobId}`, { method: 'POST', auth: true })
    } else {
      await requestJson(`/user/favorite-jobs/${jobId}`, { method: 'DELETE', auth: true })
    }
    return true
  } catch {
    return false
  }
}

export async function loadUserUploadedCvs() {
  const mock = await loadMockUserCvs()
  return Array.isArray(mock?.data?.cvs) ? mock.data.cvs : []
}

export async function loadEditableAppliedProfile(cvId) {
  const mock = await loadMockProfileEdit()
  const items = Array.isArray(mock?.data?.profiles) ? mock.data.profiles : []
  return items.find((item) => String(item.cv_id) === String(cvId)) || null
}
