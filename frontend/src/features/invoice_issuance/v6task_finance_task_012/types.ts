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
export type InvoiceType = 'special-vat' | 'general-vat' | 'electronic-vat'
export type InvoiceStatus = 'draft' | 'pending' | 'issued' | 'cancelled'
export type VoucherStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type BankSyncStatus = 'idle' | 'running' | 'success' | 'failed'
export type DocumentGenerateType = 'voucher' | 'invoice' | 'receipt'
export type DocumentGenerateStatus = 'queued' | 'processing' | 'completed' | 'failed'
export type ReportType = 'balance-sheet' | 'income-statement' | 'cash-flow-statement'

export interface BankAccount {
  id: string
  accountName: string
  accountNumber: string
  bankName: string
  balance: number
  currency: string
  lastSyncAt: string | null
}

export interface BankTransaction {
  id: string
  accountId: string
  transactionNo: string
  transactionDate: string
  amount: number
  currency: string
  direction: 'in' | 'out'
  counterpartyName: string
  counterpartyAccount: string
  purpose: string
  voucherId: string | null
}

export interface BankStreamSyncRequest {
  mode: 'manual' | 'auto'
  accountIds: string[]
  startDate: string
  endDate: string
}

export interface BankStreamSyncResult {
  ok: boolean
  totalCount: number
  insertedCount: number
  updatedCount: number
  failedCount: number
  message: string
}

export interface InvoiceLineItem {
  id: string
  name: string
  specification: string
  unit: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate: number
  taxAmount: number
}

export interface Invoice {
  id: string
  invoiceCode: string
  invoiceNo: string
  invoiceType: InvoiceType
  buyerTaxId: string
  buyerName: string
  buyerAddress: string
  buyerPhone: string
  sellerTaxId: string
  sellerName: string
  items: InvoiceLineItem[]
  amount: number
  taxAmount: number
  totalAmount: number
  status: InvoiceStatus
  issueDate: string | null
  remark: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceCreateRequest {
  invoiceType: InvoiceType
  buyerTaxId: string
  buyerName: string
  buyerAddress?: string
  buyerPhone?: string
  sellerTaxId: string
  sellerName: string
  items: InvoiceLineItem[]
  remark?: string
}

export interface InvoiceQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: InvoiceStatus | 'all'
  invoiceType?: InvoiceType | 'all'
  startDate?: string
  endDate?: string
}

export interface InvoicePageResult {
  total: number
  page: number
  pageSize: number
  items: Invoice[]
}

export interface InvoiceIssueRequest {
  invoiceId: string
  issuedAt: string
  operatorId: string
}

export interface InvoiceIssueResult {
  ok: boolean
  message: string
  invoice?: Invoice
}

export interface VoucherEntry {
  subjectCode: string
  subjectName: string
  direction: 'debit' | 'credit'
  amount: number
}

export interface Voucher {
  id: string
  voucherNo: string
  voucherDate: string
  sourceTransactionIds: string[]
  summary: string
  entries: VoucherEntry[]
  amount: number
  aiConfidence: number
  status: VoucherStatus
  reviewComment: string | null
  reviewedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface VoucherQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: VoucherStatus | 'all'
  startDate?: string
  endDate?: string
}

export interface VoucherPageResult {
  total: number
  page: number
  pageSize: number
  items: Voucher[]
}

export interface VoucherReviewRequest {
  voucherId: string
  approved: boolean
  comment: string
  entries?: VoucherEntry[]
}

export interface VoucherReviewResult {
  ok: boolean
  message: string
  voucher?: Voucher
}

export interface VoucherHistoryEntry {
  id: string
  voucherId: string
  action: 'create' | 'update' | 'submit' | 'approve' | 'reject'
  operatorId: string
  operatorName: string
  changedFields: Array<{
    field: string
    oldValue: unknown
    newValue: unknown
  }>
  createdAt: string
}

export interface DocumentGenerateRequest {
  bankTransactionIds: string[]
  generateType: DocumentGenerateType
}

export interface DocumentGenerateResult {
  ok: boolean
  generatedCount: number
  message: string
  items: Array<{
    id: string
    type: DocumentGenerateType
  }>
}

export interface DocumentGenerateTask {
  id: string
  type: DocumentGenerateType
  status: DocumentGenerateStatus
  request: DocumentGenerateRequest
  result: DocumentGenerateResult | null
  createdAt: string
  updatedAt: string
}

export interface ReportQuery {
  reportType: ReportType
  startDate: string
  endDate: string
}

export interface ReportData {
  reportType: ReportType
  title: string
  generatedAt: string
  periods: Array<{
    period: string
    columns: Array<{
      label: string
      value: number
    }>
  }>
}