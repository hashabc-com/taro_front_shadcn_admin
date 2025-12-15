import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Eye } from 'lucide-react'
import type { IMessageRecordType } from '../schema'

export const getColumns = (
  onViewDetail: (record: IMessageRecordType) => void,
  language: Language = 'zh'
): ColumnDef<IMessageRecordType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      enableHiding: false
    },
    {
      accessorKey: 'messageId',
      header: t('logs.messageRecord.messageId'),
      enableHiding: false
    },
    {
      accessorKey: 'messageType',
      header: t('logs.messageRecord.messageType'),
      enableHiding: false
    },
    {
      accessorKey: 'correlationId',
      header: t('logs.messageRecord.businessId')
    },
    {
      accessorKey: 'queueName',
      header: t('logs.messageRecord.queueName')
    },
    {
      accessorKey: 'exchangeName',
      header: t('logs.messageRecord.exchangeName')
    },
    {
      accessorKey: 'routingKey',
      header: t('logs.messageRecord.routingKey')
    },
    {
      accessorKey: 'consumerService',
      header: t('logs.messageRecord.consumerService')
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => (
        <div className='flex justify-center items-center gap-1 cursor-pointer'  onClick={() => onViewDetail(row.original)}>
          <Eye className='h-4 w-4' />
            {t('logs.messageRecord.viewDetail')}
        </div>
      ),
      size: 80,
    },
  ]
}
