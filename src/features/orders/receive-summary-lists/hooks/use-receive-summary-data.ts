import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getReceiveSummary } from '@/api/order'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IOrderSummaryType } from '../schema'

const route = getRouteApi('/_authenticated/orders/receive-summary-lists')

export function useReceiveSummaryData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', 'receive-summary', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getReceiveSummary(search),
    enabled: !!selectedCountry,
  })

  const orders = data?.result?.listRecord?.map((item: IOrderSummaryType) => ({
    ...item,
    amount: convertAmount(item.amount),
    serviceAmount: convertAmount(item.serviceAmount),
  })) || []

  const totalRecord = data?.result?.totalRecord || 0

  return {
    orders,
    totalRecord,
    isLoading,
    refetch,
  }
}
