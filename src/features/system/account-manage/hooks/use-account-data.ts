import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { getAccountList } from '@/api/account'

const route = getRouteApi('/_authenticated/system/account-manage')

export function useAccountData() {
  const search = route.useSearch()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['system','account-manage', search],
    queryFn: () => getAccountList(search),
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
