import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import type { IMessageRecordType } from '../schema'

const consumeStatusMap = (
  t: (key: string) => string
): Record<number, { label: string; variant: 'destructive' | 'default' | 'secondary' }> => ({
  0: { label: t('logs.messageRecord.statusFailed'), variant: 'destructive' },
  1: { label: t('logs.messageRecord.statusSuccess'), variant: 'default' },
  2: { label: t('logs.messageRecord.statusRetrying'), variant: 'secondary' },
})

export const getColumns = (
  onViewDetail: (record: IMessageRecordType) => void,
  language: Language = 'zh'
): ColumnDef<IMessageRecordType>[] => {
  const t = (key: string) => getTranslation(language, key)
  const statusMap = consumeStatusMap(t)

  return [
    {
      accessorKey: 'id',
      header: 'ID',
      enableHiding: false,
    },
    {
      accessorKey: 'messageId',
      header: t('logs.messageRecord.messageId'),
      enableHiding: false,
    },
    {
      accessorKey: 'messageType',
      header: t('logs.messageRecord.messageType'),
      enableHiding: false,
    },
    {
      accessorKey: 'correlationId',
      header: t('logs.messageRecord.businessId'),
    },
    {
      accessorKey: 'queueName',
      header: t('logs.messageRecord.queueName'),
    },
    {
      accessorKey: 'exchangeName',
      header: t('logs.messageRecord.exchangeName'),
    },
    {
      accessorKey: 'routingKey',
      header: t('logs.messageRecord.routingKey'),
    },
    {
      accessorKey: 'consumerService',
      header: t('logs.messageRecord.consumerService'),
    },
    {
      accessorKey: 'consumeStatus',
      header: t('logs.messageRecord.consumeStatus'),
      cell: ({ row }) => {
        const status = row.original.consumeStatus
        if (status == null) return '-'
        const info = statusMap[status]
        if (!info) return status
        return (
          <Badge
            variant='outline'
            className={cn(
              info.variant === 'destructive' &&
                'border-destructive text-destructive',
              info.variant === 'default' &&
                'border-green-600 text-green-600',
              info.variant === 'secondary' &&
                'border-yellow-600 text-yellow-600'
            )}
          >
            {info.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'retryCount',
      header: t('logs.messageRecord.retryCount'),
      cell: ({ row }) => row.original.retryCount ?? 0,
    },
    {
      accessorKey: 'consumeTime',
      header: t('logs.messageRecord.consumeTime'),
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => (
        <div
          className='flex cursor-pointer items-center justify-center gap-1 text-primary hover:underline'
          onClick={() => onViewDetail(row.original)}
        >
          <Eye className='h-4 w-4' />
          {t('logs.messageRecord.viewDetail')}
        </div>
      ),
      size: 100,
      meta: {
        className:
          'sticky right-0 bg-background before:pointer-events-none before:absolute before:inset-y-0 before:-left-4 before:w-4 before:shadow-[inset_-10px_0_8px_-8px_rgba(0,0,0,0.08)]',
      },
    },
  ]
}
