import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { type IAccountType } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getAccountColumns = (): ColumnDef<IAccountType>[] => {
  return [
    {
      accessorKey: 'userName',
      header: '姓名',
      enableHiding: false,
      cell: ({ row }) => row.getValue('userName'),
    },
    {
      accessorKey: 'account',
      header: '账号',
      cell: ({ row }) => row.getValue('account'),
    },
    {
      accessorKey: 'roleIds',
      header: '角色',
      cell: ({ row }) => {
        const roleId = row.getValue('roleIds') as number
        // TODO: 可以根据实际角色数据映射显示角色名称
        return roleId || '-'
      },
    },
    {
      accessorKey: 'disabledStatus',
      header: '状态',
      cell: ({ row }) => {
        const status = row.getValue('disabledStatus') as number
        return (
          <Badge variant={status === 0 ? 'default' : 'secondary'}>
            {status === 0 ? '启用' : '禁用'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createTime',
      header: '创建时间',
      cell: ({ row }) => row.getValue('createTime'),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
