import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  try {
      const response = await fetch('/api/v6task-finance-task-005')

      if (!response.ok) {
        throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
      }

      const data: unknown = await response.json()

      if (!Array.isArray(data)) {
        throw new Error('Invalid feature items payload: expected an array.')
      }

      return data.map((item: unknown) => {
        if (!item || typeof item !== 'object') {
          throw new Error('Invalid feature item in payload.')
        }

        const record = item as Partial<FeatureItem>
        const timestamp = now()

        return {
          id: String(record.id ?? `item-${Date.now()}`),
          title: String(record.title ?? 'Untitled'),
          status: (record.status as FeatureItem['status']) ?? 'draft',
          createdAt: String(record.createdAt ?? timestamp),
          updatedAt: String(record.updatedAt ?? timestamp),
        }
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
