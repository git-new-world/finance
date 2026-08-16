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
export type AiRole = 'user' | 'assistant' | 'system'

export type AiMessageStatus = 'pending' | 'streaming' | 'completed' | 'failed'

export type AiSourceType = 'bankStream' | 'voucher' | 'report' | 'knowledge'

export interface AiSourceReference {
  id: string
  type: AiSourceType
  title: string
  summary: string
  url: string
}

export interface AiMessage {
  id: string
  conversationId: string
  role: AiRole
  content: string
  status: AiMessageStatus
  references: AiSourceReference[]
  createdAt: string
  error?: string
}

export interface AiConversation {
  id: string
  title: string
  messages: AiMessage[]
  createdAt: string
  updatedAt: string
}

export interface AiConversationSummary {
  id: string
  title: string
  lastMessage: string
  updatedAt: string
}

export interface AiConsultContext {
  bankAccountId?: string
  voucherIds?: string[]
  reportType?: string
  dateRange?: {
    startDate: string
    endDate: string
  }
}

export interface AiConsultRequest {
  conversationId?: string
  question: string
  context?: AiConsultContext
}

export interface AiConsultResponse {
  conversationId: string
  message: AiMessage
}

export interface AiConversationListParams {
  page: number
  pageSize: number
  keyword?: string
}

export interface AiConversationListResult {
  items: AiConversationSummary[]
  total: number
}