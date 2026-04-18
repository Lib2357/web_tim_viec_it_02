const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '')

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }
  return url.toString()
}

function getHeaders(headers = {}) {
  const nextHeaders = new Headers(headers)
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : null

  if (!nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json')
  }

  if (token) {
    nextHeaders.set('Authorization', `Bearer ${token}`)
  }

  return nextHeaders
}

async function request(method, path, { params, data, headers } = {}) {
  const response = await fetch(buildUrl(path, params), {
    method,
    credentials: 'include',
    headers: getHeaders(headers),
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    if (payload?.message) {
      throw new Error(payload.message)
    }
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return { data: payload }
}

const apiClient = {
  get(path, options) {
    return request('GET', path, options)
  },
  post(path, data, options = {}) {
    return request('POST', path, { ...options, data })
  },
  patch(path, data, options = {}) {
    return request('PATCH', path, { ...options, data })
  },
}

export default apiClient
