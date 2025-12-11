import { type ColumnDef } from '@tanstack/react-table'
import { type Role } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'
import { format } from 'date-fns'

export const getRoleColumns = (): ColumnDef<Role>[] => {
  return [
    {
      accessorKey: 'role',
      header: '角色名',
      meta: {
        className: 'w-[200px]',
      },
    },
    {
      accessorKey: 'createTime',
      header: '创建时间',
      meta: {
        className: 'w-[200px]',
      },
      cell: ({ row }) => {
        const time = row.getValue('createTime') as string
        try {
          return format(new Date(time), 'yyyy-MM-dd HH:mm:ss')
        } catch {
          return time
        }
      },
    },
    {
      accessorKey: 'description',
      header: '描述',
    },
    {
      id: 'actions',
      header: '操作',
      meta: {
        className: 'w-[100px]',
      },
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
