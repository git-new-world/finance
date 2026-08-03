import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

// TEST_CASES

describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
