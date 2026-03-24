import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getCollectionOrderStats } from '@/api/order'
import { type OrderStats } from '@/features/orders/components/order-stats-cards'

const route = getRouteApi('/_authenticated/orders/receive-lists')

export function useReceiveStat() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const params = useMemo(
    () => ({
      startTime: search.startTime,
      status: search.status,
      pickupCenter: search.pickupCenter,
      endTime: search.endTime,
      refresh: search.refresh,
    }),
    [
      search.startTime,
      search.status,
      search.pickupCenter,
      search.endTime,
      search.refresh,
    ]
  )

  const { data, isLoading } = useQuery({
    queryKey: [
      'orders',
      'receive-stat',
      params,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getCollectionOrderStats(params),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const stats: OrderStats = useMemo(() => {
    const result = data?.result
    if (result) {
      return {
        totalOrders: Number(result.allOrder) || 0,
        successOrders: Number(result.successOrder) || 0,
        successRate: (result.successRate ?? '0').replace('%', ''),
      }
    }
    return { totalOrders: 0, successOrders: 0, successRate: '0' }
  }, [data?.result])

  return { stats, isLoading }
}
