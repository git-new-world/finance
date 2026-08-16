import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

describe('featureApi request handling', () => {
  it('rejects whitespace-only titles', async () => {
    const result = await saveFeatureItem({ title: '   ' })
    expect(result.ok).toBe(false)
  })

  it('rejects missing titles', async () => {
    const result = await saveFeatureItem({})
    expect(result.ok).toBe(false)
  })

  it('rejects non-string titles', async () => {
    const result = await saveFeatureItem({ title: 123 as unknown as string })
    expect(result.ok).toBe(false)
  })

  it('posts a valid title and returns ok true', async () => {
    const originalFetch = globalThis.fetch
    let postedUrl = ''
    let postedBody = ''
    globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
      postedUrl = String(url)
      postedBody = String(init?.body ?? '')
      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true })
      }
    }) as unknown as typeof fetch
    try {
      const result = await saveFeatureItem({ title: 'Invoice #001' })
      expect(result.ok).toBe(true)
      expect(postedUrl).toContain('/api/v6task-finance-task-012')
      expect(postedBody).toContain('Invoice #001')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('returns ok false when the API request fails', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = (async () => ({
      ok: false,
      status: 500,
      json: async () => ({ ok: false })
    })) as unknown as typeof fetch
    try {
      const result = await saveFeatureItem({ title: 'Invoice #002' })
      expect(result.ok).toBe(false)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
