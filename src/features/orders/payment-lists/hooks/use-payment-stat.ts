import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore } from '@/stores'
import { getDisbursementOrderStats } from '@/api/order'
import { type OrderStats } from '@/features/orders/components/order-stats-cards'

const route = getRouteApi('/_authenticated/orders/payment-lists')

export function usePaymentStat() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()

  const params = useMemo(
    () => ({
      startTime: search.startTime,
      endTime: search.endTime,
      status: search.status,
      pickupCenter: search.pickupCenter,
      refresh: search?.refresh,
    }),
    [
      search.startTime,
      search.endTime,
      search.refresh,
      search.status,
      search.pickupCenter,
    ]
  )

  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'payment-stat', params],
    queryFn: () => getDisbursementOrderStats(params),
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
