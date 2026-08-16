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
export type StandardReportType =
  | 'balance_sheet'
  | 'income_statement'
  | 'cash_flow_statement'

export type ReportPeriodType = 'monthly' | 'quarterly' | 'annual'

export interface ReportPeriod {
  year: number
  period: number
  periodType: ReportPeriodType
}

export interface ReportLineItem {
  code: string
  name: string
  value: number
  children?: ReportLineItem[]
}

export interface StandardReportSection {
  code: string
  name: string
  items: ReportLineItem[]
}

export interface StandardReportData {
  sections: StandardReportSection[]
  totals: Record<string, number>
}

export interface StandardReport {
  id: string
  reportType: StandardReportType
  reportName: string
  period: ReportPeriod
  currency: string
  data: StandardReportData
  generatedAt: string
}

export interface ReportColumn {
  id: string
  title: string
  dataIndex: string
  align?: 'left' | 'center' | 'right'
  width?: number
}

export interface ReportCell {
  columnId: string
  value: string | number | boolean | null
}

export interface ReportRow {
  id: string
  cells: ReportCell[]
}

export interface CustomReportConfig {
  columns: ReportColumn[]
  rows: ReportRow[]
}

export interface CustomReport {
  id: string
  name: string
  description?: string
  config: CustomReportConfig
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CustomReportCreatePayload {
  name: string
  description?: string
  columns: ReportColumn[]
  rows: ReportRow[]
}

export interface CustomReportUpdatePayload {
  id: string
  name?: string
  description?: string
  columns?: ReportColumn[]
  rows?: ReportRow[]
}

export type ReportExportFormat = 'excel' | 'pdf' | 'csv'

export interface ReportExportRequest {
  reportId: string
  format: ReportExportFormat
  includeComparison?: boolean
}

export interface ReportExportResult {
  url: string
  fileName: string
  format: ReportExportFormat
  exportedAt: string
}

export interface ReportCompareRequest {
  baseReportId: string
  compareReportId: string
}

export interface ReportDifference {
  rowId: string
  columnId: string
  baseValue: string | number | boolean | null
  compareValue: string | number | boolean | null
  change: number | null
  changeRate: number | null
}

export interface ReportComparison {
  base: StandardReport | CustomReport
  target: StandardReport | CustomReport
  differences: ReportDifference[]
}