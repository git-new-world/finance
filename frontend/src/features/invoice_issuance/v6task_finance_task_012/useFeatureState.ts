import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadFeatureItems, saveFeatureItem } from './featureApi'
import type { FeatureFilter, FeatureItem, FeatureState } from './types'

const defaultFilter: FeatureFilter = { keyword: '', status: 'all' }

export function useFeatureState() {
  const [state, setState] = useState<FeatureState>({
    items: [],
    filter: defaultFilter,
    loading: false,
    error: '',
    selectedId: null,
  })

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    try {
      const items = await loadFeatureItems()
      setState((prev) => ({ ...prev, items, loading: false }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data.'
      setState((prev) => ({ ...prev, loading: false, error: message }))
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const filteredItems = useMemo(() => {
    const keyword = state.filter.keyword.trim().toLowerCase()
    return state.items.filter((item) => {
      if (!keyword) return true
      // 2026-08-04 骨架化：业务字段不固定（非 title/status），按整条记录搜索
      return JSON.stringify(item).toLowerCase().includes(keyword)
    })
  }, [state.items, state.filter])

  const createOrUpdate = useCallback(
      async (data: FeatureItem | Omit<FeatureItem, 'id'>): Promise<FeatureItem | null> => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          setState((prev) => ({ ...prev, loading: false, error: 'Invalid invoice data.' }))
          return null
        }

        const record = data as Partial<FeatureItem> & Record<string, unknown>
        const id = typeof record.id === 'string' ? record.id.trim() : ''

        if (id === '') {
          const hasContent = Object.values(record).some((value) => {
            if (typeof value === 'number' && Number.isNaN(value)) return false
            return value !== null && value !== undefined && value !== ''
          })

          if (!hasContent) {
            setState((prev) => ({ ...prev, loading: false, error: 'Invoice data cannot be empty.' }))
            return null
          }
        }

        setState((prev) => ({ ...prev, loading: true, error: '' }))

        try {
          const saved = await saveFeatureItem(record as FeatureItem)

          setState((prev) => {
            const exists = prev.items.some((item) => item.id === saved.id)

            return {
              ...prev,
              items: exists
                ? prev.items.map((item) => (item.id === saved.id ? saved : item))
                : [saved, ...prev.items],
              loading: false,
              selectedId: saved.id ?? null,
              error: '',
            }
          })

          return saved
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save invoice data.'
          setState((prev) => ({ ...prev, loading: false, error: message }))
          return null
        }
      },
      [],
    )
  return {
    state,
    filteredItems,
    refresh,
    updateFilter: (filter: Partial<FeatureFilter>) => setState((prev) => ({ ...prev, filter: { ...prev.filter, ...filter } })),
    selectItem: (id: string | null) => setState((prev) => ({ ...prev, selectedId: id })),
    createOrUpdate,
  }
}
