/**
 * 认证相关API
 */
import { post, get } from '@/utils/request'

/**
 * 登录请求参数
 */
export interface LoginRequest {
  identity_type: number // 身份类型: 8-OTP
  credential: string // 凭证(验证码)
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string // 令牌
}

/**
 * 用户信息
 */
export interface UserInfo {
  nickname?: string // 昵称
  avatar?: string // 头像
  email?: string // 邮箱
  phone?: string // 手机号
}

/**
 * OTP登录
 * @param credential OTP验证码
 */
export function loginWithOTP(credential: string): Promise<LoginResponse> {
  return post<LoginResponse>('/api/v1/oms/auth/login', {
    identity_type: 8, // OTP登录类型
    credential,
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<UserInfo> {
  return get<UserInfo>('/api/v1/oms/auth/info')
}

/**
 * 登出
 */
export function logout(): Promise<void> {
  return post<void>('/api/v1/oms/auth/logout')
}

