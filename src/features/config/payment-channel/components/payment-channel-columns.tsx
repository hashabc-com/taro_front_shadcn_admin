import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type PaymentChannel } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getPaymentChannelColumns = (
  language: Language = 'zh'
): ColumnDef<PaymentChannel>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'channelCode',
      header: t('config.paymentChannel.channelCode'),
      cell: ({ row }) => {
        const code = row.getValue('channelCode') as string
        return <span className='font-mono text-sm'>{code}</span>
      },
    },
    {
      accessorKey: 'channelName',
      header: t('config.paymentChannel.channelName'),
    },
    {
      accessorKey: 'fundType',
      header: t('config.paymentChannel.fundType'),
      cell: ({ row }) => {
        const type = row.getValue('fundType') as number
        const typeMap = {
          1: { label: t('config.paymentChannel.collection'), variant: 'default' as const },
          2: { label: t('config.paymentChannel.payout'), variant: 'secondary' as const },
          3: { label: t('config.paymentChannel.both'), variant: 'outline' as const },
        }
        const config = typeMap[type as keyof typeof typeMap] || { label: '-', variant: 'outline' as const }
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      accessorKey: 'singleMaxAmount',
      header: t('config.paymentChannel.singleLimit'),
      cell: ({ row }) => {
        const min = row.original.singleMinAmount
        const max = row.getValue('singleMaxAmount') as number | null
        if (!min && !max) return '-'
        return (
          <div className='text-sm'>
            {min?.toFixed(2) || '0.00'} - {max?.toFixed(2) || '∞'}
          </div>
        )
      },
    },
    {
      accessorKey: 'dailyMaxAmount',
      header: t('config.paymentChannel.dailyLimit'),
      cell: ({ row }) => {
        const amount = row.getValue('dailyMaxAmount') as number | null
        return amount ? amount.toFixed(2) : '-'
      },
    },
    // {
    //   accessorKey: 'externalQuoteRate',
    //   header: t('config.paymentChannel.rate'),
    //   cell: ({ row }) => {
    //     const rate = row.getValue('externalQuoteRate') as number | null
    //     return rate ? `${(rate * 100).toFixed(2)}%` : '-'
    //   },
    // },
    {
      accessorKey: 'channelStatus',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('channelStatus') as number
        const statusMap = {
          1: { label: t('config.paymentChannel.statusNormal'), variant: 'default' as const },
          2: { label: t('config.paymentChannel.statusMaintenance'), variant: 'secondary' as const },
          3: { label: t('config.paymentChannel.statusPaused'), variant: 'destructive' as const },
        }
        const config = statusMap[status as keyof typeof statusMap] || { label: '-', variant: 'outline' as const }
        return <Badge variant={config.variant}>{config.label}</Badge>
      },
    },
    {
      accessorKey: 'runTimeRange',
      header: t('config.paymentChannel.runTimeRange'),
    },
    {
      accessorKey: 'country',
      header: t('common.country'),
      cell: ({ row }) => {
        const country = row.getValue('country') as string | null
        return country || '-'
      },
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
