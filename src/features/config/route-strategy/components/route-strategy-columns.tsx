import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type RouteStrategy } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getRouteStrategyColumns = (
  language: Language = 'zh'
): ColumnDef<RouteStrategy>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'customerName',
      header: t('config.routeStrategy.merchantName'),
    },
    {
      accessorKey: 'paymentType',
      header: t('config.routeStrategy.type'),
      cell: ({ row }) => {
        const type = row.getValue('paymentType') as string
        return (
          <Badge variant={type === '1' ? 'default' : 'secondary'}>
            {type === '1'
              ? t('config.routeStrategy.payout')
              : t('config.routeStrategy.collection')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'productCode',
      header: t('config.routeStrategy.paymentMethod'),
    },
    {
      accessorKey: 'routeStrategy',
      header: t('config.routeStrategy.routeStrategy'),
      cell: ({ row }) => {
        const strategy = row.getValue('routeStrategy') as string
        return (
          <Badge variant='outline'>
            {strategy === '1'
              ? t('config.routeStrategy.weightRoundRobin')
              : t('config.routeStrategy.costPriority')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge variant={status === '0' ? 'default' : 'destructive'}>
            {status === '0' ? t('common.enabled') : t('common.disabled')}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
