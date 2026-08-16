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
export type InvoiceType =
  | 'vat_special'
  | 'vat_general'
  | 'vat_electronic'
  | 'train_ticket'
  | 'taxi_receipt'
  | 'fuel_invoice'
  | 'other'

export interface InvoiceItemLine {
  lineNumber: number
  name: string
  specification?: string
  unit?: string
  quantity?: number
  unitPrice?: number
  amount: number
  taxRate?: number
  taxAmount?: number
  taxClassificationCode?: string
  [key: string]: unknown
}

export interface RecognizedInvoice {
  invoiceType: InvoiceType
  invoiceCode: string
  invoiceNumber: string
  invoiceDate: string
  checkCode: string
  sellerName: string
  sellerTaxId: string
  buyerName: string
  buyerTaxId: string
  amount: number
  taxAmount: number
  totalAmount: number
  currency: string
  items: InvoiceItemLine[]
  remark?: string
  [key: string]: unknown
}

export interface InvoiceRecognitionResult {
  recognitionId: string
  invoice: RecognizedInvoice
  confidence: number
  ocrProvider: string
  recognizedAt: string
  rawOcrData: Record<string, unknown>
}

export type InvoiceCrossValidationStatus = 'pending' | 'passed' | 'warning' | 'failed'

export interface InvoiceValidationIssue {
  code: string
  message: string
  severity: 'info' | 'warning' | 'error'
  fieldPath: string
  expectedValue?: unknown
  actualValue?: unknown
}

export interface InvoiceBankStreamMatch {
  bankStreamId: string
  transactionDate: string
  amount: number
  counterpartyName: string
  matchScore: number
}

export interface InvoiceCrossValidationResult {
  validationId: string
  invoiceId: string
  bankStreamId?: string
  voucherId?: string
  status: InvoiceCrossValidationStatus
  checkedAt: string
  amountDifference?: number
  counterpartyMatched?: boolean
  dateMatched?: boolean
  matchedBankStream?: InvoiceBankStreamMatch
  issues: InvoiceValidationIssue[]
}

export type InvoiceUploadStatus = 'queued' | 'uploading' | 'recognizing' | 'validating' | 'completed' | 'failed'

export interface InvoiceUploadRecord {
  id: string
  fileName: string
  fileSize: number
  mimeType: string
  uploadStatus: InvoiceUploadStatus
  uploadedAt: string
  recognition?: InvoiceRecognitionResult
  validation?: InvoiceCrossValidationResult
  errorMessage?: string
}

export interface InvoiceUploadRequest {
  file: File
  invoiceType?: InvoiceType
  bankStreamIds?: string[]
  validateAgainstBankStream?: boolean
}

export interface InvoiceUploadResponse {
  uploadId: string
  status: InvoiceUploadStatus
  record: InvoiceUploadRecord
}

export interface InvoiceCrossValidationRequest {
  invoiceId: string
  bankStreamIds?: string[]
  voucherId?: string
}