import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useMonthlySummaryData } from '../hooks/use-monthly-summary-data'
import { getMonthlySummaryColumns } from './monthly-summary-columns'
import { MonthlySummarySearch } from './monthly-summary-search'

const route = getRouteApi('/_authenticated/business/monthly-summary')

export function MonthlySummaryTable() {
  const { data, isLoading, totalRecord } = useMonthlySummaryData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getMonthlySummaryColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <MonthlySummarySearch table={table} />}
    />
  )
}
