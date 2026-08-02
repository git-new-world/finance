import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureStatus } from './types'

const statusOptions: Array<FeatureStatus | 'all'> = ['all', 'draft', 'active', 'blocked', 'completed']

export default function V6taskFinanceTask005FeaturePanel() {
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
        // Hook state stores the error for display.
      }
    }
  return (
    <section className="feature-panel" data-feature="v6task_finance_task_005">
      <header>
        <h1>V6taskFinanceTask005</h1>
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

      <div className="report-panel">
              <h2>Reports</h2>
              <details>
                <summary>Standard Report</summary>
                <table>
                  <thead>
                    <tr><th>Status</th><th>Count</th></tr>
                  </thead>
                  <tbody>
                    {statusOptions.filter((option) => option !== 'all').map((option) => {
                      const count = filteredItems.filter((item) => item.status === option).length
                      return (
                        <tr key={option}>
                          <td>{option}</td>
                          <td>{count}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </details>
              <details>
                <summary>Custom Report</summary>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Title</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
              <details>
                <summary>Compare</summary>
                <div className="compare-grid">
                  <div>
                    <h3>Filtered Items</h3>
                    <ul>
                      {filteredItems.map((item) => (
                        <li key={item.id}>{item.title} ({item.status})</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Status Summary</h3>
                    <ul>
                      {statusOptions.filter((option) => option !== 'all').map((option) => (
                        <li key={option}>{option}: {filteredItems.filter((item) => item.status === option).length}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </details>
              <button type="button" onClick={() => {
                const rows = filteredItems.map((item) => [item.id, item.title, item.status])
                const csv = [
                  ['id', 'title', 'status'],
                  ...rows,
                ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('
')
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'v6task-finance-task-005-report.csv'
                link.click()
                URL.revokeObjectURL(url)
              }}>
                Export CSV
              </button>
            </div>
    </section>
  )
}
