import { type ColumnDef } from '@tanstack/react-table'
import { CheckCircle, Clock, XCircle, Wallet, Ban } from 'lucide-react'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type Order } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<Order>[] => {
  const t = (key: string) => getTranslation(language, key)

  // const renderTime = (row: { original: Order }) => {
  //   if(row.original.status == '2') {
  //     return <div>{row.original.updateTime || '-'}</div>
  //   }else{
  //     return <div>{row.original.localPaymentDate || '-'}</div>
  //   }
  // }
  return [
    {
      accessorKey: 'companyName',
      header: t('orders.receiveOrders.merchant'),
    },
    {
      accessorKey: 'localTime',
      header: `${t('common.create')}/${t('orders.receiveOrders.finishTime')}`,
      cell: ({ row }) => {
        const localTime = row.original.localTime
        const localPaymentDate = row.original.localPaymentDate
        const updateTime = row.original.updateTime
        const status = row.original.status
        return (
          <div className='text-muted-foreground flex flex-col gap-0.5 text-xs'>
            <div>{localTime || '-'}</div>
            <div>{ status == '2' ? updateTime || '-' : localPaymentDate || '-'}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'referenceno',
      header: `${t('common.thirdParty')}/${t('common.platform')}/${t('orders.receiveOrders.merchantOrderNo')}`,
      cell: ({ row }) => {
        const referenceno = row.original.referenceno
        const transId = row.original.transId
        const tripartiteOrder = row.original.tripartiteOrder
        return (
          <div className='text-muted-foreground flex flex-col gap-0.5 font-mono text-xs'>
            <div>{tripartiteOrder || '-'}</div>
            <div>{transId}</div>
            <div>{referenceno}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'mobile',
      header: t('common.phone')
    },
    {
      accessorKey: 'userName',
      header: t('signIn.username')
    },
    {
      accessorKey: 'pickupCenter',
      header: t('orders.receiveOrders.product'),
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('pickupCenter')}</Badge>
      ),
    },
    {
      accessorKey: 'paymentCompany',
      header: t('common.channel'),
    },
    {
      accessorKey: 'amount',
      header: `${t('orders.receiveOrders.orderAmount')}`,
      enableHiding: false,
    },
    {
      accessorKey: 'realAmount',
      header: `${t('orders.receiveOrders.realAmount')}`,
      enableHiding: false,
    },
    {
      accessorKey: 'serviceAmount',
      header: `${t('orders.receiveOrders.serviceFee')}`,
      enableHiding: false,
    },
    {
      accessorKey: 'status',
      header: t('orders.receiveOrders.status'),
      cell: ({ row }) => {
        const value = row.getValue('status') as string
        const statusMap: Record<string, { icon: React.ElementType; color: string; label: string }> = {
          '0': { icon: CheckCircle, color: 'text-green-600', label: t('orders.receiveOrders.paymentSuccess') },
          '1': { icon: Clock, color: 'text-blue-600', label: t('orders.receiveOrders.pendingPayment') },
          '2': { icon: XCircle, color: 'text-red-600', label: t('orders.receiveOrders.paymentFailed') },
          '3': { icon: Ban, color: 'text-gray-500', label: t('orders.receiveOrders.expired') },
          '4': { icon: Wallet, color: 'text-yellow-600', label: t('orders.receiveOrders.partialPayment') },
        }
        const status = statusMap[value]
        if (!status) return <span>{value}</span>
        const Icon = status.icon
        return (
          <div className={`flex items-center ${status.color}`}>
            <Icon className='mr-1.5 h-4 w-4' />
            <span className='font-medium'>{status.label}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: t('orders.receiveOrders.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
