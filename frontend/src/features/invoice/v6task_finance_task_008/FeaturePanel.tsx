import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureStatus } from './types'

const statusOptions: Array<FeatureStatus | 'all'> = ['all', 'draft', 'active', 'blocked', 'completed']

export default function V6taskFinanceTask008FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<FeatureStatus>('draft')

  const ALLOWED_INVOICE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    const MAX_INVOICE_SIZE = 10 * 1024 * 1024

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault()
      const trimmedTitle = title.trim()
      if (!trimmedTitle) {
        window.alert('标题不能为空')
        return
      }

      try {
        await createOrUpdate(trimmedTitle, status)
        setTitle('')
        setStatus('draft')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '保存项目失败')
      }
    }

    const handleCrossValidate = async (invoiceId?: string) => {
      const id = invoiceId ?? invoiceData?.invoiceId
      if (!id) {
        setUploadError('请先上传并识别发票')
        setUploadState('error')
        return
      }

      try {
        const response = await fetch('/api/v6task-finance-task-008/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ invoiceId: id }),
        })
        if (!response.ok) {
          throw new Error(`交叉校验请求失败：${response.status} ${await response.text()}`)
        }

        const result = (await response.json()) as {
          overall: 'pass' | 'fail' | 'pending'
          checks: Array<{ code: string; label: string; status: 'pass' | 'fail' | 'pending'; detail: string }>
        }
        setValidationResult(result)
        setUploadError(null)
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : '交叉校验失败')
        setValidationResult(null)
      }
    }

    const handleUploadFile = async (file: File) => {
      if (!ALLOWED_INVOICE_TYPES.includes(file.type)) {
        setUploadError('不支持的发票格式，请上传 JPG/PNG/WEBP/PDF 文件')
        setUploadState('error')
        return
      }

      if (file.size > MAX_INVOICE_SIZE) {
        setUploadError('发票文件大小不能超过 10MB')
        setUploadState('error')
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      setUploadState('uploading')
      setUploadError(null)
      setValidationResult(null)

      try {
        const response = await fetch('/api/v6task-finance-task-008', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          throw new Error(`发票识别请求失败：${response.status} ${await response.text()}`)
        }

        const data = (await response.json()) as {
          invoiceId: string
          amount: number
          issuedAt: string
          seller: string
          confidence: number
        }
        setInvoiceData(data)
        setUploadState('recognition')
        await handleCrossValidate(data.invoiceId)
      } catch (error) {
        setUploadState('error')
        setUploadError(error instanceof Error ? error.message : '发票上传识别失败')
      }
    }

    const handleFileChange = (event: { target: HTMLInputElement }) => {
      const file = event.target.files?.[0]
      event.target.value = ''

      if (!file) {
        setUploadError('未选择文件')
        setUploadState('error')
        return
      }

      void handleUploadFile(file)
    }

    const handleUploadClick = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = ALLOWED_INVOICE_TYPES.join(',')
      input.onchange = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          void handleUploadFile(file)
        }
      }
      input.click()
    }
  return (
    <section className="feature-panel" data-feature="v6task_finance_task_008">
      <header>
        <h1>V6taskFinanceTask008</h1>
        <p>Manage this feature with validation, filtering, and visible state feedback.</p>
      </header>

      <form onSubmit={handleSubmit} aria-label="Create or update item">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Item title" />
        <select value={status} onChange={(event) => setStatus(event.target.value as FeatureStatus)}>
          {statusOptions.filter((option) => option !== 'all').map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <button type="submit">Save</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
        <select value={state.filter.status} onChange={(event) => updateFilter({ status: event.target.value as FeatureStatus | 'all' })}>
          {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>No records found.</p>}

      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => selectItem(item.id)}>{item.title}</button>
            <span>{item.status}</span>
          </li>
        ))}
      </ul>

      <div className="invoice-upload-panel">
          <h2>发票上传识别</h2>
          <button type="button" onClick={handleUploadClick} disabled={uploadState === 'uploading' || uploadState === 'recognition'}>
            {uploadState === 'uploading' ? '上传中...' : uploadState === 'recognition' ? '识别中...' : '上传发票'}
          </button>
          <input type="file" accept={ALLOWED_INVOICE_TYPES.join(',')} onChange={handleFileChange} style={{ display: 'none' }} id="invoice-file-input" />

          {uploadState === 'error' && <p className="error" role="alert">{uploadError}</p>}
          {uploadState === 'recognition' && <p role="status">正在进行交叉校验...</p>}

          {invoiceData && (
            <div className="invoice-details">
              <h3>识别结果</h3>
              <dl>
                <dt>发票编号</dt>
                <dd>{invoiceData.invoiceId}</dd>
                <dt>金额</dt>
                <dd>{invoiceData.amount.toFixed(2)}</dd>
                <dt>开票日期</dt>
                <dd>{new Date(invoiceData.issuedAt).toLocaleString()}</dd>
                <dt>销方</dt>
                <dd>{invoiceData.seller}</dd>
                <dt>置信度</dt>
                <dd>{invoiceData.confidence}</dd>
              </dl>
            </div>
          )}

          {validationResult && (
            <div className="validation-result">
              <h3>交叉校验</h3>
              <p>校验状态: {validationResult.passed ? '通过' : '不通过'}</p>
              {validationResult.message && <p>{validationResult.message}</p>}
            </div>
          )}
        </div>
    </section>
  )
}
