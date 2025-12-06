import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type Order } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { getTranslation, type Language } from '@/lib/i18n'

export const getTasksColumns = (language: Language = 'zh'): ColumnDef<Order>[] => {
  const t = (key: string) => getTranslation(language, key)
  
  return [
{
    accessorKey: 'createTime',
    header: t('orders.receiveOrders.createTime')
  },
  {
    accessorKey: 'paymentDate',
    header: t('orders.receiveOrders.collectionTime')
  },
{
    accessorKey: 'referenceno',
    header: t('orders.receiveOrders.merchantOrderNo')
  },
  {
    accessorKey: 'transId',
    header: t('orders.receiveOrders.platformOrderNo'),
    enableHiding: false
  },
  {
    accessorKey: 'pickupCenter',
    header: t('orders.receiveOrders.product'),
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('pickupCenter')}</Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: `${t('orders.receiveOrders.amount')}`,
    enableHiding: false
  },
  {
    accessorKey: 'serviceAmount',
    header: `${t('orders.receiveOrders.serviceFee')}`,
    enableHiding: false
  },
   {
    accessorKey: 'status',
    header: t('orders.receiveOrders.status'),
    cell: ({ row }) => {
      const value = row.getValue('status') as string;
      
      if (value === '支付成功') {
        return (
          <div className='flex items-center text-green-600'>
            <CheckCircle className='mr-1.5 h-4 w-4' />
            <span className='font-medium'>{t('orders.receiveOrders.paymentSuccess')}</span>
          </div>
        );
      } else if (value === '待支付') {
        return (
          <div className='flex items-center text-blue-600'>
            <Clock className='mr-1.5 h-4 w-4' />
            <span className='font-medium'>{t('orders.receiveOrders.pendingPayment')}</span>
          </div>
        );
      } else if (value === '支付失败') {
        return (
          <div className='flex items-center text-red-600'>
            <XCircle className='mr-1.5 h-4 w-4' />
            <span className='font-medium'>{t('orders.receiveOrders.paymentFailed')}</span>
          </div>
        );
      }
      
      return <span>{value}</span>;
    }
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
