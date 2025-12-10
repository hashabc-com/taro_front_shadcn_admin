import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { type IBusinessType } from '../schema'

interface GetColumnsOptions {
  onBind: (business: IBusinessType) => void
}

export function getColumns({ onBind }: GetColumnsOptions): ColumnDef<IBusinessType>[] {
  return [
    {
      accessorKey: 'account',
      header: '商务账号',
      cell: ({ row }) => <div className='max-w-[220px]'>{row.getValue('account')}</div>,
    },
    {
      accessorKey: 'userName',
      header: '商务名称',
      cell: ({ row }) => <div className='max-w-[220px]'>{row.getValue('userName')}</div>,
    },
    {
      accessorKey: 'disabledStatus',
      header: '状态',
      cell: ({ row }) => {
        const status = row.getValue('disabledStatus') as number
        return (
          <span
            className={
              status === 0 ? 'text-green-600' : 'text-red-600'
            }
          >
            {status === 0 ? '启用' : '禁用'}
          </span>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: '手机号',
      cell: ({ row }) => row.getValue('phone') || '-',
    },
    {
      accessorKey: 'createTime',
      header: '创建时间',
      cell: ({ row }) => {
        const time = row.getValue('createTime') as string
        return time ? time.replace('T', ' ').substring(0, 19) : '-'
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button
          variant='outline'
          size='sm'
          onClick={() => onBind(row.original)}
        >
          绑定商户
        </Button>
      ),
    },
  ]
}
