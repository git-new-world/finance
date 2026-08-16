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

  const createOrUpdate = useCallback(async (data: FeatureItem) => {
      if (!data || typeof data.id !== 'string' || data.id.trim() === '') {
        setState((prev) => ({ ...prev, error: 'Item ID is required.' }))
        return
      }

      setState((prev) => ({ ...prev, loading: true, error: '' }))
      try {
        const saved = await saveFeatureItem({ ...data, id: data.id.trim() })
        setState((prev) => {
          const exists = prev.items.some((item) => item.id === saved.id)
          return {
            ...prev,
            items: exists
              ? prev.items.map((item) => (item.id === saved.id ? saved : item))
              : [...prev.items, saved],
            loading: false,
            selectedId: saved.id,
          }
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save item.'
        setState((prev) => ({ ...prev, loading: false, error: message }))
      }
    }, [])
  return {
    state,
    filteredItems,
    refresh,
    updateFilter: (filter: Partial<FeatureFilter>) => setState((prev) => ({ ...prev, filter: { ...prev.filter, ...filter } })),
    selectItem: (id: string | null) => setState((prev) => ({ ...prev, selectedId: id })),
    createOrUpdate,
  }
}
