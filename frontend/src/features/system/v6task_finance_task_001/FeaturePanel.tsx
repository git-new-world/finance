import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureStatus } from './types'

const statusOptions: Array<FeatureStatus | 'all'> = ['all', 'draft', 'active', 'blocked', 'completed']

export default function V6taskFinanceTask001FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<FeatureStatus>('draft')

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()
      const trimmedTitle = title.trim()
      if (!trimmedTitle) {
        return
      }

      void createOrUpdate({ title: trimmedTitle, status })
      setTitle('')
      setStatus('draft')
    }
  return (
    <section className="feature-panel" data-feature="v6task_finance_task_001">
      <header>
        <h1>V6taskFinanceTask001</h1>
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

      {state.selectedItem && (
              <div className="detail-panel">
                <h2>Configuration</h2>
                <div className="detail-grid">
                  <section>
                    <h3>System Parameters</h3>
                    <ul>
                      {(state.selectedItem.parameters ?? []).map((param: { key: string; value: string }) => (
                        <li key={param.key}>{param.key}: {param.value}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3>External Data Sources</h3>
                    <ul>
                      {(state.selectedItem.dataSources ?? []).map((source: { id: string; name: string }) => (
                        <li key={source.id}>{source.name}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3>Operation Logs</h3>
                    <ul>
                      {(state.selectedItem.logs ?? []).map((log: { id: string; message: string; createdAt: string }) => (
                        <li key={log.id}>{log.message} <time>{log.createdAt}</time></li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>
            )}
    </section>
  )
}
