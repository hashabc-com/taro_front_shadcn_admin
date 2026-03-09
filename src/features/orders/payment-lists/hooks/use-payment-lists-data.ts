import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getPaymentLists } from '@/api/order'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type OrderStats } from '@/features/orders/components/order-stats-cards'
import { type IPaymentListsType } from '../schema'

const route = getRouteApi('/_authenticated/orders/payment-lists')

export function usePaymentListsData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'orders',
      'payment-lists',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getPaymentLists(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const orders =
    data?.result?.listRecord?.map((item: IPaymentListsType) => ({
      ...item,
      amount: convertAmount(item.amount || 0, false),
      serviceAmount: convertAmount(item.serviceAmount || 0, false),
    })) || []

  const totalRecord = data?.result?.totalRecord || 0

  // 统计数据: 优先使用 API 返回数据，否则使用模拟数据
  const stats: OrderStats = useMemo(() => {
    const result = data?.result
    if (result?.allOrder != null) {
      return {
        totalOrders: result.allOrder ?? 0,
        successOrders: result.successOrder ?? 0,
        successRate: result.successRate ?? '0',
      }
    }
    // 模拟数据
    return {
      totalOrders: 3200,
      successOrders: 1856,
      successRate: '58',
    }
  }, [data?.result])

  return {
    orders,
    totalRecord,
    isLoading,
    refetch,
    stats,
  }
}
