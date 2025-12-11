import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type PaymentChannel } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getPaymentChannelColumns = (): ColumnDef<PaymentChannel>[] => {

  return [
    {
      accessorKey: 'customerName',
      header: '商户名称',
    },
    {
      accessorKey: 'country',
      header: '国家',
      cell: ({ row }) => {
        const country = row.getValue('country') as string | null
        return country || '-'
      },
    },
    {
      accessorKey: 'type',
      header: '代收/代付',
      cell: ({ row }) => {
        const type = row.getValue('type') as number
        return (
          <Badge variant={type === 1 ? 'default' : 'secondary'}>
            {type === 1 ? '代付' : '代收'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'channel',
      header: '支持渠道',
      cell: ({ row }) => {
        const channels = row.getValue('channel') as string
        return (
          <div className='flex flex-wrap gap-1'>
            {channels.split(',').map((ch, idx) => (
              <Badge key={idx} variant='outline'>
                {ch}
              </Badge>
            ))}
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const status = row.getValue('status') as number
        return (
          <Badge variant={status === 1 ? 'default' : 'destructive'}>
            {status === 1 ? '启用' : '禁用'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
