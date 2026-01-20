import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type IOrderSummaryType } from '../schema'

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<IOrderSummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)

  return [
    {
      accessorKey: 'companyName',
      header: t('orders.receiveSummary.merchant'),
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
      header: t('orders.receiveSummary.paymentChannel'),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('paymentCompany')}</Badge>
      ),
    },
    {
      accessorKey: 'dealTime',
      header: t('orders.receiveSummary.transactionTime'),
      enableSorting: false,
      cell: ({ row }) => row.getValue('dealTime'),
    },
    {
      accessorKey: 'billCount',
      header: t('orders.receiveSummary.orderCount'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{row.getValue('billCount')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: t('orders.receiveSummary.amount'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{row.getValue('amount')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'serviceAmount',
      header: t('orders.receiveSummary.serviceFee'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{row.getValue('serviceAmount')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: t('orders.receiveSummary.totalAmount'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex flex-col gap-1'>
          <span className='font-medium'>{row.getValue('totalAmount')}</span>
        </div>
      ),
    },
  ]
}
