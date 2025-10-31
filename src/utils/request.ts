/**
 * HTTP请求工具
 * 基于fetch API封装
 */

interface RequestConfig {
  method?: string
  headers?: Record<string, string>
  body?: any
}

interface ApiResponse<T = any> {
  code?: number
  message?: string
  data?: T
  [key: string]: any
}

// 获取API基础URL
const getBaseURL = (): string => {
  // 从环境变量获取,如果没有则使用默认值
  return import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
}

/**
 * 通用请求函数
 */
export async function request<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = config

  // 构建完整URL
  const fullUrl = url.startsWith('http') ? url : `${getBaseURL()}${url}`

  // 获取token
  const token = localStorage.getItem('token')

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // 如果有token,添加到请求头
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  // 构建请求配置
  const requestConfig: RequestInit = {
    method,
    headers: requestHeaders,
  }

  // 添加请求体
  if (body && method !== 'GET') {
    requestConfig.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(fullUrl, requestConfig)

    // 检查HTTP状态码
    if (!response.ok) {
      // 如果是401,清除token并跳转到登录页
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('isAuthenticated')
        window.location.href = '/login'
        throw new Error('登录已过期,请重新登录')
      }

      // 尝试解析错误信息
      let errorMessage = `请求失败: ${response.status}`
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        }
      } catch {
        // 如果无法解析JSON,使用默认错误信息
      }

      throw new Error(errorMessage)
    }

    // 检查响应是否有内容
    // 204 No Content 或空响应不需要解析
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T
    }

    // 检查响应类型
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      // 如果不是JSON响应,返回文本
      const text = await response.text()
      return (text || {}) as T
    }

    // 尝试解析JSON响应
    const text = await response.text()
    if (!text) {
      // 空响应
      return {} as T
    }

    const data: ApiResponse<T> = JSON.parse(text)

    // 检查业务状态码
    if (data.code && data.code !== 0 && data.code !== 200) {
      throw new Error(data.message || '请求失败')
    }

    // 返回数据
    // 如果响应直接是数据对象(没有包装在data字段中),直接返回
    return (data.data !== undefined ? data.data : data) as T
  } catch (error) {
    // 网络错误或其他错误
    if (error instanceof Error) {
      throw error
    }
    throw new Error('网络连接失败,请检查网络设置')
  }
}

/**
 * GET请求
 */
export function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  // 构建查询字符串
  if (params) {
    const queryString = new URLSearchParams(params).toString()
    url = `${url}?${queryString}`
  }
  return request<T>(url, { method: 'GET' })
}

/**
 * POST请求
 */
export function post<T = any>(url: string, data?: any): Promise<T> {
  return request<T>(url, { method: 'POST', body: data })
}

/**
 * PUT请求
 */
export function put<T = any>(url: string, data?: any): Promise<T> {
  return request<T>(url, { method: 'PUT', body: data })
}

/**
 * DELETE请求
 */
export function del<T = any>(url: string, data?: any): Promise<T> {
  return request<T>(url, { method: 'DELETE', body: data })
}

