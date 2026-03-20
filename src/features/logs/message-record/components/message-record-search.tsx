import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Plus, Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/data-table'
import { useSearchForm } from '@/hooks/use-search-form'
import { useMessageRecord } from './message-record-provider'

const route = getRouteApi('/_authenticated/logs/message-record')

type MessageRecordSearchProps<T> = {
  table: Table<T>
}

export function MessageRecordSearch<TData>({
  table,
}: MessageRecordSearchProps<TData>) {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { t } = useLanguage()
  const { setOpen } = useMessageRecord()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: [
        'messageId',
        'correlationId',
        'queueName',
        'consumerService',
        'consumeStatus',
      ] as const,
    })

  // const handleRefresh = () => {
  //   navigate({
  //     search: (prev) => ({
  //       ...prev,
  //       pageNum: 1,
  //       refresh: Date.now(),
  //     }),
  //   })
  // }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <Input
        className='h-8 max-w-[180px]'
        placeholder={t('logs.messageRecord.messageId')}
        value={fields.messageId}
        onChange={(e) => setField('messageId', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Input
        className='h-8 max-w-[180px]'
        placeholder={t('logs.messageRecord.businessId')}
        value={fields.correlationId}
        onChange={(e) => setField('correlationId', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Input
        className='h-8 max-w-[180px]'
        placeholder={t('logs.messageRecord.queueName')}
        value={fields.queueName}
        onChange={(e) => setField('queueName', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Input
        className='h-8 max-w-[160px]'
        placeholder={t('logs.messageRecord.consumerService')}
        value={fields.consumerService}
        onChange={(e) => setField('consumerService', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Select
        value={fields.consumeStatus}
        onValueChange={(v) => setField('consumeStatus', v)}
      >
        <SelectTrigger clearable={false} className='h-8 w-[130px]'>
          <SelectValue placeholder={t('logs.messageRecord.consumeStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='0'>
            {t('logs.messageRecord.statusFailed')}
          </SelectItem>
          <SelectItem value='1'>
            {t('logs.messageRecord.statusSuccess')}
          </SelectItem>
          <SelectItem value='2'>
            {t('logs.messageRecord.statusRetrying')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} size='sm'>
        <Search className='mr-2 h-4 w-4' />
        {t('common.search')}
      </Button>
      {hasFilters && (
        <Button onClick={handleReset} variant='outline' size='sm'>
          <X className='mr-2 h-4 w-4' />
          {t('common.reset')}
        </Button>
      )}
      {/* <Button onClick={handleRefresh} variant='outline' size='sm'>
        <RefreshCcw className='mr-1 h-4 w-4' />
        {t('common.refresh')}
      </Button> */}
      <Button
        onClick={() => setOpen('add')}
        size='sm'
      >
        <Plus className='mr-1 h-4 w-4' />
        {t('logs.messageRecord.addMessage')}
      </Button>

      <DataTableViewOptions table={table} />
    </div>
  )
}
