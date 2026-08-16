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
      async (payload: FeatureItem): Promise<boolean> => {
        if (!payload || typeof payload !== 'object') {
          setState((prev) => ({ ...prev, error: 'Invalid item payload.' }))
          return false
        }

        const title = typeof payload.title === 'string' ? payload.title.trim() : ''
        if (!title) {
          setState((prev) => ({ ...prev, error: 'Title is required.' }))
          return false
        }

        const itemToSave: FeatureItem = { ...payload, title }

        setState((prev) => ({ ...prev, loading: true, error: '' }))
        try {
          const saved = await saveFeatureItem(itemToSave)
          setState((prev) => {
            const index = prev.items.findIndex((item) => item.id === saved.id)
            if (index >= 0) {
              const items = [...prev.items]
              items[index] = saved
              return { ...prev, items, loading: false, selectedId: saved.id }
            }
            return { ...prev, items: [saved, ...prev.items], loading: false, selectedId: saved.id }
          })
          return true
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save item.'
          setState((prev) => ({ ...prev, loading: false, error: message }))
          return false
        }
      },
      []
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
