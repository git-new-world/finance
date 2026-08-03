import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const API_PATH = '/api/v6task-finance-task-006'
    try {
      const response = await fetch(API_PATH, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
      }

      const payload: unknown = await response.json()
      const list: unknown = Array.isArray(payload) ? payload : (payload as { items?: unknown })?.items

      if (!Array.isArray(list)) {
        throw new Error('Invalid feature items response format.')
      }

      return list.map((entry, index) => {
        if (typeof entry !== 'object' || entry === null) {
          throw new Error(`Invalid feature item at index ${index}.`)
        }

        const raw = entry as Record<string, unknown>
        if (typeof raw.id !== 'string' || typeof raw.title !== 'string') {
          throw new Error(`Invalid feature item at index ${index}: id and title are required.`)
        }

        return {
          id: raw.id,
          title: raw.title,
          status: typeof raw.status === 'string' ? raw.status : 'draft',
          createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now(),
          updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : now(),
        }
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to load feature items: ${message}`)
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
