import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask010FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'reportDate', label: '报表日期' },
        { key: 'bankName', label: '银行名称' },
        { key: 'accountNo', label: '银行账号' },
        { key: 'currency', label: '币种' },
        { key: 'openingBalance', label: '期初余额' },
        { key: 'debitAmount', label: '借方发生额' },
        { key: 'creditAmount', label: '贷方发生额' },
        { key: 'closingBalance', label: '期末余额' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  function handleExport() {
      const rows = filteredItems as Array<Record<string, unknown>>
      if (rows.length === 0) {
        window.alert('没有可导出的余额日报数据')
        return
      }

      const escapeCsv = (value: unknown): string => {
        const text = String(value ?? '')
        return `"${text.replace(/"/g, '""')}"`
      }

      const header = businessColumns.map((column) => column.label).join(',')
      const body = rows.map((row) =>
        businessColumns.map((column) => escapeCsv(row[column.key])).join(','),
      )
      const csv = `\uFEFF${[header, ...body].join('\r\n')}`
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `银行余额日报_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
    }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="v6task_finance_task_010">
      <header>
        <h1>余额日报管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="余额日报管理 form">
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
        <button type="submit">新增余额日报</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无余额日报，点击「新增余额日报」创建</p>}

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

      <div className="daily-report-overview">
              <div className="overview-header">
                <h2>银行余额日报</h2>
                <div className="overview-actions">
                  <button type="button" className="export-button" onClick={handleExport} aria-label="导出银行余额日报 CSV">
                    导出 CSV
                  </button>
                </div>
              </div>
              <div className="overview-grid">
                {(() => {
                  const rows = filteredItems as Array<Record<string, unknown>>
                  const findKey = (labelPattern: RegExp) =>
                    businessColumns.find((column) => labelPattern.test(column.label))?.key
                  const dateKey = findKey(/日期|date/i)
                  const accountKey = findKey(/账户|账号|account/i)
                  const openingKey = findKey(/期初|opening/i)
                  const debitKey = findKey(/支出|借方|debit/i)
                  const creditKey = findKey(/收入|贷方|credit/i)
                  const closingKey = findKey(/期末|closing/i)
                  const sum = (key: string | undefined) =>
                    rows.reduce((total, row) => total + (typeof key === 'string' ? Number(row[key]) || 0 : 0), 0)
                  const latestDate = rows.reduce((latest, row) => {
                    const value = dateKey ? String(row[dateKey] ?? '') : ''
                    return value > latest ? value : latest
                  }, '')
                  const accountNumbers = new Set(
                    rows.map((row) => (accountKey ? String(row[accountKey] ?? '') : '')).filter(Boolean),
                  )
                  const formatMoney = (value: number) =>
                    new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value)
                  return (
                    <>
                      <div className="overview-card">
                        <span className="overview-label">日期</span>
                        <strong>{latestDate || '未生成'}</strong>
                      </div>
                      <div className="overview-card">
                        <span className="overview-label">账户数</span>
                        <strong>{accountNumbers.size || rows.length}</strong>
                      </div>
                      <div className="overview-card">
                        <span className="overview-label">期初余额</span>
                        <strong>{formatMoney(sum(openingKey))}</strong>
                      </div>
                      <div className="overview-card">
                        <span className="overview-label">本期收入</span>
                        <strong>{formatMoney(sum(creditKey))}</strong>
                      </div>
                      <div className="overview-card">
                        <span className="overview-label">本期支出</span>
                        <strong>{formatMoney(sum(debitKey))}</strong>
                      </div>
                      <div className="overview-card">
                        <span className="overview-label">期末余额</span>
                        <strong>{formatMoney(sum(closingKey))}</strong>
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
    </section>
  )
}
