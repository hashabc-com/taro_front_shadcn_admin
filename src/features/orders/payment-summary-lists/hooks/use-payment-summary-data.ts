import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getPaymentSummary } from '@/api/order'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IOrderSummaryType } from '../schema'

const route = getRouteApi('/_authenticated/orders/payment-summary-lists')

export function usePaymentSummaryData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'orders',
      'payment-summary',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getPaymentSummary(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const orders =
    data?.result?.listRecord?.map((item: IOrderSummaryType) => ({
      ...item,
      amount: convertAmount(item.amount, false),
      serviceAmount: convertAmount(item.serviceAmount, false),
      totalAmount: convertAmount(item.totalAmount, false),
    })) || []

  const totalRecord = data?.result?.totalRecord || 0

  // 提取合计数据
  const summaryData = {
    orderTotal: data?.result?.orderTotal || '0',
    amountTotal: convertAmount(data?.result?.amountTotal || 0, false),
    amountServiceTotal: convertAmount(
      data?.result?.amountServiceTotal || 0,
      false
    ),
    totalAmountTotal: convertAmount(data?.result?.totalAmountTotal || 0, false),
  }

  return {
    data: orders,
    totalRecord,
    summaryData,
    isLoading,
    refetch,
  }
}
