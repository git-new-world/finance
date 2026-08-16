import type { FeatureActionResult, FeatureItem } from './types'

const now = () => new Date().toISOString()

export async function loadFeatureItems(): Promise<FeatureItem[]> {
  const API_PATH = '/api/v6task-finance-task-001'

    let response: Response
    try {
      response = await fetch(API_PATH, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
    } catch {
      throw new Error('Network error while loading feature items.')
    }

    if (!response.ok) {
      let message = `Failed to load feature items: ${response.status} ${response.statusText}`
      try {
        const errorBody: unknown = await response.json()
        if (
          errorBody &&
          typeof errorBody === 'object' &&
          'message' in errorBody &&
          typeof (errorBody as { message?: unknown }).message === 'string'
        ) {
          const serverMessage = (errorBody as { message: string }).message
          if (serverMessage.trim()) {
            message = serverMessage
          }
        }
      } catch {
        // Keep the status-based message when the error response is not JSON.
      }
      throw new Error(message)
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new Error('Invalid JSON response from feature items API.')
    }

    let items: FeatureItem[]
    if (Array.isArray(payload)) {
      if (!payload.every((item) => item !== null && typeof item === 'object')) {
        throw new Error('Invalid feature item entry in API response.')
      }
      items = payload as FeatureItem[]
    } else if (payload && typeof payload === 'object') {
      const body = payload as { items?: unknown; data?: unknown; records?: unknown }
      if (Array.isArray(body.items)) {
        if (!body.items.every((item) => item !== null && typeof item === 'object')) {
          throw new Error('Invalid feature item entry in API response.')
        }
        items = body.items as FeatureItem[]
      } else if (Array.isArray(body.data)) {
        if (!body.data.every((item) => item !== null && typeof item === 'object')) {
          throw new Error('Invalid feature item entry in API response.')
        }
        items = body.data as FeatureItem[]
      } else if (Array.isArray(body.records)) {
        if (!body.records.every((item) => item !== null && typeof item === 'object')) {
          throw new Error('Invalid feature item entry in API response.')
        }
        items = body.records as FeatureItem[]
      } else {
        throw new Error('Unexpected response shape from feature items API.')
      }
    } else {
      throw new Error('Unexpected response shape from feature items API.')
    }

    return items
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
