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
export type BankAccountStatus = 'active' | 'disabled'

export interface BankAccount {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  currency: string
  balance: number
  status: BankAccountStatus
  lastSyncedAt?: string
}

export type BankTransactionDirection = 'inflow' | 'outflow'
export type BankTransactionMatchStatus = 'unmatched' | 'matched' | 'ignored'

export interface BankTransaction {
  id: string
  accountId: string
  transactionDate: string
  direction: BankTransactionDirection
  amount: number
  counterparty: string
  summary: string
  matchedStatus: BankTransactionMatchStatus
  matchedVoucherId?: string
  syncBatchId?: string
}

export interface BankStreamSyncRequest {
  accountId: string
  startDate?: string
  endDate?: string
  autoSync?: boolean
}

export interface BankStreamSyncResult {
  success: boolean
  message: string
  importedCount: number
  skippedCount: number
  transactions: BankTransaction[]
}

export type BankSyncTrigger = 'manual' | 'auto'

export interface BankStreamSyncLog {
  id: string
  accountId: string
  trigger: BankSyncTrigger
  status: 'running' | 'success' | 'failed'
  startedAt: string
  finishedAt?: string
  importedCount: number
  errorMessage?: string
}

export type VoucherSource = 'bank_sync' | 'manual' | 'ai_generated'
export type VoucherStatus = 'draft' | 'pending_review' | 'approved' | 'rejected'

export interface VoucherLine {
  lineNumber: number
  accountCode: string
  accountName: string
  summary: string
  debitAmount: number
  creditAmount: number
}

export interface Voucher {
  id: string
  voucherNo: string
  voucherDate: string
  status: VoucherStatus
  source: VoucherSource
  summary: string
  lines: VoucherLine[]
  totalDebit: number
  totalCredit: number
  createdBy?: string
  reviewedBy?: string
  reviewComment?: string
  reviewedAt?: string
  createdAt: string
  updatedAt?: string
}

export interface VoucherQuery {
  keyword?: string
  status?: VoucherStatus | 'all'
  source?: VoucherSource | 'all'
  dateFrom?: string
  dateTo?: string
  page: number
  pageSize: number
}

export interface VoucherListResult {
  items: Voucher[]
  total: number
  page: number
  pageSize: number
}

export type VoucherBatchOperation = 'approve' | 'reject' | 'delete'

export interface VoucherBatchRequest {
  ids: string[]
  operation: VoucherBatchOperation
}

export interface VoucherBatchResult {
  success: boolean
  message: string
  processedCount: number
  failedIds?: string[]
}

export type VoucherReviewAction = 'approve' | 'reject' | 'modify'

export interface VoucherReviewRecord {
  id: string
  voucherId: string
  action: VoucherReviewAction
  comment?: string
  reviewerId?: string
  reviewerName?: string
  reviewedAt: string
}

export type VoucherReviewRequest =
  | {
      voucherId: string
      action: 'approve' | 'reject'
      comment?: string
    }
  | {
      voucherId: string
      action: 'modify'
      comment?: string
      modifiedLines: VoucherLine[]
      modifiedSummary?: string
    }

export interface VoucherReviewResult {
  success: boolean
  message: string
  voucher?: Voucher
  record?: VoucherReviewRecord
}

export type VoucherChangeType = 'created' | 'updated' | 'submitted' | 'approved' | 'rejected'

export interface VoucherHistoryEntry {
  id: string
  voucherId: string
  version: number
  changeType: VoucherChangeType
  operatorId?: string
  operatorName?: string
  operatedAt: string
  changeSummary: string
  changedFields: string[]
  voucherSnapshot: Voucher
}

export type StandardReportType = 'balance_sheet' | 'income_statement' | 'cash_flow'

export interface ReportDateRange {
  startDate: string
  endDate: string
}

export interface StandardReportLine {
  itemName: string
  amount: number
  level?: number
  isTotal?: boolean
}

export interface StandardReport {
  id: string
  reportType: StandardReportType
  title: string
  period: ReportDateRange
  currency: string
  lines: StandardReportLine[]
  generatedAt: string
}

export interface StandardReportRequest {
  reportType: StandardReportType
  period: ReportDateRange
  includeComparison?: boolean
}

export type TaxType = 'vat' | 'enterprise_income_tax' | 'individual_income_tax' | 'stamp_tax' | 'surtax'

export interface TaxCalculationItem {
  taxType: TaxType
  taxableBase: number
  taxRate: number
  taxAmount: number
  surcharge: number
  payableAmount: number
}

export interface TaxCalculationRequest {
  taxType: TaxType
  startDate: string
  endDate: string
}

export interface TaxCalculationResult {
  success: boolean
  message: string
  items: TaxCalculationItem[]
  totalPayable: number
}

export type TaxReturnStatus = 'draft' | 'calculated' | 'filing' | 'filed' | 'rejected'

export interface TaxReturnDeclaration {
  id: string
  taxType: TaxType
  period: string
  taxableBase: number
  taxAmount: number
  surcharge: number
  payableAmount: number
  status: TaxReturnStatus
  dueDate: string
  filedAt?: string
  failureReason?: string
}

export interface TaxFilingRequest {
  returnIds: string[]
  operatorName?: string
  confirmed: boolean
}

export interface TaxFilingResult {
  success: boolean
  message: string
  filedReturnIds: string[]
  failedReturnIds?: string[]
  failureReason?: string
}

export type TaxFilingStage =
  | 'bank_sync'
  | 'voucher_generation'
  | 'voucher_review'
  | 'report_generation'
  | 'tax_calculation'
  | 'submission'

export interface TaxFilingWorkflowState {
  currentStage: TaxFilingStage
  completedStages: TaxFilingStage[]
  startedAt: string
  finishedAt?: string
  errorMessage?: string
  filingResult?: TaxFilingResult
}