import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getBusinessDaySummary } from '@/api/business'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IDailySummaryType } from '../schema'

const route = getRouteApi('/_authenticated/business/daily-summary')

export function useDailySummaryData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'business-daily-summary',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: async () => getBusinessDaySummary(search),
    enabled: !!selectedCountry,
  })

  const datas =
    data?.result?.listRecord?.map((item: IDailySummaryType) => ({
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
