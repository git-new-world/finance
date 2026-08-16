import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const API_PATH = '/api/v6task-finance-task-014'
    try {
      const response = await fetch(API_PATH, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch risk warning items: ${response.status} ${response.statusText}`)
      }
      const json: unknown = await response.json()
      if (Array.isArray(json)) {
        return json as FeatureItem[]
      }
      if (json && typeof json === 'object' && Array.isArray((json as { items?: unknown }).items)) {
        return (json as { items: FeatureItem[] }).items
      }
      throw new Error('Invalid response format: expected an array or { items: [...] }')
    } catch (error) {
      console.error('[v6task-finance-task-014] loadFeatureItems failed:', error)
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
