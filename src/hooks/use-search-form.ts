import { useCallback, useMemo, useState } from 'react'
import type { NavigateFn } from './use-table-url-state'

type SearchRecord = Record<string, unknown>

/**
 * Generic hook that eliminates repetitive useState / handleSearch / handleReset
 * boilerplate in search components.
 *
 * @example
 * ```tsx
 * const route = getRouteApi('/_authenticated/orders/receive-lists')
 *
 * const { fields, setField, setFields, handleSearch, handleReset, hasFilters } =
 *   useSearchForm({
 *     search: route.useSearch(),
 *     navigate: route.useNavigate(),
 *     fieldKeys: ['referenceno', 'transId', 'status', 'startTime', 'endTime'],
 *   })
 *
 * // Read value:   fields.referenceno
 * // Update value: setField('referenceno', 'abc')
 * // In JSX:
 * <Input value={fields.referenceno} onChange={e => setField('referenceno', e.target.value)} />
 * ```
 */
export function useSearchForm<K extends string>({
  search,
  navigate,
  fieldKeys,
  pageKey = 'pageNum',
  pageSizeKey = 'pageSize',
}: {
  /** Route search params object (from `route.useSearch()`) */
  search: SearchRecord
  /** Route navigate function (from `route.useNavigate()`) */
  navigate: NavigateFn
  /** Array of field key names to manage */
  fieldKeys: readonly K[]
  /** URL key for page number (default: 'pageNum') */
  pageKey?: string
  /** URL key for page size (default: 'pageSize') */
  pageSizeKey?: string
}) {
  type Fields = Record<K, string>

  // Initialise all field values from URL search params
  const [fields, setFieldsState] = useState<Fields>(() => {
    const initial = {} as Fields
    for (const key of fieldKeys) {
      initial[key] = (search[key] as string) || ''
    }
    return initial
  })

  /** Update a single field */
  const setField = useCallback(
    (key: K, value: string) =>
      setFieldsState((prev) => ({ ...prev, [key]: value })),
    [],
  )

  /** Update multiple fields at once */
  const setFields = useCallback(
    (patch: Partial<Fields>) =>
      setFieldsState((prev) => ({ ...prev, ...patch })),
    [],
  )

  /** Whether any filter field has a non-empty value */
  const hasFilters = useMemo(
    () => fieldKeys.some((key) => Boolean(fields[key])),
    [fieldKeys, fields],
  )

  /**
   * Navigate with all current field values.
   * Empty strings are converted to `undefined` so they are removed from the URL.
   */
  const handleSearch = useCallback(() => {
    navigate({
      search: (prev: SearchRecord) => {
        const next: SearchRecord = {
          ...prev,
          [pageKey]: 1,
          refresh: Date.now(),
        }
        for (const key of fieldKeys) {
          next[key] = fields[key] || undefined
        }
        return next
      },
    })
  }, [navigate, fields, fieldKeys, pageKey])

  /** Reset all fields to empty and clear URL search params */
  const handleReset = useCallback(() => {
    const empty = {} as Fields
    for (const key of fieldKeys) {
      empty[key] = '' as Fields[K]
    }
    setFieldsState(empty)

    navigate({
      search: (prev: SearchRecord) => ({
        [pageKey]: 1,
        [pageSizeKey]: prev[pageSizeKey],
      }),
    })
  }, [navigate, fieldKeys, pageKey, pageSizeKey])

  return {
    /** Current values of all managed fields */
    fields,
    /** Set a single field value: `setField('status', 'paid')` */
    setField,
    /** Set multiple fields: `setFields({ startTime: '...', endTime: '...' })` */
    setFields,
    /** Execute search (navigate with current field values) */
    handleSearch,
    /** Reset all fields and URL params */
    handleReset,
    /** `true` if any field has a non-empty value */
    hasFilters,
  }
}
