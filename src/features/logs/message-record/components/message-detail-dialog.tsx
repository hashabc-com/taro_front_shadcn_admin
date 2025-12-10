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
      <DialogContent className='max-w-[800px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>消息详情</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>消息ID:</div>
            <div className='break-all'>{record.messageId}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>消息类型:</div>
            <div>{record.messageType}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>业务关联ID:</div>
            <div>{record.correlationId}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>队列名称:</div>
            <div>{record.queueName}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>交换机名称:</div>
            <div>{record.exchangeName || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>路由键:</div>
            <div>{record.routingKey || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>消费服务:</div>
            <div>{record.consumerService || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>消费服务器IP:</div>
            <div>{record.consumerIp || '-'}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>消费时间:</div>
            <div>{record.consumeTime}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>创建时间:</div>
            <div>{record.createTime}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>更新时间:</div>
            <div>{record.updateTime}</div>
          </div>
          <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
            <div className='font-medium'>消息内容:</div>
            <pre className='bg-muted p-3 rounded-md overflow-auto max-h-[300px] text-xs'>
              {formatJson(record.messageBody)}
            </pre>
          </div>
          {record.errorMsg && (
            <div className='grid grid-cols-[120px_1fr] gap-2 text-sm border-b pb-2'>
              <div className='font-medium'>错误信息:</div>
              <pre className='bg-destructive/10 text-destructive p-3 rounded-md overflow-auto max-h-[200px] text-xs'>
                {record.errorMsg}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
