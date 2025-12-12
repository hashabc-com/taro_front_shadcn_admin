import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type IOrderSummaryType } from '../schema'
import { getTranslation, type Language } from '@/lib/i18n'

export const getTasksColumns = (language: Language = 'zh'): ColumnDef<IOrderSummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)
  
  return [
  {
    accessorKey: 'companyName',
    header: t('orders.paymentSummary.merchant'),
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('companyName')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'paymentCompany',
    header: t('orders.paymentSummary.paymentChannel'),
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('paymentCompany')}</Badge>
    ),
  },
  {
    accessorKey: 'dealTime',
    header: t('orders.paymentSummary.transactionTime'),
    enableSorting: false,
    cell: ({ row }) => row.getValue('dealTime'),
  },
  {
    accessorKey: 'billCount',
    header: t('orders.paymentSummary.orderCount'),
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('billCount')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: t('orders.paymentSummary.amount'),
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('amount')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'serviceAmount',
    header: t('orders.paymentSummary.serviceFee'),
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('serviceAmount')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: t('orders.paymentSummary.totalAmount'),
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('totalAmount')}</span>
      </div>
    ),
  }
]
}
