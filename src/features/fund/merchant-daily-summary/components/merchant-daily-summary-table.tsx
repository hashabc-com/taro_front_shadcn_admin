import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useMerchantDailySummaryData } from '../hooks/use-merchant-daily-summary-data'
import { getMerchantDailySummaryColumns } from './merchant-daily-summary-columns'
import { MerchantDailySummarySearch } from './merchant-daily-summary-search'

const route = getRouteApi('/_authenticated/fund/merchant-daily-summary')

export function MerchantDailySummaryTable() {
  const { data, isLoading, totalRecord } = useMerchantDailySummaryData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getMerchantDailySummaryColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <MerchantDailySummarySearch table={table} />}
    />
  )
}
