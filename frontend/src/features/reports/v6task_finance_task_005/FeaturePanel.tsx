import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureItem } from './types'

export default function V6taskFinanceTask005FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [form, setForm] = useState<Record<string, string>>({})
  // 例如银行余额日报: { key: 'bankBalance', label: '银行余额' }
  const businessFields: Array<{ key: string; label: string; type?: string }> = [
    // business fields pending: BUSINESS_FIELDS
  ]
  // 例如 { key: 'bankName', label: '银行名称' }
  const businessColumns: Array<{ key: string; label: string }> = [
    { key: 'reportCode', label: '报表编码' },
    { key: 'reportName', label: '报表名称' },
    { key: 'reportType', label: '报表类型' },
    { key: 'reportPeriod', label: '报表期间' },
    { key: 'compareStatus', label: '对比状态' },
    { key: 'status', label: '状态' },
    { key: 'updatedAt', label: '更新时间' },
  ]
  // 勿用通用 Feature 逻辑。handleSubmit 已由骨架提供（走 createOrUpdate），
  // 在此定义业务专属动作（handleExport/handleAudit 等）并可在 UI_RENDER 挂载。
  const [reportDetail, setReportDetail] = useState<Record<string, unknown> | null>(null)
    const [compareResult, setCompareResult] = useState<Array<Record<string, unknown>> | null>(null)
    const [exportingId, setExportingId] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const [actionSuccess, setActionSuccess] = useState<string | null>(null)
    const reportApiPath = '/api/v6task-finance-task-005'

    function findSelectedItem(): FeatureItem | undefined {
      const selectedId = (state as { selectedId?: string | number }).selectedId
      if (selectedId === undefined || selectedId === null) {
        return filteredItems[0]
      }
      return filteredItems.find((item) => String(item.id) === String(selectedId))
    }

    async function handleViewReport(item?: FeatureItem): Promise<void> {
      const target = item ?? findSelectedItem()
      if (!target) {
        setActionError('当前没有可查看的报表')
        return
      }
      const id = String(target.id)
      setActionError(null)
      setActionSuccess(null)
      try {
        const response = await fetch(`${reportApiPath}/view?id=${encodeURIComponent(id)}`, {
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) {
          const errorText = await response.text().catch(() => '')
          throw new Error(errorText || `查看报表失败（${response.status}）`)
        }
        const data = (await response.json()) as {
          item?: Record<string, unknown>
          report?: Record<string, unknown>
          detail?: Record<string, unknown>
        }
        setReportDetail(data.item ?? data.report ?? data.detail ?? data)
        setActionSuccess(`报表「${String((target as Record<string, unknown>).reportName ?? id)}」加载成功`)
      } catch (error) {
        setActionError(error instanceof Error ? error.message : '查看报表失败')
      }
    }

    async function handleGenerateReport(values: Record<string, string> = form): Promise<void> {
      const reportName = values.reportName?.trim()
      const reportType = values.reportType?.trim()
      const reportPeriod = values.reportPeriod?.trim()
      if (!reportName || !reportType || !reportPeriod) {
        setActionError('报表名称、报表类型、报表期间为必填项')
        return
      }
      setActionError(null)
      setActionSuccess(null)
      try {
        const response = await fetch(reportApiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reportName, reportType, reportPeriod }),
        })
        if (!response.ok) {
          const errorText = await response.text().catch(() => '')
          throw new Error(errorText || `生成报表失败（${response.status}）`)
        }
        await refresh()
        setActionSuccess(`报表「${reportName}」生成成功`)
      } catch (error) {
        setActionError(error instanceof Error ? error.message : '生成报表失败')
      }
    }

    async function handleCompareReports(first?: FeatureItem, second?: FeatureItem): Promise<void> {
      const selectedItem = findSelectedItem()
      const firstTarget = first ?? selectedItem
      const secondTarget = second ?? filteredItems.find((item) => item.id !== firstTarget?.id)
      if (!firstTarget || !secondTarget) {
        setActionError('对比至少需要两份报表')
        return
      }
      setActionError(null)
      setActionSuccess(null)
      setCompareResult(null)
      try {
        const response = await fetch(`${reportApiPath}/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstId: String(firstTarget.id), secondId: String(secondTarget.id) }),
        })
        if (!response.ok) {
          const errorText = await response.text().catch(() => '')
          throw new Error(errorText || `报表对比失败（${response.status}）`)
        }
        const data = (await response.json()) as {
          differences?: Array<Record<string, unknown>>
          items?: Array<Record<string, unknown>>
        }
        setCompareResult(data.differences ?? data.items ?? [])
        setActionSuccess('报表对比完成')
      } catch (error) {
        setActionError(error instanceof Error ? error.message : '报表对比失败')
      }
    }

    async function handleExportReport(item?: FeatureItem): Promise<void> {
      const target = item ?? findSelectedItem()
      if (!target) {
        setActionError('当前没有可导出的报表')
        return
      }
      const id = String(target.id)
      setExportingId(id)
      setActionError(null)
      setActionSuccess(null)
      try {
        const response = await fetch(`${reportApiPath}/export?id=${encodeURIComponent(id)}`, {
          headers: { Accept: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        })
        if (!response.ok) {
          const errorText = await response.text().catch(() => '')
          throw new Error(errorText || `导出报表失败（${response.status}）`)
        }
        const disposition = response.headers.get('Content-Disposition') ?? ''
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/)
        const filename = filenameMatch?.[1] ?? `report-${id}.csv`
        const blob = await response.blob()
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(downloadUrl)
        setActionSuccess(`报表「${String((target as Record<string, unknown>).reportName ?? id)}」导出成功`)
      } catch (error) {
        setActionError(error instanceof Error ? error.message : '导出报表失败')
      } finally {
        setExportingId(null)
      }
    }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createOrUpdate({ ...form })
    setForm({})
  }

  return (
    <section className="feature-panel" data-feature="v6task_finance_task_005">
      <header>
        <h1>标准报表管理</h1>
      </header>

      <form onSubmit={handleSubmit} aria-label="标准报表管理 form">
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
        <button type="submit">新增标准报表</button>
        <button type="button" onClick={() => void refresh()}>Refresh</button>
      </form>

      <div className="feature-toolbar">
        <input value={state.filter.keyword} onChange={(event) => updateFilter({ keyword: event.target.value })} placeholder="Search" />
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {!state.loading && !state.error && filteredItems.length === 0 && <p>暂无标准报表，点击「新增标准报表」创建</p>}

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

      {actionError && <p className="action-error" role="alert">{actionError}</p>}
            {actionSuccess && <p className="action-success" role="status">{actionSuccess}</p>}

            {/* 自定义报表设计 */}
            <section className="report-designer" aria-label="自定义报表设计">
              <h2>自定义报表设计</h2>
              <form
                className="report-designer-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  void createOrUpdate({ ...form, reportSource: 'custom' })
                }}
              >
                <div className="form-grid">
                  <label>
                    报表名称
                    <input
                      name="reportName"
                      value={form['reportName'] ?? ''}
                      onChange={(event) => setForm({ ...form, reportName: event.target.value })}
                    />
                  </label>
                  <label>
                    报表类型
                    <select
                      name="reportType"
                      value={form['reportType'] ?? 'balance_sheet'}
                      onChange={(event) => setForm({ ...form, reportType: event.target.value })}
                    >
                      <option value="balance_sheet">资产负债表</option>
                      <option value="income_statement">利润表</option>
                      <option value="cash_flow_statement">现金流量表</option>
                    </select>
                  </label>
                  <label>
                    起始期间
                    <input
                      type="date"
                      name="startDate"
                      value={form['startDate'] ?? ''}
                      onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                    />
                  </label>
                  <label>
                    结束期间
                    <input
                      type="date"
                      name="endDate"
                      value={form['endDate'] ?? ''}
                      onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                    />
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="includeDetails"
                      checked={String(form['includeDetails'] ?? 'false') === 'true'}
                      onChange={(event) => setForm({ ...form, includeDetails: event.target.checked ? 'true' : 'false' })}
                    />
                    包含明细科目
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="comparePreviousPeriod"
                      checked={String(form['comparePreviousPeriod'] ?? 'false') === 'true'}
                      onChange={(event) => setForm({ ...form, comparePreviousPeriod: event.target.checked ? 'true' : 'false' })}
                    />
                    对比上期
                  </label>
                  <label>
                    输出格式
                    <select
                      name="format"
                      value={form['format'] ?? 'csv'}
                      onChange={(event) => setForm({ ...form, format: event.target.value })}
                    >
                      <option value="csv">CSV</option>
                      <option value="xlsx">Excel</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit">生成自定义报表</button>
                  <button type="button" onClick={() => void refresh()}>重新加载</button>
                </div>
              </form>
            </section>

            {/* 最近生成的报表列表 */}
            <section className="custom-report-list" aria-label="最近生成的报表">
              <h2>最近生成的报表</h2>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>报表名称</th>
                      <th>报表类型</th>
                      <th>开始期间</th>
                      <th>结束期间</th>
                      <th>含明细</th>
                      <th>对比上期</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const record = item as Record<string, unknown>
                      const reportType = String(record.reportType ?? 'balance_sheet')
                      const typeLabel =
                        reportType === 'income_statement' ? '利润表' :
                        reportType === 'cash_flow_statement' ? '现金流量表' : '资产负债表'
                      return (
                        <tr key={String(record.id)} onClick={() => void selectItem(String(record.id))}>
                          <td>{String(record.reportName ?? '未命名报表')}</td>
                          <td>{typeLabel}</td>
                          <td>{String(record.startDate ?? '')}</td>
                          <td>{String(record.endDate ?? '')}</td>
                          <td>{String(record.includeDetails === true || record.includeDetails === 'true' ? '是' : '否')}</td>
                          <td>{String(record.comparePreviousPeriod === true || record.comparePreviousPeriod === 'true' ? '是' : '否')}</td>
                          <td>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                void handleExport(String(record.id))
                              }}
                            >
                              {exportingId === String(record.id) ? '正在导出' : '导出'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {filteredItems.length === 0 && (
                      <tr><td colSpan={7}>暂无报表，请先生成自定义报表</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 报表预览与对比 */}
            <section className="report-preview-comparison" aria-label="报表预览与对比">
              <h2>报表预览与对比</h2>
              {form['reportName'] || form['id'] ? (
                <div className="report-comparison-grid">
                  <div className="report-current">
                    <h3>当前报表：{String(form['id'] ?? form['reportName'] ?? '未命名')}</h3>
                    <table>
                      <thead>
                        <tr>{businessColumns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
                      </thead>
                      <tbody>
                        <tr>
                          {businessColumns.map((col) => (
                            <td key={col.key}>{String((form as Record<string, unknown>)[col.key] ?? '')}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="report-compare-target">
                    <label>
                      选择对比报表
                      <select
                        name="compareToId"
                        value={form['compareToId'] ?? ''}
                        onChange={(event) => setForm({ ...form, compareToId: event.target.value })}
                      >
                        <option value="">请选择</option>
                        {filteredItems
                          .filter((item) => String(item.id) !== String(form['id'] ?? ''))
                          .map((item) => (
                            <option key={String(item.id)} value={String(item.id)}>
                              {String((item as Record<string, unknown>).reportName ?? (item as Record<string, unknown>).id)}
                            </option>
                          ))}
                      </select>
                    </label>
                    {(() => {
                      const target = filteredItems.find((item) => String(item.id) === form['compareToId'])
                      if (!target) return <p>请选择要对比的报表</p>
                      return (
                        <table>
                          <thead>
                            <tr>{businessColumns.map((col) => <th key={col.key}>{col.label}</th>)}</tr>
                          </thead>
                          <tbody>
                            <tr>
                              {businessColumns.map((col) => (
                                <td key={col.key}>{String((target as Record<string, unknown>)[col.key] ?? '')}</td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      )
                    })()}
                  </div>
                </div>
              ) : (
                <p>点击表格行或在自定义报表设计后预览报表数据</p>
              )}
            </section>
    </section>
  )
}
