import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const API_PATH = '/api/v6task-finance-task-010'

    const response = await fetch(`${API_PATH}/items`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()
    const payload: { items?: FeatureItem[] } | null = text ? JSON.parse(text) : null

    if (!payload || !Array.isArray(payload.items)) {
      throw new Error('Invalid response payload from feature items API.')
    }

    return payload.items
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
