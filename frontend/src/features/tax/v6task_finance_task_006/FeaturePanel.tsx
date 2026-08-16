import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask006FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'taxPeriod', label: '税款所属期' },
        { key: 'taxType', label: '税种' },
        { key: 'taxableAmount', label: '计税金额' },
        { key: 'taxAmount', label: '应纳税额' },
        { key: 'deductionAmount', label: '减免税额' },
        { key: 'payableAmount', label: '应补（退）税额' },
        { key: 'status', label: '申报状态' },
        { key: 'declareAt', label: '申报时间' }
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  async function handleCalculate() {
      if (filteredItems.length === 0) {
        window.alert('没有可计算的报税记录')
        return
      }
      try {
        const response = await fetch('/api/v6task-finance-task-006/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: filteredItems.map((item) => item.id) }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.detail || `计算失败（${response.status}）`)
        }
        const result = await response.json()
        await refresh()
        if (result.message) {
          window.alert(result.message)
        }
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '计算失败，请稍后重试')
      }
    }

    async function handleDeclare() {
      if (filteredItems.length === 0) {
        window.alert('没有可申报的报税记录')
        return
      }
      if (!window.confirm(`确认对 ${filteredItems.length} 条记录进行一键申报？`)) {
        return
      }
      try {
        const response = await fetch('/api/v6task-finance-task-006/declare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: filteredItems.map((item) => item.id) }),
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.detail || `申报失败（${response.status}）`)
        }
        const result = await response.json()
        await refresh()
        if (result.message) {
          window.alert(result.message)
        }
      } catch (error) {
        window.alert(error instanceof Error ? error.message : '申报失败，请稍后重试')
      }
    }

    function handleExport() {
      if (filteredItems.length === 0) {
        window.alert('没有可导出的报税记录')
        return
      }
      const headers = businessColumns.map((col) => col.label).join(',')
      const rows = filteredItems.map((item) =>
        businessColumns
          .map((col) => {
            const value = (item as Record<string, unknown>)[col.key]
            const text = value === null || value === undefined ? '' : String(value)
            return text.includes(',') || text.includes('"') ? `"${text.replace(/"/g, '""')}"` : text
          })
          .join(','),
      )
      const csv = [headers, ...rows].join('\n')
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `报税全流_${new Date().toISOString().slice(0, 10)}.csv`
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
    <section className="feature-panel" data-feature="v6task_finance_task_006">
      <header>
        <h1>报税全流管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="报税全流管理 form">
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
        <button type="submit">新增报税全流</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无报税全流，点击「新增报税全流」创建</p>}

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

      <div className="tax-workbench" role="region" aria-label="智能报税工作台">
              {(() => {
                const recordList = filteredItems as Array<Record<string, unknown>>
                const keyOf = (pattern: RegExp) => businessColumns.find((column) => pattern.test(column.label))?.key
                const statusKey = keyOf(/状态/) ?? 'status'
                const taxableKey = keyOf(/应纳税所得额|计税依据/) ?? 'taxableAmount'
                const taxPayableKey = keyOf(/应纳税额/) ?? 'taxPayable'
                const paidTaxKey = keyOf(/已缴税额|实缴税额/) ?? 'paidTax'
                const dueTaxKey = keyOf(/应补(退)?税额|应补税额/) ?? 'taxDue'
                const getNumber = (item: Record<string, unknown>, key: string) => {
                  const raw = item[key]
                  if (typeof raw === 'number') {
                    return Number.isFinite(raw) ? raw : 0
                  }
                  const numeric = Number(String(raw ?? '').replace(/[,，]/g, '').replace(/[^\d.-]/g, ''))
                  return Number.isFinite(numeric) ? numeric : 0
                }
                const totalTaxable = recordList.reduce((sum, item) => sum + getNumber(item, taxableKey), 0)
                const totalTaxPayable = recordList.reduce((sum, item) => sum + getNumber(item, taxPayableKey), 0)
                const totalPaidTax = recordList.reduce((sum, item) => sum + getNumber(item, paidTaxKey), 0)
                const totalDueTax = recordList.reduce((sum, item) => sum + getNumber(item, dueTaxKey), 0)
                const pendingCount = recordList.filter((item) => {
                  const status = String(item[statusKey] ?? '')
                  return status.includes('待申报') || status.includes('未申报') || status.includes('草稿') || status === ''
                }).length
                const submittedCount = recordList.length - pendingCount

                const handleCalculate = async () => {
                  if (recordList.length === 0) {
                    window.alert('暂无可计算的报税记录')
                    return
                  }
                  try {
                    const response = await fetch('/api/v6task-finance-task-006/calculate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ids: recordList.map((item) => String(item.id)) }),
                    })
                    if (!response.ok) {
                      throw new Error('计算失败，请稍后重试')
                    }
                    const data = (await response.json()) as { message?: string; taxAmount?: number }
                    window.alert(data.message ?? `计算完成，本期应纳税额 ${data.taxAmount ?? totalTaxPayable} 元`)
                    await refresh()
                  } catch (error) {
                    window.alert(error instanceof Error ? error.message : '计算失败，请稍后重试')
                  }
                }

                const handleOneClickDeclaration = async () => {
                  if (recordList.length === 0) {
                    window.alert('暂无可申报的报税记录')
                    return
                  }
                  if (!window.confirm(`确认对 ${pendingCount} 条待申报记录发起一键申报？`)) {
                    return
                  }
                  try {
                    const pendingIds = recordList
                      .filter((item) => {
                        const status = String(item[statusKey] ?? '')
                        return status.includes('待申报') || status.includes('未申报') || status.includes('草稿') || status === ''
                      })
                      .map((item) => String(item.id))
                    const response = await fetch('/api/v6task-finance-task-006/submit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ids: pendingIds }),
                    })
                    if (!response.ok) {
                      throw new Error('申报失败，请稍后重试')
                    }
                    const data = (await response.json()) as { message?: string; successCount?: number }
                    window.alert(data.message ?? `申报成功，共提交 ${data.successCount ?? 0} 条`)
                    await refresh()
                  } catch (error) {
                    window.alert(error instanceof Error ? error.message : '申报失败，请稍后重试')
                  }
                }

                return (
                  <div className="workbench-container">
                    <div className="workbench-header">
                      <div>
                        <h2>智能报税工作台</h2>
                        <p>从自动计税到一键申报，全流程留痕可追溯</p>
                      </div>
                      <div className="workbench-actions">
                        <button type="button" onClick={() => void refresh()}>刷新数据</button>
                        <button type="button" onClick={handleExport}>导出申报表</button>
                      </div>
                    </div>

                    <div className="metric-grid">
                      <div className="metric-card">
                        <span>待申报笔数</span>
                        <strong>{pendingCount}</strong>
                      </div>
                      <div className="metric-card">
                        <span>应纳税所得额</span>
                        <strong>¥ {totalTaxable.toFixed(2)}</strong>
                      </div>
                      <div className="metric-card">
                        <span>应纳税额</span>
                        <strong>¥ {totalTaxPayable.toFixed(2)}</strong>
                      </div>
                      <div className="metric-card">
                        <span>已缴税额</span>
                        <strong>¥ {totalPaidTax.toFixed(2)}</strong>
                      </div>
                      <div className="metric-card">
                        <span>应补（退）税额</span>
                        <strong>¥ {totalDueTax.toFixed(2)}</strong>
                      </div>
                      <div className="metric-card">
                        <span>已申报笔数</span>
                        <strong>{submittedCount}</strong>
                      </div>
                    </div>

                    <ol className="tax-workflow-steps">
                      <li className={recordList.length > 0 ? 'is-done' : ''}>
                        <span>1</span>
                        <div><strong>数据准备</strong><small>银行流水/发票/进项销项</small></div>
                      </li>
                      <li className={recordList.length > 0 ? 'is-done' : ''}>
                        <span>2</span>
                        <div><strong>自动计税</strong><small>按税种和所属期汇总计算</small></div>
                      </li>
                      <li className={pendingCount > 0 ? 'is-active' : 'is-done'}>
                        <span>3</span>
                        <div><strong>人工复核</strong><small>确认税额与申报表明细</small></div>
                      </li>
                      <li className={pendingCount === 0 && submittedCount > 0 ? 'is-done' : ''}>
                        <span>4</span>
                        <div><strong>一键申报</strong><small>批量提交至电子税务局</small></div>
                      </li>
                    </ol>

                    <div className="declaration-panel">
                      <div className="declaration-tip">
                        <strong>一键申报说明</strong>
                        <span>系统将按税种、所属期汇总本期应补（退）税额，并生成申报表提交。</span>
                      </div>
                      <button type="button" className="primary-declare" onClick={() => void handleOneClickDeclaration()} disabled={pendingCount === 0}>
                        立即一键申报
                      </button>
                      <button type="button" onClick={() => void handleCalculate()}>重新计算税额</button>
                    </div>
                  </div>
                )
              })()}
            </div>
    </section>
  )
}
