import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask008FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'invoiceCode', label: '发票代码' },
      { key: 'invoiceNumber', label: '发票号码' },
      { key: 'invoiceDate', label: '开票日期' },
      { key: 'sellerName', label: '销售方' },
      { key: 'buyerName', label: '购买方' },
      { key: 'amount', label: '金额' },
      { key: 'taxAmount', label: '税额' },
      { key: 'totalAmount', label: '价税合计' },
      { key: 'recognizeStatus', label: '识别状态' },
      { key: 'crossValidateStatus', label: '交叉校验状态' },
      { key: 'uploadedAt', label: '上传时间' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  const API_PATH = '/api/v6task-finance-task-008'

    async function handleUploadInvoice(event: { target: HTMLInputElement }) {
      const input = event.target
      const file = input.files?.[0]
      input.value = ''
      if (!file) {
        window.alert('请选择要上传的发票文件')
        return
      }
      const fileName = file.name.toLowerCase()
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
      const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']
      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.some((ext) => fileName.endsWith(ext))
      ) {
        window.alert('不支持的文件格式，请上传 PDF、JPG、PNG 或 WEBP 格式的发票')
        return
      }
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        window.alert('发票文件大小不能超过 10MB')
        return
      }
      const body = new FormData()
      body.append('file', file)
      const invoiceNumber = form.invoiceNumber?.trim()
      if (invoiceNumber) {
        body.append('invoiceNumber', invoiceNumber)
      }
      try {
        const response = await fetch(`${API_PATH}/upload`, {
          method: 'POST',
          body,
        })
        if (!response.ok) {
          const detail = await response.text().catch(() => '')
          throw new Error(`发票上传失败（${response.status}）：${detail}`)
        }
        const result = await response.json().catch(() => ({}))
        if (result?.status === 'error') {
          throw new Error(result?.message || '发票上传失败')
        }
        await refresh()
        window.alert(result?.message || '发票上传成功')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '发票上传失败，请稍后重试')
      }
    }

    async function handleRecognizeInvoice(id: string) {
      if (!id) {
        window.alert('请先选择要识别的发票')
        return
      }
      try {
        const response = await fetch(`${API_PATH}/recognize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (!response.ok) {
          const detail = await response.text().catch(() => '')
          throw new Error(`发票识别失败（${response.status}）：${detail}`)
        }
        const result = await response.json().catch(() => ({}))
        if (result?.status === 'error') {
          throw new Error(result?.message || '发票识别失败')
        }
        await refresh()
        window.alert(result?.message || '发票识别完成')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '发票识别失败，请稍后重试')
      }
    }

    async function handleCrossValidateInvoice(id: string) {
      if (!id) {
        window.alert('请先选择要交叉校验的发票')
        return
      }
      try {
        const response = await fetch(`${API_PATH}/cross-validate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        if (!response.ok) {
          const detail = await response.text().catch(() => '')
          throw new Error(`交叉校验失败（${response.status}）：${detail}`)
        }
        const result = await response.json().catch(() => ({}))
        if (result?.status === 'error') {
          throw new Error(result?.message || '交叉校验失败')
        }
        await refresh()
        window.alert(result?.message || '交叉校验完成')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '交叉校验失败，请稍后重试')
      }
    }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="v6task_finance_task_008">
      <header>
        <h1>发票上传管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="发票上传管理 form">
        {businessFields.map((field) => (
          <input
            key={field.key}
            name={field.key}
            type={field.type || 'text'}
            value={form[field.key] || ''}
            onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
            placeholder={field.label}
          />
        ))}
        <button type="submit">新增发票上传</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无发票上传，点击「新增发票上传」创建</p>}

      <table>
        <thead>
          <tr>{businessColumns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={String(item.id)} onClick={() => selectItem(String(item.id))}>
              {businessColumns.map((col) => (
                <td key={col.key}>{String((item as Record<string, unknown>)[col.key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-actions">
        <section className="invoice-upload-section" aria-label="发票上传识别">
          <h2>发票上传识别</h2>
          <div className="upload-row">
            <input
              id="invoice-upload-input"
              className="hidden"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUploadInvoice}
            />
            <button type="button" onClick={() => document.getElementById('invoice-upload-input')?.click()}>
              选择发票并识别
            </button>
          </div>
          <p className="hint">支持 PDF、JPG、PNG 格式，系统将自动识别发票信息并生成待审核记录。</p>
        </section>
        <section className="invoice-cross-check-section" aria-label="交叉校验">
          <h2>交叉校验</h2>
          <p>对选中的发票与银行流水、税务端数据进行一致性核验。</p>
          <button
            type="button"
            disabled={!state.selectedId}
            onClick={() => state.selectedId && void handleCrossValidateInvoice(state.selectedId)}
          >
            交叉校验
          </button>
        </section>
      </div>
    </section>
  )
}
