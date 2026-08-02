import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const response = await fetch('/api/v6task-finance-task-008')
  if (!response.ok) {
    throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  const items = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(items)) {
    throw new Error('Invalid response format: expected feature item array')
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
