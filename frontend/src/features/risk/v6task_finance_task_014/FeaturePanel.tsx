import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureStatus } from './types'

const statusOptions: Array<FeatureStatus | 'all'> = ['all', 'draft', 'active', 'blocked', 'completed']

export default function V6taskFinanceTask014FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<FeatureStatus>('draft')

  const handleSubmit = async (event: FormEvent) => {
      event.preventDefault()
      const trimmedTitle = title.trim()
      if (trimmedTitle === '') {
          return
      }
      try {
          await createOrUpdate({ title: trimmedTitle, status })
          setTitle('')
          setStatus('draft')
      } catch (error) {
          console.error(error)
      }
  }
  return (
    <section className="feature-panel" data-feature="v6task_finance_task_014">
      <header>
        <h1>V6taskFinanceTask014</h1>
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

      {filteredItems.some((item) => item.status === 'blocked') && (
              <section className="risk-warnings" aria-label="Risk warnings">
                <h2>Risk Warnings</h2>
                <ul>
                  {filteredItems.filter((item) => item.status === 'blocked').map((item) => (
                    <li key={item.id}>
                      <span>{item.title}</span>
                      <button type="button" onClick={() => void createOrUpdate({ title: item.title, status: 'active' })}>
                        Dispose
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
    </section>
  )
}
