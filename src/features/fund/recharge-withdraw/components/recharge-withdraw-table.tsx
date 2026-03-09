import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useRechargeWithdrawData } from '../hooks/use-recharge-withdraw-data'
import { getTasksColumns } from './recharge-withdraw-columns'
import { RechargeWithdrawSearch } from './recharge-withdraw-search'

const route = getRouteApi('/_authenticated/fund/recharge-withdraw')

export function RechargeWithdrawTable() {
  const { data, isLoading, totalRecord } = useRechargeWithdrawData()
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
      renderToolbar={(table) => <RechargeWithdrawSearch table={table} />}
    />
  )
}
