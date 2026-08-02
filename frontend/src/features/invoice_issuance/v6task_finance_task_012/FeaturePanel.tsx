import { FormEvent, useState } from 'react'
import { useFeatureState } from './useFeatureState'
import type { FeatureStatus } from './types'

const statusOptions: Array<FeatureStatus | 'all'> = ['all', 'draft', 'active', 'blocked', 'completed']

export default function V6taskFinanceTask012FeaturePanel() {
  const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<FeatureStatus>('draft')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      const trimmedTitle = title.trim()

      if (!trimmedTitle) {
        window.alert('Title is required.')
        return
      }

      try {
        await createOrUpdate({ title: trimmedTitle, status })
        setTitle('')
        setStatus('draft')
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Failed to save item.')
      }
    }
  return (
    <section className="feature-panel" data-feature="v6task_finance_task_012">
      <header>
        <h1>V6taskFinanceTask012</h1>
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

      export default function V6taskFinanceTask012FeaturePanel() {
        const { state, filteredItems, updateFilter, selectItem, createOrUpdate, refresh } = useFeatureState()
        const [title, setTitle] = useState('')
        const [status, setStatus] = useState<FeatureStatus>('draft')

        const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
            ...
          }
        return (
          <section className="feature-panel" data-feature="v6task_finance_task_012">
            ...
            <ul>
              ...
            </ul>



          </section>
        )
      }
    </section>
  )
}
