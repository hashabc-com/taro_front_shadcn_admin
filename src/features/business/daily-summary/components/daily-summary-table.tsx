import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useDailySummaryData } from '../hooks/use-daily-summary-data'
import { getDailySummaryColumns } from './daily-summary-columns'
import { DailySummarySearch } from './daily-summary-search'

const route = getRouteApi('/_authenticated/business/daily-summary')

export function DailySummaryTable() {
  const { data, isLoading, totalRecord } = useDailySummaryData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getDailySummaryColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <DailySummarySearch table={table} />}
    />
  )
}
