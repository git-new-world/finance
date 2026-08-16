import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const response = await fetch('/api/v6task-finance-task-005')
    if (!response.ok) {
      throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
    }
    const payload: unknown = await response.json()
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid feature items response.')
    }

    let items: unknown
    if (Array.isArray(payload)) {
      items = payload
    } else {
      const obj = payload as { items?: unknown; data?: unknown }
      items = obj.items ?? obj.data
    }

    if (!Array.isArray(items)) {
      throw new Error('Feature items response does not contain an array.')
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
