/**
 * JWKS公钥管理API
 */
import { get, put, del } from '@/utils/request'

/**
 * JWKS密钥项
 */
export interface JWKSKey {
  kid: string // 密钥ID
  kty: string // 密钥类型
  alg: string // 算法
  crv: string // 加密算法曲线
  x: string // 公钥
}

/**
 * JWKS列表响应
 */
export interface JWKSListResponse {
  data: JWKSKey[]
}

/**
 * 公钥使用记录项
 */
export interface KeyUsageRecord {
  time: string // 时间
  count: number // 使用次数
}

/**
 * 公钥使用记录响应
 */
export interface KeyUsageResponse {
  records: KeyUsageRecord[]
}

/**
 * 删除公钥请求参数
 */
export interface DeleteKeyRequest {
  kid: string
}

/**
 * 获取JWKS密钥列表
 */
export function getJWKSList(): Promise<JWKSListResponse> {
  return get<JWKSListResponse>('/api/v1/oms/jwks/list')
}

/**
 * 轮换公钥
 */
export function rotateKey(): Promise<void> {
  return put<void>('/api/v1/oms/jwks/rotate')
}

/**
 * 删除公钥
 * @param kid 密钥ID
 */
export function deleteKey(kid: string): Promise<void> {
  return del<void>('/api/v1/oms/jwks/delete', { kid })
}

/**
 * 获取公钥使用记录
 * @param kid 密钥ID
 */
export function getKeyUsage(kid: string): Promise<KeyUsageResponse> {
  return get<KeyUsageResponse>('/api/v1/oms/jwks/usage', { kid })
}

