import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FeaturePanel from './FeaturePanel'

describe('FeaturePanel', () => {
  it('renders standard report tabs and switches between report types', async () => {
    render(<FeaturePanel />)
    expect(screen.getByRole('button', { name: '资产负债表' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '利润表' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '现金流量表' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '利润表' }))
    expect(await screen.findByText('利润表')).toBeInTheDocument()
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
