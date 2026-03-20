import { useLanguage } from '@/context/language-provider'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { IMessageRecordType } from '../schema'

type MessageDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: IMessageRecordType | null
}

export function MessageDetailDialog({
  open,
  onOpenChange,
  record,
}: MessageDetailDialogProps) {
  const { t } = useLanguage()

  if (!record) return null

  const formatJson = (jsonStr: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2)
    } catch {
      return jsonStr
    }
  }

  const getStatusBadge = (status: number | null | undefined) => {
    if (status == null) return '-'
    const map: Record<number, { label: string; className: string }> = {
      0: {
        label: t('logs.messageRecord.statusFailed'),
        className: 'border-destructive text-destructive',
      },
      1: {
        label: t('logs.messageRecord.statusSuccess'),
        className: 'border-green-600 text-green-600',
      },
      2: {
        label: t('logs.messageRecord.statusRetrying'),
        className: 'border-yellow-600 text-yellow-600',
      },
    }
    const info = map[status]
    if (!info) return status
    return (
      <Badge variant='outline' className={cn(info.className)}>
        {info.label}
      </Badge>
    )
  }

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: t('logs.messageRecord.messageId'), value: record.messageId },
    { label: t('logs.messageRecord.messageType'), value: record.messageType },
    { label: t('logs.messageRecord.businessId'), value: record.correlationId },
    { label: t('logs.messageRecord.queueName'), value: record.queueName },
    {
      label: t('logs.messageRecord.exchangeName'),
      value: record.exchangeName || '-',
    },
    {
      label: t('logs.messageRecord.routingKey'),
      value: record.routingKey || '-',
    },
    {
      label: t('logs.messageRecord.consumerService'),
      value: record.consumerService || '-',
    },
    {
      label: t('logs.messageRecord.consumerServerIp'),
      value: record.consumerIp || '-',
    },
    {
      label: t('logs.messageRecord.consumeStatus'),
      value: getStatusBadge(record.consumeStatus),
    },
    {
      label: t('logs.messageRecord.retryCount'),
      value: record.retryCount ?? 0,
    },
    { label: t('logs.messageRecord.consumeTime'), value: record.consumeTime },
    { label: t('logs.messageRecord.createTime'), value: record.createTime },
    { label: t('logs.messageRecord.updateTime'), value: record.updateTime },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] max-w-[800px] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('logs.messageRecord.messageDetail')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className='grid grid-cols-[140px_1fr] gap-2 border-b pb-2 text-sm'
            >
              <div className='font-medium'>{label}:</div>
              <div className='break-all'>{value}</div>
            </div>
          ))}
          <div className='grid grid-cols-[140px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.messageContent')}:
            </div>
            <pre className='bg-muted max-h-[300px] overflow-auto rounded-md p-3 text-xs'>
              {formatJson(record.messageBody)}
            </pre>
          </div>
          {record.errorMsg && (
            <div className='grid grid-cols-[140px_1fr] gap-2 border-b pb-2 text-sm'>
              <div className='font-medium'>
                {t('logs.messageRecord.errorMessage')}:
              </div>
              <pre className='bg-destructive/10 text-destructive max-h-[200px] overflow-auto rounded-md p-3 text-xs'>
                {record.errorMsg}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
