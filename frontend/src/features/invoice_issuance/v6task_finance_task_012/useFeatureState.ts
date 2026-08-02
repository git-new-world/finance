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

  const createOrUpdate = useCallback(async (data: Omit<FeatureItem, 'id'>) => {
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    try {
      const existing = state.items.find((item) => item.id === state.selectedId) ?? null
      const payload: FeatureItem = existing
        ? { ...existing, ...data }
        : { ...data, id: crypto.randomUUID?.() ?? `temp-${Date.now()}` }
      const saved = await saveFeatureItem(payload)
      setState((prev) => ({
        ...prev,
        items: existing
          ? prev.items.map((item) => (item.id === existing.id ? saved : item))
          : [saved, ...prev.items],
        selectedId: saved.id,
        loading: false,
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save item.'
      setState((prev) => ({ ...prev, loading: false, error: message }))
    }
  }, [state.items, state.selectedId])
  return {
    state,
    filteredItems,
    refresh,
    updateFilter: (filter: Partial<FeatureFilter>) => setState((prev) => ({ ...prev, filter: { ...prev.filter, ...filter } })),
    selectItem: (id: string | null) => setState((prev) => ({ ...prev, selectedId: id })),
    createOrUpdate,
  }
}
