import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { getCustomerConsultList } from '@/api/business'
import { type ICustomerConsult } from '../schema'
import { useCountryStore } from '@/stores/country-store'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function useCustomerConsultData() {
  const search = route.useSearch()
  const { selectedCountry } = useCountryStore()

  const { data, isLoading } = useQuery({
    queryKey: ['customer-consult-list', search, selectedCountry],
    queryFn: () =>
      getCustomerConsultList({
        pageNum: search.pageNum ?? 1,
        pageSize: search.pageSize ?? 10,
        country: selectedCountry,
      }),
    placeholderData: (prev) => prev ?? undefined,
  })

  const customerList: ICustomerConsult[] = data?.result ?? []
  const totalRecord = customerList.length

  return {
    data: customerList,
    isLoading,
    totalRecord,
  }
}
