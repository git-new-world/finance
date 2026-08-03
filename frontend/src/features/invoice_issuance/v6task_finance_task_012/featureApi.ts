import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  try {
    const response = await fetch('/api/v6task-finance-task-012', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to load invoice tasks: ${response.status} ${response.statusText}`)
    }
    const payload: unknown = await response.json()
    if (!Array.isArray(payload)) {
      throw new Error('Invalid invoice task list payload: expected an array.')
    }
    return payload.filter(
      (entry): entry is FeatureItem =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as FeatureItem).id === 'string' &&
        typeof (entry as FeatureItem).title === 'string' &&
        typeof (entry as FeatureItem).status === 'string' &&
        typeof (entry as FeatureItem).createdAt === 'string' &&
        typeof (entry as FeatureItem).updatedAt === 'string',
    )
  } catch (error) {
    console.error('[v6task-finance-task-012] loadFeatureItems failed:', error)
    return []
  }
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
