import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getCountryDailySummary } from '@/api/fund'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type ICountryDailySummaryType } from '../schema'

const route = getRouteApi('/_authenticated/fund/country-daily-summary')

export function useCountryDailySummaryData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'fund',
      'country-daily-summary',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getCountryDailySummary(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const dataList =
    data?.result?.listRecord?.map((item: ICountryDailySummaryType) => ({
      ...item,
      inAmount: convertAmount(item.inAmount, false),
      inAmountService: convertAmount(item.inAmountService, false),
      outAmount: convertAmount(item.outAmount, false),
      outAmountService: convertAmount(item.outAmountService, false),
      rechargeAmoubt: convertAmount(item.rechargeAmoubt, false),
      withdrawAmount: convertAmount(item.withdrawAmount, false),
      settlementAmount: convertAmount(item.settlementAmount, false),
      availableAmount: convertAmount(item.availableAmount, false),
    })) || []

  const totalRecord = data?.result?.totalRecord || 0

  return {
    data: dataList,
    totalRecord,
    isLoading,
    refetch,
  }
}
