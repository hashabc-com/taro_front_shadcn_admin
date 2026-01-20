import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getBusinessMonthlySummary } from '@/api/business'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IMonthlySummaryType } from '../schema'

const route = getRouteApi('/_authenticated/business/monthly-summary')

export function useMonthlySummaryData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'business-monthly-summary',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: async () => getBusinessMonthlySummary(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const datas =
    data?.result?.listRecord?.map((item: IMonthlySummaryType) => ({
      ...item,
      inAmount: convertAmount(item.inAmount, false),
      inAmountService: convertAmount(item.inAmountService, false),
      outAmount: convertAmount(item.outAmount, false),
      outAmountService: convertAmount(item.outAmountService, false),
    })) || []
  const totalRecord = data?.result?.totalRecord || 0

  return {
    data: datas || [],
    totalRecord,
    isLoading,
    refetch,
  }
}
