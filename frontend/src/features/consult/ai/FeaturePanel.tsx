import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function AiFeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'question', label: '咨询问题' },
        { key: 'answer', label: 'AI回复' },
        { key: 'status', label: '状态' },
        { key: 'createdAt', label: '创建时间' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  const [askError, setAskError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const apiPath = '/api/v6task-finance-task-016'

    async function handleAsk(): Promise<void> {
      const question = (form.question ?? '').trim()
      if (!question) {
        setAskError('请输入咨询问题')
        return
      }
      if (submitting) return
      setAskError(null)
      setSubmitting(true)
      try {
        const response = await fetch(apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'ask', question }),
        })
        if (!response.ok) {
          throw new Error(`AI咨询请求失败（${response.status} ${response.statusText}）`)
        }
        const data = (await response.json()) as { answer?: string; error?: string }
        if (data.error) {
          throw new Error(data.error)
        }
        if (!data.answer) {
          throw new Error('AI咨询未返回有效回答')
        }
        await createOrUpdate({
          question,
          answer: data.answer,
          status: '已完成',
        })
        setForm({})
        await refresh()
      } catch (error) {
        setAskError(error instanceof Error ? error.message : 'AI咨询失败，请稍后重试')
      } finally {
        setSubmitting(false)
      }
    }

    async function handleExportCsv(): Promise<void> {
      try {
        const escapeCsv = (value: string): string =>
          /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
        const header = businessColumns.map((col) => escapeCsv(col.label)).join(',')
        const rows = filteredItems.map((item) => {
          const record = item as Record<string, unknown>
          return businessColumns.map((col) => escapeCsv(String(record[col.key] ?? ''))).join(',')
        })
        const csv = [header, ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `ai-consult-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } catch (error) {
        setAskError(error instanceof Error ? error.message : '导出失败，请稍后重试')
      }
    }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="ai">
      <header>
        <h1>AI智管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="AI智管理 form">
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
        <button type="submit">新增AI智</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无AI智，点击「新增AI智」创建</p>}

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

      // business fields pending: UI_RENDER
    </section>
  )
}
