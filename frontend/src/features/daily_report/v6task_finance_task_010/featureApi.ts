import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  try {
      const response = await fetch('/api/v6task-finance-task-010', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
      }
      const data: unknown = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array of feature items.')
      }
      return data.map((item, index) => {
        if (!item || typeof item !== 'object') {
          throw new Error(`Invalid feature item at index ${index}: expected an object.`)
        }
        const record = item as Record<string, unknown>
        if (typeof record.title !== 'string' || !record.title.trim()) {
          throw new Error(`Invalid feature item at index ${index}: "title" is required.`)
        }
        return {
          id: String(record.id ?? `item-${Date.now()}-${index}`),
          title: record.title.trim(),
          status: typeof record.status === 'string' ? record.status : 'draft',
          createdAt: typeof record.createdAt === 'string' ? record.createdAt : now(),
          updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : now(),
        } as FeatureItem
      })
    } catch (error) {
      console.error('loadFeatureItems failed:', error)
      throw error
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
