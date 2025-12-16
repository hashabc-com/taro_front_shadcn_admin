import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getMerchantRequestList } from '@/api/merchant-request'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { type IMerchantRequest } from '../schema'

const route = getRouteApi('/_authenticated/logs/merchant-request')

export function useMerchantRequestData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const convertAmount = useConvertAmount()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'merchantRequest',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: async () => getMerchantRequestList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const datas =
    data?.result?.listRecord?.map((item: IMerchantRequest) => ({
      ...item,
      amount: convertAmount(item.amount || 0, true),
      serviceAmount: convertAmount(item.serviceAmount || 0, true),
    })) || []

  //   const datas = data?.result?.listRecord || []
  const totalRecord = data?.result?.totalRecord || 0

  return {
    data: datas,
    totalRecord,
    isLoading,
    refetch,
  }
}
