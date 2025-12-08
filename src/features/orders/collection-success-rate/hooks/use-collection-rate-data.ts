import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getCollectionSuccessRate } from '@/api/order'

const route = getRouteApi('/_authenticated/orders/collection-success-rate')

export function useCollectionRateData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', 'collection-success-rate', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getCollectionSuccessRate(search),
    enabled: !!selectedCountry,
    placeholderData:(prev) => prev ?? undefined
  })

  // const orders = data?.result?.listRecord?.map((item: IRowType) => ({
  //   ...item,
  //   amount: convertAmount(item.amount,false),
  //   serviceAmount: convertAmount(item.serviceAmount,false),
  //   totalAmount: convertAmount(item.totalAmount,false),
  // })) || []

  const totalRecord = data?.result?.totalRecord || 0

  // 提取合计数据
  const summaryData = {
    orderTotal: data?.result?.allOrder || '0',
    successOrder: data?.result?.successOrder || '0',
    successRate: data?.result?.successRate || '0',
  }

  return {
    data: data?.result?.listRecord || [],
    totalRecord,
    summaryData,
    isLoading,
    refetch,
  }
}
