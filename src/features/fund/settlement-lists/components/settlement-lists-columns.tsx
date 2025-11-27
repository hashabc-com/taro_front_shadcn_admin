import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { statuses,type ISettlementListType } from '../schema'

export const columns: ColumnDef<ISettlementListType>[] = [
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
    accessorKey: 'type',
    header: '类型',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('type')}</Badge>
    ),
  },
  {
    accessorKey: 'createTime',
    header: '操作日期',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('createTime')}</span>
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
    accessorKey: 'withdrawalType',
    header: '提现币种',
    enableSorting: false,
    cell: ({ row }) => row.getValue('withdrawalType'),
  },
  {
    accessorKey: 'exchangeRate',
    header: '汇率',
    enableSorting: false,
    cell: ({ row }) => row.getValue('exchangeRate'),
  },
  {
    accessorKey: 'finalAmount',
    header: '实际金额',
    enableSorting: false,
    cell: ({ row }) => row.getValue('finalAmount')
  },
  {
    accessorKey: 'remark',
    header: '备注',
    enableSorting: false,
    cell: ({ row }) => row.getValue('remark')
  },
{
    accessorKey: 'status',
    header: '审核状态',
    enableSorting: false,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )
      if (!status) {
        return null
      }
      return (
        <div className='flex items-center gap-2'>
          {status.icon && (
            <status.icon className='text-muted-foreground size-4' />
          )}
          <span>{status.label}</span>
        </div>
      )
    }
  },
]
