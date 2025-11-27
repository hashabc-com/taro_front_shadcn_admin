import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { statuses } from './receive-lists-mutate-drawer'
import { type Order } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const tasksColumns: ColumnDef<Order>[] = [
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
    accessorKey: 'pickupCenter',
    header: '产品',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('pickupCenter')}</Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: '金额',
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium'>{row.getValue('amount')}</span>
        {/* <span className='text-muted-foreground text-xs'>
          ${row.original.amountUSD.toFixed(2)} USD
        </span> */}
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
        {/* <span className='text-muted-foreground text-xs'>
          ${row.original.serviceAmountUSD.toFixed(2)} USD
        </span> */}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: '交易状态',
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
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    header: '操作',
    enableSorting: false,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
