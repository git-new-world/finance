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
      async (item: FeatureItem): Promise<boolean> => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          setState((prev) => ({ ...prev, loading: false, error: 'Invalid item data.' }))
          return false
        }

        setState((prev) => ({ ...prev, loading: true, error: '' }))

        try {
          const saved = await saveFeatureItem(item)
          const merged: FeatureItem = saved ? { ...item, ...saved } : item
          const savedId = typeof merged.id === 'string' && merged.id ? merged.id : ''

          if (!savedId) {
            throw new Error('Saved item does not have a valid id.')
          }

          setState((prev) => {
            const exists = prev.items.some((existing) => existing.id === savedId)
            return {
              ...prev,
              items: exists
                ? prev.items.map((existing) => (existing.id === savedId ? merged : existing))
                : [merged, ...prev.items],
              loading: false,
              selectedId: savedId,
            }
          })

          return true
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save item.'
          setState((prev) => ({ ...prev, loading: false, error: message }))
          return false
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
