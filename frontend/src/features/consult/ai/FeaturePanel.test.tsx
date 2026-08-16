import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

import { afterEach, vi } from 'vitest'

describe('saveFeatureItem submission', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('rejects whitespace-only titles without calling the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await saveFeatureItem({ title: '   ' })

    expect(result.ok).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('submits a valid title to the AI consultation endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'test-1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await saveFeatureItem({ title: '智能咨询' })

    expect(result.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v6task-finance-task-016',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ title: '智能咨询' }),
      })
    )
  })

  it('returns ok false when the API responds with an error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await saveFeatureItem({ title: '智能咨询' })

    expect(result.ok).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns ok false when the network request fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network unavailable'))
    vi.stubGlobal('fetch', fetchMock)

    const result = await saveFeatureItem({ title: '智能咨询' })

    expect(result.ok).toBe(false)
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
