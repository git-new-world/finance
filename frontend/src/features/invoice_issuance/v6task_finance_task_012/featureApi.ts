import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    try {
      const response = await fetch('/api/v6task-finance-task-012/items', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      })
      if (!response.ok) {
        throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
      }
      const payload = (await response.json()) as {
        items?: FeatureItem[]
        data?: FeatureItem[] | { items?: FeatureItem[] }
      }
      let rawItems: FeatureItem[] | undefined
      if (Array.isArray(payload.items)) {
        rawItems = payload.items
      } else if (Array.isArray(payload.data)) {
        rawItems = payload.data
      } else if (Array.isArray(payload.data?.items)) {
        rawItems = payload.data.items
      }
      if (!rawItems) {
        throw new Error('Invalid response payload: missing items array.')
      }
      return rawItems.map((item, index) => ({
        id: item.id || `item-${Date.now()}-${index}`,
        title: item.title || `Untitled item ${index + 1}`,
        status: item.status || 'draft',
        createdAt: item.createdAt || now(),
        updatedAt: item.updatedAt || now(),
      }))
    } finally {
      clearTimeout(timeout)
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
