export type FeatureStatus = 'draft' | 'active' | 'blocked' | 'completed'

export interface FeatureItem {
  id: string
  title: string
  status: FeatureStatus
  createdAt: string
  updatedAt?: string
  invoiceType: 'special' | 'normal' | 'electronic'
    invoiceCode: string
    invoiceNumber: string
    invoiceDate: string
    sellerName: string
    sellerTaxId: string
    buyerName: string
    buyerTaxId: string
    amount: number
    taxAmount: number
    totalAmount: number
    fileUrl?: string
    fileName?: string
    uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'failed'
    recognitionStatus: 'pending' | 'recognizing' | 'recognized' | 'failed'
    crossValidationStatus: 'pending' | 'validating' | 'passed' | 'failed'
    recognizedData?: {
      invoiceType: string
      invoiceCode: string
      invoiceNumber: string
      invoiceDate: string
      sellerName: string
      sellerTaxId: string
      buyerName: string
      buyerTaxId: string
      amount: number
      taxAmount: number
      totalAmount: number
    }
    crossValidationResult?: Array<{
      field: string
      expected: string | number
      actual: string | number
      passed: boolean
      message?: string
    }>
    error?: string
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
