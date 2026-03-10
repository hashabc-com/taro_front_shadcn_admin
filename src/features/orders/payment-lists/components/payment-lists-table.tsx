import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { OrderStatsCards } from '@/features/orders/components/order-stats-cards'
import { usePaymentListsData } from '../hooks/use-payment-lists-data'
import { usePaymentStat } from '../hooks/use-payment-stat'
import { getTasksColumns } from './payment-lists-columns'
import { ReceiveListsSearch } from './payment-lists-search'

const route = getRouteApi('/_authenticated/orders/payment-lists')

export function PaymentListsTable() {
  const { orders: data, isLoading, totalRecord } = usePaymentListsData()
  const { stats, isLoading: statsLoading } = usePaymentStat()
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
      renderToolbar={(table) => (
        <>
          <ReceiveListsSearch table={table} />
          <OrderStatsCards stats={stats} isLoading={statsLoading} />
        </>
      )}
    />
  )
}
