import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { type Role } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getRoleColumns = (
  language: Language = 'zh'
): ColumnDef<Role>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'role',
      header: t('system.roleManage.roleName'),
      meta: {
        className: 'w-[200px]',
      },
    },
    {
      accessorKey: 'createTime',
      header: t('common.createTime'),
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
      header: t('common.description'),
    },
    {
      id: 'actions',
      header: t('common.action'),
      meta: {
        className: 'w-[100px]',
      },
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
