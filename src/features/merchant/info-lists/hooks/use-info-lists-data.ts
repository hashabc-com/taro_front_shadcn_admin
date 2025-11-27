import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getMerchantInfoList } from '@/api/merchant'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IMerchantInfoType } from '../schema'

const route = getRouteApi('/_authenticated/merchant/info-lists')

export function useMerchantInfoData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['merchant', 'info-lists', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getMerchantInfoList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const dataList = data?.result?.listRecord?.map((item: IMerchantInfoType) => ({
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
