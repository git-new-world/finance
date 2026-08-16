import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask012FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'documentNo', label: '单据编号' },
    { key: 'documentType', label: '单据类型' },
    { key: 'invoiceNo', label: '发票号码' },
    { key: 'invoiceCode', label: '发票代码' },
    { key: 'buyerName', label: '购方名称' },
    { key: 'sellerName', label: '销方名称' },
    { key: 'amount', label: '金额' },
    { key: 'taxAmount', label: '税额' },
    { key: 'totalAmount', label: '价税合计' },
    { key: 'issueDate', label: '开票日期' },
    { key: 'status', label: '状态' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  async function handleGenerateDocuments() {
      try {
        const response = await fetch('/api/v6task-finance-task-012/generate-documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'bank-stream',
            keyword: state.filter.keyword || '',
          }),
        })
        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string }
          throw new Error(errorData.message || `单据智能生成失败（${response.status}）`)
        }
        const result = (await response.json().catch(() => ({}))) as { documents?: unknown[] }
        const count = result && Array.isArray(result.documents) ? result.documents.length : 0
        window.alert(count > 0 ? `成功生成 ${count} 张单据` : '智能生成完成，已更新单据列表。')
        await refresh()
      } catch (error) {
        const message = error instanceof Error ? error.message : '单据智能生成失败'
        window.alert(message)
      }
    }

    async function handleAuditDocument(id: string, approved: boolean) {
      if (!id) {
        window.alert('请先选择需要审核的单据。')
        return
      }
      try {
        const response = await fetch(`/api/v6task-finance-task-012/documents/${encodeURIComponent(id)}/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: Boolean(approved) }),
        })
        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { message?: string }
          throw new Error(errorData.message || `审核操作失败（${response.status}）`)
        }
        await refresh()
      } catch (error) {
        const message = error instanceof Error ? error.message : '审核单据失败'
        window.alert(message)
      }
    }

    async function handleExport() {
      if (filteredItems.length === 0) {
        window.alert('当前没有可导出的开票单据。')
        return
      }

      const escapeCsv = (value: string): string =>
        value.includes(',') || value.includes('"') || value.includes('\n') ? `"${value.replace(/"/g, '""')}"` : value

      const header = businessColumns.map((col) => col.label).join(',')
      const rows = filteredItems.map((item) =>
        businessColumns
          .map((col) => {
            const value = (item as Record<string, unknown>)[col.key]
            return escapeCsv(value === null || value === undefined ? '' : String(value))
          })
          .join(','),
      )
      const csv = [header, ...rows].join('\n')
      const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `开票单据_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="v6task_finance_task_012">
      <header>
        <h1>单据智管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="单据智管理 form">
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
        <button type="submit">新增单据智</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无单据智，点击「新增单据智」创建</p>}

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

      {/* 开票统计概览 */}
            <section className="invoice-summary" aria-label="开票统计概览">
              <div className="summary-card">
                <span className="summary-label">开票总金额（元）</span>
                <span className="summary-value">
                  {filteredItems.reduce((sum, item) => {
                    const amount = Number((item as Record<string, unknown>).amount ?? 0)
                    return sum + (Number.isFinite(amount) ? amount : 0)
                  }, 0).toFixed(2)}
                </span>
              </div>
              <div className="summary-card">
                <span className="summary-label">开票单据数</span>
                <span className="summary-value">{filteredItems.length}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">待审核</span>
                <span className="summary-value">
                  {filteredItems.filter((item) => {
                    const status = String((item as Record<string, unknown>).status ?? '')
                    return status === 'pending' || status === '待审核' || status === 'PENDING'
                  }).length}
                </span>
              </div>
              <div className="summary-card">
                <span className="summary-label">已开票</span>
                <span className="summary-value">
                  {filteredItems.filter((item) => {
                    const status = String((item as Record<string, unknown>).status ?? '')
                    return status === 'issued' || status === '已开票' || status === 'ISSUED'
                  }).length}
                </span>
              </div>
            </section>

            {/* 单据智能生成 */}
            <section className="invoice-generation" aria-label="单据智能生成">
              <h2>单据智能生成</h2>
              <p>依据银行流水、合同信息与开票规则，自动生成待确认的开票单据。</p>
              <div className="generation-form">
                <label>
                  生成范围
                  <select name="generationScope" defaultValue="uninvoiced">
                    <option value="uninvoiced">未开票流水</option>
                    <option value="selected">当前筛选结果</option>
                    <option value="all">全部流水</option>
                  </select>
                </label>
                <label>
                  单据类型
                  <select name="documentType" defaultValue="vat_special">
                    <option value="vat_special">增值税专用发票</option>
                    <option value="vat_normal">增值税普通发票</option>
                    <option value="receipt">收款收据</option>
                  </select>
                </label>
                <label>
                  开票日期
                  <input type="date" name="invoiceDate" defaultValue={new Date().toISOString().slice(0, 10)} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const scope = (document.querySelector('select[name="generationScope"]') as HTMLSelectElement | null)?.value
                    const docType = (document.querySelector('select[name="documentType"]') as HTMLSelectElement | null)?.value
                    const invoiceDate = (document.querySelector('input[name="invoiceDate"]') as HTMLInputElement | null)?.value
                    fetch('/api/v6task-finance-task-012/generate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ scope, docType, invoiceDate }),
                    })
                      .then((response) => {
                        if (!response.ok) throw new Error('智能生成失败')
                        return response.json()
                      })
                      .then((result: { created?: number }) => {
                        window.alert(`已生成 ${result.created ?? 0} 张开票单据，请到开票列表中确认。`)
                        return refresh()
                      })
                      .catch((error) => window.alert(error instanceof Error ? error.message : '智能生成请求失败'))
                  }}
                >
                  开始智能生成
                </button>
              </div>
            </section>

            {/* 开票操作 */}
            <div className="invoice-actions">
              <button type="button" onClick={() => void handleExport()}>导出开票单据</button>
              <button type="button" onClick={() => void refresh()}>刷新列表</button>
            </div>
    </section>
  )
}
