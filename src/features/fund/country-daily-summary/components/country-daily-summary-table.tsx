import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useCountryDailySummaryData } from '../hooks/use-country-daily-summary-data'
import { getCountryDailySummaryColumns } from './country-daily-summary-columns'
import { CountryDailySummarySearch } from './country-daily-summary-search'

const route = getRouteApi('/_authenticated/fund/country-daily-summary')

export function CountryDailySummaryTable() {
  const { data, isLoading, totalRecord } = useCountryDailySummaryData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getCountryDailySummaryColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <CountryDailySummarySearch table={table} />}
    />
  )
}
