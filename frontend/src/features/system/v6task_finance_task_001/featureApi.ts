import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const API_PATH = '/api/v6task-finance-task-001'
    let response: Response
    try {
      response = await fetch(API_PATH, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      throw new Error(`Failed to load feature items: ${(error as Error).message}`)
    }
    if (!response.ok) {
      throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
    }
    let data: unknown
    try {
      data = await response.json()
    } catch {
      throw new Error('Failed to load feature items: invalid JSON response.')
    }
    if (!Array.isArray(data)) {
      throw new Error('Failed to load feature items: response is not an array.')
    }
    return data.map((value: unknown): FeatureItem => {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Failed to load feature items: item is not an object.')
      }
      const item = value as Record<string, unknown>
      const id = typeof item.id === 'string' ? item.id : String(item.id ?? '')
      if (!id) {
        throw new Error('Failed to load feature items: item id is missing.')
      }
      const title = typeof item.title === 'string' ? item.title : String(item.title ?? '')
      if (!title.trim()) {
        throw new Error('Failed to load feature items: item title is missing.')
      }
      return {
        id,
        title: title.trim(),
        status: typeof item.status === 'string' ? item.status : 'draft',
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : now(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : now()
      }
    })
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
