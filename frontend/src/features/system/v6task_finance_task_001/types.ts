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
export type BankStreamSyncMode = 'manual' | 'auto'
export type BankStreamSyncState = 'idle' | 'syncing' | 'success' | 'failed'

export interface BankStreamSyncRequest {
  mode: BankStreamSyncMode
  startDate?: string
  endDate?: string
  accountId?: string
}

export interface BankStreamSyncError {
  code: string
  message: string
  transactionId?: string
}

export interface BankStreamSyncResult {
  ok: boolean
  syncedCount: number
  skippedCount: number
  failedCount: number
  errors: BankStreamSyncError[]
}

export interface BankStreamRecord {
  id: string
  accountId: string
  accountName: string
  transactionId: string
  transactionDate: string
  amount: number
  currency: string
  direction: 'debit' | 'credit'
  counterparty: string
  purpose: string
  rawData?: Record<string, unknown>
}

export type VoucherStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected'
export type VoucherType = 'ai_generated' | 'manual' | 'adjusted'

export interface VoucherEntry {
  id: string
  accountCode: string
  accountName: string
  debit: number
  credit: number
  summary?: string
}

export interface Voucher {
  id: string
  voucherNo: string
  voucherDate: string
  type: VoucherType
  status: VoucherStatus
  sourceBankStreamId?: string
  summary: string
  entries: VoucherEntry[]
  totalDebit: number
  totalCredit: number
  createdBy: string
  createdAt: string
  updatedAt?: string
}

export interface VoucherListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: VoucherStatus | 'all'
  dateFrom?: string
  dateTo?: string
}

export interface VoucherReviewRequest {
  voucherId: string
  action: 'approve' | 'reject' | 'modify'
  comment: string
  entries?: VoucherEntry[]
}

export interface VoucherReviewResult {
  ok: boolean
  message: string
  voucher: Voucher
}

export interface VoucherChangeDetail {
  field: string
  oldValue?: unknown
  newValue?: unknown
}

export interface VoucherHistoryItem {
  id: string
  voucherId: string
  voucherNo: string
  operation: 'create' | 'update' | 'approve' | 'reject' | 'modify'
  operator: string
  operatedAt: string
  changes: VoucherChangeDetail[]
  comment?: string
}

export interface VoucherHistoryQuery {
  voucherId?: string
  operation?: VoucherHistoryItem['operation'] | 'all'
  operator?: string
  dateFrom?: string
  dateTo?: string
}

export type StandardReportType = 'balance_sheet' | 'income_statement' | 'cash_flow'

export interface StandardReportRequest {
  reportType: StandardReportType
  periodStart: string
  periodEnd: string
}

export interface StandardReport {
  reportType: StandardReportType
  periodStart: string
  periodEnd: string
  generatedAt: string
  data: Record<string, unknown>
}