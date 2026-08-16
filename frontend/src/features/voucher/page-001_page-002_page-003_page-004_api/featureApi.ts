import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    try {
      const response = await fetch('/api/v6task-finance-task-003/items', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      })
      if (!response.ok) {
        throw new Error(`Failed to load feature items: ${response.status} ${response.statusText}`)
      }

      const payload: unknown = await response.json()
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid backend payload: expected an object.')
      }

      const payloadRecord = payload as { items?: unknown; data?: unknown }
      const rawItems = Array.isArray(payloadRecord.items)
        ? payloadRecord.items
        : Array.isArray(payloadRecord.data)
          ? payloadRecord.data
          : null
      if (!rawItems) {
        throw new Error('Invalid backend payload: expected an items or data array.')
      }

      return rawItems.map((item, index) => {
        if (!item || typeof item !== 'object') {
          throw new Error(`Invalid feature item at index ${index}: expected an object.`)
        }
        const source = item as Record<string, unknown>
        const id = String(source.id ?? source.uid ?? source.voucherId ?? `item-${index + 1}`)
        const title = String(source.title ?? source.voucherNo ?? source.name ?? `Item ${id}`)
        const status = String(source.status ?? source.state ?? 'draft')
        const createdAt = String(source.createdAt ?? source.created_at ?? source.syncTime ?? now())
        const updatedAt = String(source.updatedAt ?? source.updated_at ?? source.reviewedAt ?? createdAt)
        return { id, title, status, createdAt, updatedAt, ...source } as FeatureItem
      })
    } catch (error) {
      if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timed out while loading feature items.')
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
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
