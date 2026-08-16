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
export type CurrencyCode = 'CNY' | 'USD' | 'EUR' | 'HKD' | 'JPY'

export interface BankBalanceDailyRow {
  date: string
  bankAccountId: string
  bankAccountName: string
  bankAccountNumber: string
  bankName: string
  currency: CurrencyCode
  openingBalance: number
  totalIncome: number
  totalExpense: number
  closingBalance: number
}

export interface BankBalanceDailySummary {
  totalOpeningBalance: number
  totalIncome: number
  totalExpense: number
  totalClosingBalance: number
}

export interface BankBalanceDailyReport {
  id: string
  reportDate: string
  summary: BankBalanceDailySummary
  rows: BankBalanceDailyRow[]
  generatedAt: string
}

export interface BankBalanceDailyReportQuery {
  startDate?: string
  endDate?: string
  bankAccountId?: string
  keyword?: string
  page: number
  pageSize: number
}

export interface BankBalanceDailyReportPageResult {
  items: BankBalanceDailyReport[]
  total: number
  page: number
  pageSize: number
}

export interface ExportBankBalanceDailyReportParams {
  startDate: string
  endDate: string
  bankAccountId?: string
  format: 'xlsx' | 'csv'
}

export interface ExportBankBalanceDailyReportResult {
  ok: boolean
  message: string
  downloadUrl?: string
  fileName?: string
}