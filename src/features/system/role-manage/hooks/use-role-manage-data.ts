import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getRoleList } from '@/api/role'

const route = getRouteApi('/_authenticated/system/role-manage')

export function useRoleManageData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['roles', search, selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getRoleList(search),
    enabled: !!selectedCountry,
    placeholderData: (prev) => prev ?? undefined,
  })

  const roles = data?.result?.listRecord || []
  const totalRecord = data?.result?.totalRecord || 0

  return {
    roles,
    totalRecord,
    isLoading,
    refetch,
  }
}
