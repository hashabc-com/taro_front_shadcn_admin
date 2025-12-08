import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type IOrderSummaryType } from '../schema'

export const tasksColumns: ColumnDef<IOrderSummaryType>[] = [
  {
    accessorKey: 'companyName',
    header: '商户',
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
    header: '支付渠道',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('paymentCompany')}</Badge>
    ),
  },
  {
    accessorKey: 'dealTime',
    header: '交易时间',
    enableSorting: false,
    cell: ({ row }) => row.getValue('dealTime'),
  },
  {
    accessorKey: 'billCount',
    header: '订单数',
    enableSorting: false,
    // cell: ({ row }) => row.getValue('billCount'),
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('billCount')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: '金额',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('amount')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'serviceAmount',
    header: '手续费',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('serviceAmount')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: '总金额',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('totalAmount')}</span>
      </div>
    ),
  }
]
