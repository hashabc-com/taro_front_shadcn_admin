import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getMessageRecordList } from '@/api/message-record'

const route = getRouteApi('/_authenticated/logs/message-record')

export function useMessageRecordData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'messageRecord',
      search,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: async () => getMessageRecordList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const datas = data?.result?.listRecord || []
  const totalRecord = data?.result?.totalRecord || 0

  return {
    data: datas,
    totalRecord,
    isLoading,
    refetch,
  }
}
