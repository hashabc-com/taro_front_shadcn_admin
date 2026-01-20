import { useLanguage } from '@/context/language-provider'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] max-w-[800px] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('logs.messageRecord.messageDetail')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.messageId')}:
            </div>
            <div className='break-all'>{record.messageId}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.messageType')}:
            </div>
            <div>{record.messageType}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.businessId')}:
            </div>
            <div>{record.correlationId}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.queueName')}:
            </div>
            <div>{record.queueName}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.exchangeName')}:
            </div>
            <div>{record.exchangeName || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.routingKey')}:
            </div>
            <div>{record.routingKey || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.consumerService')}:
            </div>
            <div>{record.consumerService || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.consumerServerIp')}:
            </div>
            <div>{record.consumerIp || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.consumeTime')}:
            </div>
            <div>{record.consumeTime}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.createTime')}:
            </div>
            <div>{record.createTime}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.updateTime')}:
            </div>
            <div>{record.updateTime}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
            <div className='font-medium'>
              {t('logs.messageRecord.messageContent')}:
            </div>
            <pre className='bg-muted max-h-[300px] overflow-auto rounded-md p-3 text-xs'>
              {formatJson(record.messageBody)}
            </pre>
          </div>
          {record.errorMsg && (
            <div className='grid grid-cols-[120px_1fr] gap-2 border-b pb-2 text-sm'>
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
