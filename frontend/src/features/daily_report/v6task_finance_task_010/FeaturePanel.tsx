import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureStatus } from './types'

const statusOptions: Array<FeatureStatus | 'all'> = ['all', 'draft', 'active', 'blocked', 'completed']

export default function V6taskFinanceTask010FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<FeatureStatus>('draft')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const trimmedTitle = title.trim()
      if (!trimmedTitle) {
        return
      }
      try {
        await createOrUpdate({ title: trimmedTitle, status })
        setTitle('')
        setStatus('draft')
      } catch {
        // The hook exposes state.error when the API request fails.
      }
    }
  return (
    <section className="feature-panel" data-feature="v6task_finance_task_010">
      <header>
        <h1>V6taskFinanceTask010</h1>
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

      <div className="daily-report">
              <h2>银行余额日报</h2>
              <table>
                <thead>
                  <tr>
                    <th>账户名称</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" onClick={() => {
                const header = ['账户名称', '状态']
                const rows = filteredItems.map((item) => [item.title, item.status])
                const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
                const csv = [header, ...rows].map((row) => row.map(escape).join(',')).join('
')
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'bank-balance-daily-report.csv'
                link.click()
                setTimeout(() => URL.revokeObjectURL(url), 0)
              }}>导出 CSV</button>
            </div>
    </section>
  )
}
