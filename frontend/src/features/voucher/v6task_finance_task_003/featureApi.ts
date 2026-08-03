import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const url = '/api/v6task-finance-task-003'

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(`Failed to load feature items (${response.status}).`)
      }

      const payload: unknown = await response.json()

      if (!Array.isArray(payload)) {
        throw new Error('Invalid API response: expected an array.')
      }

      return payload
        .filter((entry): entry is FeatureItem => {
          if (typeof entry !== 'object' || entry === null) return false

          const candidate = entry as Partial<FeatureItem>

          return (
            typeof candidate.id === 'string' &&
            typeof candidate.title === 'string'
          )
        })
        .map((entry) => {
          const candidate = entry as Partial<FeatureItem>

          return {
            id: String(candidate.id),
            title: String(candidate.title),
            status: candidate.status ?? 'draft',
            createdAt: candidate.createdAt ?? now(),
            updatedAt: candidate.updatedAt ?? now(),
          } as FeatureItem
        })
    } catch (error) {
      throw new Error(
        `Unable to load feature items: ${error instanceof Error ? error.message : String(error)}`,
      )
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
