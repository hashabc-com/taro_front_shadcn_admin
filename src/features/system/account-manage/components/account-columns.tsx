import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type IAccountType } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getAccountColumns = (
  language: Language = 'zh'
): ColumnDef<IAccountType>[] => {
  const t = (key: string) => getTranslation(language, key)
  
  return [
    {
      accessorKey: 'userName',
      header: t('system.accountManage.name'),
      enableHiding: false,
      cell: ({ row }) => row.getValue('userName'),
    },
    {
      accessorKey: 'account',
      header: t('system.accountManage.account'),
      cell: ({ row }) => row.getValue('account'),
    },
    {
      accessorKey: 'roleIds',
      header: t('common.role'),
      cell: ({ row }) => {
        const roleId = row.getValue('roleIds') as number
        // TODO: 可以根据实际角色数据映射显示角色名称
        return roleId || '-'
      },
    },
    {
      accessorKey: 'disabledStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('disabledStatus') as number
        return (
          <Badge variant={status === 0 ? 'default' : 'secondary'}>
            {status === 0 ? t('common.enabled') : t('common.disabled')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => row.getValue('createTime'),
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
