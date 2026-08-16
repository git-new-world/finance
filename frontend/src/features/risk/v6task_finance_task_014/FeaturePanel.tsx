import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask014FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'warningId', label: '预警编号' },
      { key: 'riskType', label: '风险类型' },
      { key: 'riskLevel', label: '风险等级' },
      { key: 'description', label: '预警内容' },
      { key: 'occurredAt', label: '发生时间' },
      { key: 'status', label: '处置状态' },
      { key: 'handler', label: '处置人' },
      { key: 'handleResult', label: '处置结果' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  // 处置风险预警：弹出处置结果输入框，校验后更新状态
    async function handleDispose(item: FeatureItem) {
      if (!item || typeof item !== 'object') return
      const current = item as Record<string, unknown>
      if (current.status === '已处置') {
        window.alert('该预警已处置，请勿重复操作')
        return
      }
      const result = window.prompt(`请输入「${String(current.description ?? current.warningId ?? '')}」的处置结果：`)
      if (result === null) return
      const trimmed = result.trim()
      if (!trimmed) {
        window.alert('处置结果不能为空')
        return
      }
      await createOrUpdate({
        ...current,
        status: '已处置',
        handledAt: new Date().toISOString(),
        handler: '当前用户',
        handleResult: trimmed,
      } as Record<string, string>)
      await refresh()
    }

    // 升级风险：标记为需上级关注
    async function handleEscalate(item: FeatureItem) {
      if (!item || typeof item !== 'object') return
      const current = item as Record<string, unknown>
      if (current.status === '已升级' || current.status === '已处置') {
        window.alert(`该预警已${current.status}，无法升级`)
        return
      }
      await createOrUpdate({
        ...current,
        status: '已升级',
        handledAt: new Date().toISOString(),
        handler: '当前用户',
        handleResult: '已升级至上级处理',
      } as Record<string, string>)
      await refresh()
    }

    // 导出风险预警 CSV
    function handleExport() {
      if (filteredItems.length === 0) {
        window.alert('当前没有可导出的风险预警')
        return
      }
      const headers = businessColumns.map((col) => col.label)
      const rows = filteredItems.map((item) => {
        const record = item as Record<string, unknown>
        return businessColumns.map((col) => {
          const value = record[col.key]
          if (value === null || value === undefined) return ''
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      })
      const csv = [headers.join(','), ...rows].join('\n')
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `风险预警_${new Date().toISOString().slice(0, 10)}.csv`
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
    <section className="feature-panel" data-feature="v6task_finance_task_014">
      <header>
        <h1>风险预警管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="风险预警管理 form">
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
        <button type="submit">新增风险预警</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无风险预警，点击「新增风险预警」创建</p>}

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

      {/* 风险预警处置面板：选中表格行后展示完整详情，并支持确认、处理、升级等处置动作 */}
            {state.selectedItem && (
              <section className="risk-disposal-panel" aria-label="风险预警详情与处置">
                <div className="risk-disposal-header">
                  <h2>风险预警处置</h2>
                </div>

                <dl className="risk-disposal-detail">
                  {businessColumns.map((col) => (
                    <div className="risk-disposal-field" key={col.key}>
                      <dt>{col.label}</dt>
                      <dd>{String((state.selectedItem as Record<string, unknown>)[col.key] ?? '-')}</dd>
                    </div>
                  ))}
                </dl>

                <div className="risk-disposal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      void (async () => {
                        const selectedItem = state.selectedItem
                        if (!selectedItem) return
                        await createOrUpdate({
                          ...(selectedItem as Record<string, unknown>),
                          handleStatus: '已确认',
                        })
                        await refresh()
                      })()
                    }}
                  >
                    确认风险
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void (async () => {
                        const selectedItem = state.selectedItem
                        if (!selectedItem) return
                        await createOrUpdate({
                          ...(selectedItem as Record<string, unknown>),
                          handleStatus: '处理中',
                          r: '当前用户',
                        })
                        await refresh()
                      })()
                    }}
                  >
                    开始处理
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void (async () => {
                        const selectedItem = state.selectedItem
                        if (!selectedItem) return
                        await createOrUpdate({
                          ...(selectedItem as Record<string, unknown>),
                          handleStatus: '已处理',
                          handleResult: '已处理完毕',
                          r: '当前用户',
                        })
                        await refresh()
                      })()
                    }}
                  >
                    标记已处理
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void (async () => {
                        const selectedItem = state.selectedItem
                        if (!selectedItem) return
                        await createOrUpdate({
                          ...(selectedItem as Record<string, unknown>),
                          handleStatus: '已升级',
                          handleResult: '已升级至上级处理',
                          r: '当前用户',
                        })
                        await refresh()
                      })()
                    }}
                  >
                    升级至上级
                  </button>
                  <button type="button" onClick={handleExport}>
                    导出CSV
                  </button>
                  <button type="button" onClick={() => void refresh()}>
                    刷新
                  </button>
                </div>
              </section>
            )}
    </section>
  )
}
