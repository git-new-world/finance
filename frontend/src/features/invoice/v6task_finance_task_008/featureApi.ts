import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const response = await fetch('/api/v6task-finance-task-008', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`Failed to load feature items: HTTP ${response.status} ${response.statusText}`)
    }

    const payload: unknown = await response.json()
    const isObject = payload !== null && typeof payload === 'object'
    const maybeItems = Array.isArray(payload)
      ? payload
      : isObject && 'items' in payload
        ? (payload as { items: unknown }).items
        : isObject && 'data' in payload
          ? (payload as { data: unknown }).data
          : undefined

    if (!Array.isArray(maybeItems)) {
      throw new Error('Invalid feature item response: expected an array of feature items.')
    }

    return maybeItems as FeatureItem[]
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
