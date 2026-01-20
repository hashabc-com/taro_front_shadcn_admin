// import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { RefreshCcw } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '@/components/data-table'

const route = getRouteApi('/_authenticated/logs/message-record')

type MessageRecordSearchProps<T> = {
  table: Table<T>
}

export function MessageRecordSearch<TData>({
  table,
}: MessageRecordSearchProps<TData>) {
  const navigate = route.useNavigate()
  const { t } = useLanguage()
  //   const search = route.useSearch()

  //   const [messageId, setMessageId] = useState(search.messageId || '')
  //   const [correlationId, setCorrelationId] = useState(
  //     search.correlationId || ''
  //   )
  //   const [queueName, setQueueName] = useState(search.queueName || '')
  //   const [consumerService, setConsumerService] = useState(
  //     search.consumerService || ''
  //   )

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        // messageId: messageId || undefined,
        // correlationId: correlationId || undefined,
        // queueName: queueName || undefined,
        // consumerService: consumerService || undefined,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  //   const handleReset = () => {
  //     setMessageId('')
  //     setCorrelationId('')
  //     setQueueName('')
  //     setConsumerService('')
  //     navigate({
  //       search: (prev) => ({
  //         pageNum: 1,
  //         pageSize: prev.pageSize,
  //       }),
  //     })
  //   }

  //   const hasFilters = messageId || correlationId || queueName || consumerService

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* <div className='max-w-[200px] min-w-[120px]'>
        <Input
          placeholder='消息ID'
          value={messageId}
          onChange={(e) => setMessageId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[160px] min-w-[120px]'>
        <Input
          placeholder='业务关联ID'
          value={correlationId}
          onChange={(e) => setCorrelationId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[200px] min-w-[120px]'>
        <Input
          placeholder='队列名称'
          value={queueName}
          onChange={(e) => setQueueName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[160px] min-w-[120px]'>
        <Input
          placeholder='消费服务'
          value={consumerService}
          onChange={(e) => setConsumerService(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div> */}

      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <RefreshCcw className='mr-2 h-4 w-4' />
          {t('common.refresh')}
        </Button>
        {/* {hasFilters && (
          <Button onClick={handleReset} variant='outline' size='sm'>
            <X className='mr-2 h-4 w-4' />
            重置
          </Button>
        )} */}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
