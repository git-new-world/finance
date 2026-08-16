export type FeatureStatus = 'draft' | 'active' | 'blocked' | 'completed'

export interface FeatureItem {
  id: string
  title: string
  status: FeatureStatus
  createdAt: string
  updatedAt?: string
  // 2026-08-04 骨架化：业务字段由 DOMAIN_TYPES 扩展（银行余额/发票号/税额等），
  // index signature 保证任意业务字段类型安全
  [key: string]: unknown
}

export interface FeatureFilter {
  keyword: string
  status: FeatureStatus | 'all'
}

export interface FeatureState {
  items: FeatureItem[]
  filter: FeatureFilter
  loading: boolean
  error: string
  selectedId: string | null
}

export interface FeatureActionResult {
  ok: boolean
  message: string
  item?: FeatureItem
}

// 补充本 feature 的领域类型定义。
// 注意：上方已有 FeatureStatus/FeatureItem/FeatureFilter/FeatureState/FeatureActionResult，
// 不要重复声明同名类型；只输出新增的领域类型（如业务实体、请求/响应类型）。
/**
 * 风险等级
 */
export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical'

/**
 * 风险处置状态
 */
export type RiskHandleStatus = 'pending' | 'processing' | 'resolved' | 'ignored'

/**
 * 风险分类
 */
export type RiskCategory =
  | 'liquidity'
  | 'credit'
  | 'market'
  | 'operational'
  | 'compliance'
  | 'other'

/**
 * 风险预警项
 */
export interface RiskWarning {
  id: string
  code: string
  title: string
  description: string
  category: RiskCategory
  severity: RiskSeverity
  status: RiskHandleStatus
  source: string
  createdAt: string
  updatedAt: string
  dueAt?: string
  handlerId?: string
  handlerName?: string
  handledAt?: string
  remark?: string
  relatedVoucherIds?: string[]
  relatedAccountCodes?: string[]
  [key: string]: unknown
}

/**
 * 风险预警查询参数
 */
export interface RiskQuery {
  keyword?: string
  severity?: RiskSeverity | 'all'
  status?: RiskHandleStatus | 'all'
  category?: RiskCategory | 'all'
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

/**
 * 风险处置请求
 */
export interface RiskDisposalRequest {
  id: string
  action: 'process' | 'resolve' | 'ignore'
  handlerId?: string
  handlerName?: string
  remark?: string
  disposalResult?: string
}

/**
 * 风险处置结果
 */
export interface RiskDisposalResult {
  ok: boolean
  message: string
  item?: RiskWarning
}

/**
 * 风险列表响应
 */
export interface RiskListResult {
  items: RiskWarning[]
  total: number
  page: number
  pageSize: number
}