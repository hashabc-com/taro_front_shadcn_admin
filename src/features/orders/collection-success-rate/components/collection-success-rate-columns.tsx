import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type IRowType } from '../schema'

export const tasksColumns: ColumnDef<IRowType>[] = [
  {
    accessorKey: 'companyName',
    header: '商户',
    enableHiding: false
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
    accessorKey: 'pickupCenter',
    header: '支付类型'
  },
  {
    accessorKey: 'dealTime',
    header: '交易时间',
  },
{
    accessorKey: 'billCount',
    header: '总订单数',
  },
  {
    accessorKey: 'successBillCount',
    header: '成功订单数',
  },
  {
    accessorKey: 'successRate',
    header: '成功率',
  }
]
