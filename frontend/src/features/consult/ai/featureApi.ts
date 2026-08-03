import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const response = await fetch('/api/ai', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to load AI features: ${response.status} ${response.statusText}`)
    }

    if (response.status === 204) {
      return []
    }

    let payload: unknown
    try {
      payload = JSON.parse(await response.text())
    } catch {
      throw new Error('Invalid JSON response from AI API.')
    }

    const payloadRecord = payload !== null && typeof payload === 'object' ? (payload as Record<string, unknown>) : null

    const rawItems: unknown[] = Array.isArray(payload)
      ? (payload as unknown[])
      : payloadRecord && Array.isArray(payloadRecord.data)
        ? (payloadRecord.data as unknown[])
        : payloadRecord && Array.isArray(payloadRecord.items)
          ? (payloadRecord.items as unknown[])
          : []

    return rawItems.map((item, index) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error(`Invalid AI feature item at index ${index}`)
      }

      const record = item as Record<string, unknown>
      const id = typeof record.id === 'string' ? record.id.trim() : ''
      const title = typeof record.title === 'string' ? record.title.trim() : ''

      if (!id || !title) {
        throw new Error(`Invalid AI feature item at index ${index}: id and title are required.`)
      }

      const createdAt = typeof record.createdAt === 'string' ? record.createdAt : now()
      const updatedAt = typeof record.updatedAt === 'string' ? record.updatedAt : createdAt
      const status = typeof record.status === 'string' ? record.status : 'draft'

      return { id, title, status, createdAt, updatedAt }
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
