import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

import { render, screen } from '@testing-library/react'
import { FeaturePanel } from './FeaturePanel'

describe('FeaturePanel', () => {
  it('renders the bank balance daily report title', () => {
    render(<FeaturePanel />)
    expect(screen.getByText('银行余额日报')).toBeTruthy()
  })

  it('provides an export button for the daily report', () => {
    render(<FeaturePanel />)
    expect(screen.getByRole('button', { name: /导出/ })).toBeTruthy()
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
