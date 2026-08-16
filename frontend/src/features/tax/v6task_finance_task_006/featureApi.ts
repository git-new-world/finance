import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const response = await fetch('/api/v6task-finance-task-006', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new Error('Invalid response: expected JSON.')
    }

    let items: FeatureItem[] | null = null
    if (Array.isArray(payload)) {
      items = payload as FeatureItem[]
    } else if (payload && typeof payload === 'object') {
      const record = payload as { items?: unknown; data?: unknown }
      if (Array.isArray(record.items)) {
        items = record.items as FeatureItem[]
      } else if (Array.isArray(record.data)) {
        items = record.data as FeatureItem[]
      } else if (record.data && typeof record.data === 'object') {
        const nested = record.data as { items?: unknown }
        if (Array.isArray(nested.items)) {
          items = nested.items as FeatureItem[]
        }
      }
    }

    if (!items) {
      throw new Error('Invalid response: items array is missing.')
    }

    return items
}

export async function saveFeatureItem(input: Partial<FeatureItem>): Promise<FeatureActionResult> {
  if (!input.title || !String(input.title).trim()) {
    return { ok: false, message: 'Title is required.' }
  }
  const item: FeatureItem = {
    id: input.id || `item-${Date.now()}`,
    title: String(input.title).trim(),
    status: input.status || 'draft',
    createdAt: input.createdAt || now(),
    updatedAt: now(),
  }
  return { ok: true, message: 'Saved successfully.', item }
}
