import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useSettlementListData } from '../hooks/use-settlement-lists-data'
import { getTasksColumns } from './settlement-lists-columns'
import { SettlementListsSearch } from './settlement-lists-search'

const route = getRouteApi('/_authenticated/fund/settlement-lists')

export function SettlementListTable() {
  const { data, isLoading, totalRecord } = useSettlementListData()
  const { lang } = useLanguage()
  const columns = useMemo(() => getTasksColumns(lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <SettlementListsSearch table={table} />}
    />
  )
}
