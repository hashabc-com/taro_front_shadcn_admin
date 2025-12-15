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
      accessorKey: 'customerName',
      header: t('config.paymentChannel.merchantName'),
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
      accessorKey: 'type',
      header: t('config.paymentChannel.collectionPayout'),
      cell: ({ row }) => {
        const type = row.getValue('type') as number
        return (
          <Badge variant={type === 1 ? 'default' : 'secondary'}>
            {type === 1 ? t('config.paymentChannel.payout') : t('config.paymentChannel.collection')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'channel',
      header: t('config.paymentChannel.supportedChannels'),
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
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as number
        return (
          <Badge variant={status === 1 ? 'default' : 'destructive'}>
            {status === 1 ? t('common.enabled') : t('common.disabled')}
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
