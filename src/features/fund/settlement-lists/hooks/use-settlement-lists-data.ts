import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getSettlementList } from '@/api/fund'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type ISettlementListType } from '../schema'

const route = getRouteApi('/_authenticated/fund/settlement-lists')

export function useSettlementListData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['fund', 'settlement-lists', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getSettlementList(search),
    enabled: !!selectedCountry,
    placeholderData:(prev) => prev ?? undefined
  })

  const dataList = data?.result?.listRecord?.map((item: ISettlementListType) => ({
    ...item,
    amount: convertAmount(item.amount),
    serviceAmount: convertAmount(item.serviceAmount),
  })) || []

  const totalRecord = data?.result?.totalRecord || 0

  return {
    data: dataList,
    totalRecord,
    isLoading,
    refetch,
  }
}
