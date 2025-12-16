import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { getAccountList } from '@/api/account'
import { useCountryStore, useMerchantStore } from '@/stores'

const route = getRouteApi('/_authenticated/system/account-manage')

export function useAccountData() {
  const search = route.useSearch()
const { selectedCountry } = useCountryStore()
    const { selectedMerchant } = useMerchantStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['system','account-manage', search,selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getAccountList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const accounts = data?.result?.listRecord || []
  const totalRecord = data?.result?.totalRecord || 0

  return {
    accounts,
    totalRecord,
    isLoading,
    refetch,
  }
}
