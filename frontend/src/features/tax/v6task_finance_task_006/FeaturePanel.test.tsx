import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

export function calculateTax(input: TaxInput): TaxResult
export function submitTaxReturn(input: TaxInput): Promise<Result>
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
