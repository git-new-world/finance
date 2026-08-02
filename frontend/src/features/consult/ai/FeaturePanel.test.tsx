import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

import ... from 'vitest'
import { saveFeatureItem } from './featureApi'

// >>> REGION START <<<
??? 
// >>> REGION END <<<

describe('feature API validation', () => {
  ...
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
