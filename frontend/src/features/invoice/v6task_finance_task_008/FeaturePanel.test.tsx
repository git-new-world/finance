import { describe, expect, it } from 'vitest'
import { saveFeatureItem } from './featureApi'

describe('saveFeatureItem invoice recognition', () => {
  it('saves a valid invoice', async () => {
    const result = await saveFeatureItem({
      title: 'Supplier Invoice',
      invoiceType: 'invoice',
      invoiceNumber: 'INV-2026-001',
      supplier: 'ACME Corp',
      amount: 1580.0,
      taxAmount: 137.8,
      invoiceDate: '2026-08-01',
    })
    expect(result.ok).toBe(true)
  })

  it('rejects an invoice without an invoice number', async () => {
    const result = await saveFeatureItem({
      title: 'Missing Invoice Number',
      invoiceType: 'invoice',
      supplier: 'ACME Corp',
      amount: 1580.0,
    })
    expect(result.ok).toBe(false)
  })

  it('rejects an invoice with a negative amount', async () => {
    const result = await saveFeatureItem({
      title: 'Negative Amount Invoice',
      invoiceType: 'invoice',
      invoiceNumber: 'INV-2026-002',
      supplier: 'ACME Corp',
      amount: -100,
    })
    expect(result.ok).toBe(false)
  })
})

describe('saveFeatureItem invoice cross-validation', () => {
  it('rejects duplicate invoice numbers', async () => {
    const first = await saveFeatureItem({
      title: 'Invoice Duplicate 1',
      invoiceType: 'invoice',
      invoiceNumber: 'INV-2026-DUP',
      supplier: 'ACME Corp',
      amount: 500,
    })
    expect(first.ok).toBe(true)

    const duplicate = await saveFeatureItem({
      title: 'Invoice Duplicate 2',
      invoiceType: 'invoice',
      invoiceNumber: 'INV-2026-DUP',
      supplier: 'Other Corp',
      amount: 600,
    })
    expect(duplicate.ok).toBe(false)
  })

  it('validates that a linked invoice exists', async () => {
    const result = await saveFeatureItem({
      title: 'Linked Invoice',
      invoiceType: 'invoice',
      invoiceNumber: 'INV-2026-LINK',
      supplier: 'ACME Corp',
      amount: 300,
      relatedInvoiceNumber: 'INV-2026-NOT-EXIST',
    })
    expect(result.ok).toBe(false)
  })

  it('flags mismatched amount with a bank statement', async () => {
    const statementResult = await saveFeatureItem({
      title: 'Bank Statement',
      invoiceType: 'bank',
      transactionNumber: 'TRX-2026-001',
      amount: 10000,
    })
    expect(statementResult.ok).toBe(true)

    const invoiceResult = await saveFeatureItem({
      title: 'Invoice for Bank Statement',
      invoiceType: 'invoice',
      invoiceNumber: 'INV-2026-001',
      supplier: 'ACME Corp',
      amount: 9000,
      transactionNumber: 'TRX-2026-001',
    })
    expect(invoiceResult.ok).toBe(false)
  })
})
describe('feature API validation', () => {
  it('rejects empty titles', async () => {
    const result = await saveFeatureItem({ title: '' })
    expect(result.ok).toBe(false)
  })
})
