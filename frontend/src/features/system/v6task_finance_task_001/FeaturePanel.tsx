import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask001FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'paramName', label: '参数名称' },
        { key: 'paramKey', label: '参数键' },
        { key: 'paramValue', label: '参数值' },
        { key: 'sourceType', label: '数据源类型' },
        { key: 'sourceName', label: '数据源名称' },
        { key: 'connectionStatus', label: '连接状态' },
        { key: 'operationType', label: '操作类型' },
        { key: 'operator', label: '操作人' },
        { key: 'operationTime', label: '操作时间' },
        { key: 'operationResult', label: '操作结果' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  // 导出当前筛选结果（CSV）
    function handleExport() {
      if (filteredItems.length === 0) {
        window.alert('暂无可导出的配置数据')
        return
      }
      const header = businessColumns.map((col) => col.label).join(',')
      const rows = filteredItems.map((item) =>
        businessColumns
          .map((col) => `"${String((item as Record<string, unknown>)[col.key] ?? '').replace(/"/g, '""')}"`)
          .join(','),
      )
      const csv = [header, ...rows].join('\n')
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `系统管理配置_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    // 测试外部数据源连接
    async function handleTestConnection() {
      const sourceId = form.sourceId || form.sourceName
      if (!sourceId) {
        window.alert('请先选择或输入要测试的数据源名称/ID')
        return
      }
      try {
        const response = await fetch('/api/v6task-finance-task-001/test-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sourceId }),
        })
        if (!response.ok) {
          throw new Error(`连接测试失败：${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        window.alert(data.message || '数据源连接正常')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '数据源连接异常')
      }
    }

    // 同步操作日志（拉取最新审计记录）
    async function handleSyncLogs() {
      try {
        await refresh()
        window.alert('操作日志已同步')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '操作日志同步失败')
      }
    }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="v6task_finance_task_001">
      <header>
        <h1>完成管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="完成管理 form">
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
        <button type="submit">新增完成</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无完成，点击「新增完成」创建</p>}

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

      return (
          <section className="feature-panel" data-feature="v6task_finance_task_001">
            <header>
              <h1>完成管理</h1>
            </header>

            <form onSubmit={handleSubmit} aria-label="完成管理 form">
            </form>

            <div className="feature-toolbar">
            </div>

            {state.loading && <p role="status">Loading...</p>}
            {state.error && <p role="alert">{state.error}</p>}
            {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无完成，点击「新增完成」创建</p>}

            <table>
            </table>

            </section>
        )
    </section>
  )
}
