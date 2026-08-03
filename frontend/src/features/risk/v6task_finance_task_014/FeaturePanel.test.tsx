import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

describe('feature API risk warning validation', () => {
  it('rejects feature items without a risk warning level', async () => {
    const result = await saveFeatureItem({
      title: 'Valid title',
      riskWarning: { message: 'Risk message' }
    })

    expect(result.ok).toBe(false)
  })

  it('rejects feature items with an empty risk warning message', async () => {
    const result = await saveFeatureItem({
      title: 'Valid title',
      riskWarning: { level: 'high', message: '' }
    })

    expect(result.ok).toBe(false)
  })

  it('accepts feature items with a valid risk warning', async () => {
    const result = await saveFeatureItem({
      title: 'Valid title',
      riskWarning: { level: 'high', message: 'Potential loss' }
    })

    expect(result.ok).toBe(true)
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
