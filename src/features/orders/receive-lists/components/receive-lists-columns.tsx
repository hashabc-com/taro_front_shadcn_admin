import { type ColumnDef } from '@tanstack/react-table'
import { CheckCircle, Clock, XCircle, Wallet } from 'lucide-react'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type Order } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<Order>[] => {
  const t = (key: string) => getTranslation(language, key)

  return [
    {
      accessorKey: 'companyName',
      header: t('orders.receiveOrders.merchant'),
    },
    {
      accessorKey: 'createTime',
      header: t('orders.receiveOrders.createTime'),
    },
    {
      accessorKey: 'referenceno',
      header: t('orders.receiveOrders.merchantOrderNo'),
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
      accessorKey: 'transId',
      header: t('orders.receiveOrders.platformOrderNo'),
      enableHiding: false,
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

        if (value == '0') {
          return (
            <div className='flex items-center text-green-600'>
              <CheckCircle className='mr-1.5 h-4 w-4' />
              <span className='font-medium'>
                {t('orders.receiveOrders.paymentSuccess')}
              </span>
            </div>
          )
        } else if (value == '1') {
          return (
            <div className='flex items-center text-blue-600'>
              <Clock className='mr-1.5 h-4 w-4' />
              <span className='font-medium'>
                {t('orders.receiveOrders.pendingPayment')}
              </span>
            </div>
          )
        } else if (value == '2') {
          return (
            <div className='flex items-center text-red-600'>
              <XCircle className='mr-1.5 h-4 w-4' />
              <span className='font-medium'>
                {t('orders.receiveOrders.paymentFailed')}
              </span>
            </div>
          )
        } else if (value == '4') {
          return (
            <div className='flex items-center text-yellow-600'>
              <Wallet className='mr-1.5 h-4 w-4' />
              <span className='font-medium'>
                {t('orders.receiveOrders.partialPayment')}
              </span>
            </div>
          )
        }

        return <span>{value}</span>
      },
    },
    // {
    //   accessorKey: 'paymentDate',
    //   header: '收款时间',
    //   enableHiding: false,
    //   cell: ({ row }) => row.getValue('paymentDate'),
    // },
    {
      id: 'actions',
      header: t('orders.receiveOrders.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
