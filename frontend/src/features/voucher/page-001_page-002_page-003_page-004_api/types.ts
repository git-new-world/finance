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
export type DebitCreditDirection = 'debit' | 'credit'

export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

export interface PagedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export type VoucherFeatureRoute =
  | '/bank-stream-sync'
  | '/vouchers'
  | '/voucher-review'
  | '/voucher-history'
  | '/reports/standard'

export interface BankAccountSummary {
  id: string
  accountNo: string
  accountName: string
  bankName: string
  currency: string
  currentBalance: number
}

export type BankStreamSyncType = 'manual' | 'auto'

export type BankStreamSyncSource = 'bank_api' | 'file_import' | 'manual_upload'

export type BankStreamSyncStatus = 'pending' | 'syncing' | 'success' | 'partial_success' | 'failed'

export interface BankStreamSyncRequest {
  bankAccountId: string
  startDate: string
  endDate: string
  syncType: BankStreamSyncType
  source: BankStreamSyncSource
  fileToken: string | null
}

export interface BankStreamAutoSyncConfig {
  id: string
  bankAccountId: string
  bankAccountName: string
  enabled: boolean
  scheduleType: 'daily' | 'weekly' | 'monthly'
  lastRunAt: string | null
  nextRunAt: string | null
}

export interface BankStreamSyncRecord {
  id: string
  bankAccountId: string
  bankAccountName: string
  syncType: BankStreamSyncType
  source: BankStreamSyncSource
  syncStatus: BankStreamSyncStatus
  startedAt: string
  finishedAt: string | null
  transactionCount: number
  matchedVoucherCount: number
  generatedVoucherCount: number
  failedCount: number
  failedReason: string | null
  createdBy: string
}

export interface BankStreamTransaction {
  id: string
  syncRecordId: string
  bankAccountId: string
  bankAccountName: string
  transactionNo: string
  occurredAt: string
  amount: number
  currency: string
  direction: DebitCreditDirection
  counterpartyName: string
  counterpartyAccountNo: string
  summary: string
  purpose: string
  balanceAfter: number
  voucherId: string | null
}

export interface BankStreamSyncResult {
  syncRecordId: string
  importedCount: number
  matchedVoucherCount: number
  generatedVoucherCount: number
  failedCount: number
  voucherIds: string[]
}

export type VoucherStatus = 'pending_review' | 'approved' | 'rejected' | 'reversed'

export type VoucherReviewAction = 'approve' | 'reject' | 'modify'

export type VoucherAuditAction =
  | 'generate'
  | 'submit_review'
  | 'approve'
  | 'reject'
  | 'modify'
  | 'reverse'
  | 'export'

export interface VoucherEntry {
  id: string
  voucherId: string
  accountingSubjectCode: string
  accountingSubjectName: string
  direction: DebitCreditDirection
  amount: number
  summary: string
}

export interface Voucher {
  id: string
  voucherNo: string
  bankStreamTransactionId: string
  bankStreamTransactionNo: string
  occurredAt: string
  status: VoucherStatus
  summary: string
  debitTotal: number
  creditTotal: number
  generatedBy: string
  generatedAt: string
  reviewedBy: string | null
  reviewedAt: string | null
  reviewComment: string | null
  entries: VoucherEntry[]
}

export interface VoucherQuery {
  keyword: string
  status: VoucherStatus | 'all'
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

export interface VoucherBatchOperationRequest {
  voucherIds: string[]
  action: 'approve' | 'reject' | 'reverse'
  comment: string
}

export interface VoucherEntryInput {
  accountingSubjectCode: string
  accountingSubjectName: string
  direction: DebitCreditDirection
  amount: number
  summary: string
}

export interface VoucherReviewRequest {
  voucherId: string
  action: 'approve' | 'reject'
  comment: string
}

export interface VoucherModifyRequest {
  voucherId: string
  summary: string
  comment: string
  entries: VoucherEntryInput[]
}

export interface VoucherReviewResult {
  voucherId: string
  voucherNo: string
  action: VoucherReviewAction
  voucher: Voucher
}

export interface AccountingSubject {
  code: string
  name: string
  category: 'asset' | 'liability' | 'equity' | 'cost' | 'profit_loss'
  balanceDirection: DebitCreditDirection
}

export interface VoucherReviewDetail {
  voucher: Voucher
  bankStreamTransaction: BankStreamTransaction
  availableSubjects: AccountingSubject[]
}

export interface VoucherAuditChange {
  field: string
  before: unknown
  after: unknown
}

export interface VoucherHistoryRecord {
  id: string
  voucherId: string
  voucherNo: string
  action: VoucherAuditAction
  operatorId: string
  operatorName: string
  fromStatus: VoucherStatus | null
  toStatus: VoucherStatus | null
  comment: string
  changes: VoucherAuditChange[]
  createdAt: string
}

export interface VoucherHistoryQuery {
  voucherId?: string
  voucherNo?: string
  action: VoucherAuditAction | 'all'
  operatorName?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

export type StandardReportType = 'balance_sheet' | 'income_statement' | 'cash_flow_statement'

export interface StandardReportRequest {
  reportType: StandardReportType
  startDate: string
  endDate: string
  includePreviousPeriod: boolean
}

export interface StandardReportLine {
  itemCode: string
  itemName: string
  currentAmount: number
  previousAmount: number | null
  note: string
}

export interface StandardReportSection {
  title: string
  lines: StandardReportLine[]
}

export interface StandardReport {
  id: string
  reportType: StandardReportType
  title: string
  startDate: string
  endDate: string
  currency: string
  generatedAt: string
  sections: StandardReportSection[]
  totals: Record<string, number>
}

export type BankStreamSyncListResponse = PagedResponse<BankStreamSyncRecord>
export type VoucherListResponse = PagedResponse<Voucher>
export type VoucherHistoryListResponse = PagedResponse<VoucherHistoryRecord>
export type StandardReportListResponse = PagedResponse<StandardReport>