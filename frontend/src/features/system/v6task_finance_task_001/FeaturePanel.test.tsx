import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

describe('saveFeatureItem validation', () => {
  it('rejects whitespace-only titles', async () => {
    const result = await saveFeatureItem({ title: '   ' })
    expect(result.ok).toBe(false)
  })

  it('rejects null titles', async () => {
    const result = await saveFeatureItem({ title: null } as any)
    expect(result.ok).toBe(false)
  })

  it('rejects undefined titles', async () => {
    const result = await saveFeatureItem({ title: undefined } as any)
    expect(result.ok).toBe(false)
  })

  it('rejects missing titles', async () => {
    const result = await saveFeatureItem({} as any)
    expect(result.ok).toBe(false)
  })

  it('rejects non-string titles', async () => {
    const result = await saveFeatureItem({ title: 123 } as any)
    expect(result.ok).toBe(false)
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
