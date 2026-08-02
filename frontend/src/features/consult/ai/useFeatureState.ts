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
      const matchesKeyword = !keyword || item.title.toLowerCase().includes(keyword)
      const matchesStatus = state.filter.status === 'all' || item.status === state.filter.status
      return matchesKeyword && matchesStatus
    })
  }, [state.items, state.filter])

  const createOrUpdate = useCallback(async (item: FeatureItem): Promise<void> => {
      if (!item.title.trim()) {
        setState((prev) => ({ ...prev, error: 'Title is required.' }))
        return
      }

      setState((prev) => ({ ...prev, loading: true, error: '' }))
      try {
        const saved = await saveFeatureItem(item)
        setState((prev) => {
          const exists = prev.items.some((existing) => existing.id === saved.id)
          return {
            ...prev,
            loading: false,
            items: exists
              ? prev.items.map((existing) => (existing.id === saved.id ? saved : existing))
              : [saved, ...prev.items],
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
