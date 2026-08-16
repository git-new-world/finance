import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function Page001Page002Page003Page004ApiFeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'streamId', label: '银行流水号' },
      { key: 'transactionDate', label: '交易日期' },
      { key: 'summary', label: '摘要' },
      { key: 'amount', label: '金额' },
      { key: 'direction', label: '借贷方向' },
      { key: 'voucherNo', label: '凭证号' },
      { key: 'voucherStatus', label: '凭证状态' },
      { key: 'reviewStatus', label: '审核状态' },
      { key: 'reviewer', label: '审核人' },
      { key: 'reviewedAt', label: '审核时间' },
      { key: 'createdAt', label: '创建时间' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  // business fields pending: UI_RENDER
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="page-001_page-002_page-003_page-004_api">
      <header>
        <h1>全生命周管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="全生命周管理 form">
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
        <button type="submit">新增全生命周</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无全生命周，点击「新增全生命周」创建</p>}

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

      pass  # REGION_FILL_FAILED
    </section>
  )
}
