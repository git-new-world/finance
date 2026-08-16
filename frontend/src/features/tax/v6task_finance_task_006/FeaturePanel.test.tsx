import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

it('renders the feature panel title', () => {
  render(<FeaturePanel />)
  expect(screen.getByText('智能报税')).toBeInTheDocument()
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
