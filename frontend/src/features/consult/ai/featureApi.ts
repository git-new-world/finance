import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const response = await fetch('/api/v6task-finance-task-016', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Failed to load AI consultation features: ${response.status} ${response.statusText}`)
    }

    const payload: unknown = await response.json()
    const items = Array.isArray(payload)
      ? payload
      : payload && typeof payload === 'object' && Array.isArray((payload as { items?: unknown }).items)
        ? (payload as { items: unknown[] }).items
        : null

    if (!items) {
      throw new Error('Invalid AI consultation API response: expected an array or { items: [...] }.')
    }

    return items as FeatureItem[]
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
