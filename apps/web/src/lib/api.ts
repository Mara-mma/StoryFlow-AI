const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new ApiError(
        error.message || 'Something went wrong. Please try again.',
        res.status,
      )
    }

    return res.json()
  } catch (err) {
    if (err instanceof ApiError) throw err
    throw new ApiError('Unable to connect. Check your internet connection.', 0)
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const api = {
  generateStory: (body: any, token?: string) =>
    request<ApiResponse<any>>('/stories/generate', { method: 'POST', body: JSON.stringify(body) }, token),

  saveStory: (body: any, token: string) =>
    request<ApiResponse<any>>('/stories', { method: 'POST', body: JSON.stringify(body) }, token),

  getStories: (token: string) =>
    request<ApiResponse<any[]>>('/stories', {}, token),

  deleteStory: (id: string, token: string) =>
    request<ApiResponse<{ id: string }>>(`/stories/${id}`, { method: 'DELETE' }, token),

  login: (body: any) =>
    request<{ access_token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  signup: (body: any) =>
    request<{ access_token: string; user: any }>('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
}
