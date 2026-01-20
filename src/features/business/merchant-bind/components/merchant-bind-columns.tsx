import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { type IBusinessType } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

interface GetColumnsOptions {
  language?: Language
}

export function getColumns({
  language = 'zh',
}: GetColumnsOptions): ColumnDef<IBusinessType>[] {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'account',
      header: t('business.merchantBind.businessAccount'),
      cell: ({ row }) => (
        <div className='max-w-[220px]'>{row.getValue('account')}</div>
      ),
    },
    {
      accessorKey: 'userName',
      header: t('business.merchantBind.businessUserName'),
      cell: ({ row }) => (
        <div className='max-w-[220px]'>{row.getValue('userName')}</div>
      ),
    },
    {
      accessorKey: 'disabledStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('disabledStatus') as number
        return (
          <span className={status === 0 ? 'text-green-600' : 'text-red-600'}>
            {status === 0 ? t('common.enabled') : t('common.disabled')}
          </span>
        )
      },
    },
    {
      accessorKey: 'phone',
      header: t('common.phone'),
      cell: ({ row }) => row.getValue('phone') || '-',
    },
    {
      accessorKey: 'createTime',
      header: t('common.createTime'),
      cell: ({ row }) => {
        const time = row.getValue('createTime') as string
        return time ? time.replace('T', ' ').substring(0, 19) : '-'
      },
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
      // cell: ({ row }) => (
      //   <Button
      //     variant='outline'
      //     size='sm'
      //     onClick={() => onBind(row.original)}
      //   >
      //     {t('business.merchantBind.bindMerchant')}
      //   </Button>
      // ),
    },
  ]
}
