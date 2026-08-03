import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

describe('system management module configuration', () => {
  it.each([
    'system parameter configuration',
    'external data source configuration',
    'operation log record query',
  ])('saves %s', async (title) => {
    const result = await saveFeatureItem({ title })
    expect(result.ok).toBe(true)
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
