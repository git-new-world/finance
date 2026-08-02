import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const API_PATH = '/api/v6task-finance-task-014'

    try {
      const response = await fetch(API_PATH, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        let message = `Failed to load feature items (${response.status})`
        try {
          const errorBody: unknown = await response.json()
          if (typeof errorBody === 'object' && errorBody !== null && 'message' in errorBody) {
            const candidate = (errorBody as Record<string, unknown>).message
            if (typeof candidate === 'string' && candidate.trim()) {
              message = candidate
            }
          }
        } catch {
          // Ignore response body parse errors.
        }
        throw new Error(message)
      }

      const data: unknown = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid response: expected an array of feature items.')
      }

      return data.map((item, index) => {
        if (typeof item !== 'object' || item === null) {
          throw new Error(`Invalid feature item at index ${index}: expected an object.`)
        }

        const record = item as Record<string, unknown>
        const id = typeof record.id === 'string' && record.id.trim() ? record.id : `item-${Date.now()}-${index}`
        const title = typeof record.title === 'string' ? record.title.trim() : ''
        if (!title) {
          throw new Error(`Invalid feature item at index ${index}: title is required.`)
        }

        const status = typeof record.status === 'string' ? record.status : 'draft'
        const createdAt = typeof record.createdAt === 'string' ? record.createdAt : now()
        const updatedAt = typeof record.updatedAt === 'string' ? record.updatedAt : createdAt

        return { id, title, status, createdAt, updatedAt } satisfies FeatureItem
      })
    } catch (error) {
      console.error('[v6task-finance-task-014] Failed to load feature items:', error)
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
