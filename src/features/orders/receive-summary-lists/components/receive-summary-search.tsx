import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Download, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { useQuery } from '@tanstack/react-query'
import { getPaymentChannels,type IPaymentChannel } from '@/api/common'
import { useCountryStore, useMerchantStore } from '@/stores'
import { useLanguage } from '@/context/language-provider'
import { prepareExportReceive } from '@/api/order'
import { toast } from 'sonner'

const route = getRouteApi('/_authenticated/orders/receive-summary-lists')

type ReceiveListsSearchProps<TData> = {
  table: Table<TData>
}

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export function ReceiveListsSearch<TData>({
  table,
}: ReceiveListsSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { t } = useLanguage()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()

  const [channel, setChannel] = useState(search.channel)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.startTime ? new Date(search.startTime) : undefined,
    to: search.endTime ? new Date(search.endTime) : undefined,
  })

  const { data: receiveChannels } = useQuery({
    queryKey: ['common', 'receive-channels',selectedCountry?.code, selectedMerchant?.appid],
    queryFn: () => getPaymentChannels('pay_channel'),
  })
  const hasFilters =
    channel ||
    dateRange.from ||
    dateRange.to
  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1, // 重置到第一页
        channel: channel || undefined,
        startTime: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endTime: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        refresh: Date.now()
      }),
    })
  }

  const handleReset = () => {
    setChannel('')
    setDateRange({ from: undefined, to: undefined })

    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const handleExport = async () => {
    const res = await prepareExportReceive({startTime: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd HH:mm:ss') : '', endTime: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd HH:mm:ss') : ''})
    if (res.code === '200') {
      toast.success(t('common.exportTaskCreated'))
    } else {
      toast.error(res.message || t('common.exportFailed'))
    }
  }

  
  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 日期范围 */}
      <div className='max-w-[230px]'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start text-left font-normal'
            >
              <CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'yyyy-MM-dd', { locale: zhCN })} -{' '}
                    {format(dateRange.to, 'yyyy-MM-dd', { locale: zhCN })}
                  </>
                ) : (
                  format(dateRange.from, 'yyyy-MM-dd', { locale: zhCN })
                )
              ) : (
                <span className='text-muted-foreground'>{t('common.selectDateRange')}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                setDateRange({
                  from: range?.from,
                  to: range?.to,
                })
              }}
              numberOfMonths={2}
              locale={zhCN}
            />
          </PopoverContent>
        </Popover>
      </div>

      
      {/* 交易状态 */}
      <div className='max-w-[200px]'>
        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger id='channel'>
            <SelectValue placeholder={t('orders.receiveSummary.paymentChannel')} />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value='all'>全部渠道</SelectItem> */}
            {receiveChannels?.result.map((item: IPaymentChannel) => (
              <SelectItem key={item.itemValue} value={item.itemValue}>
                {item.itemName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 操作按钮 */}
      <div className='flex gap-2 mt-0.5'>
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
        <Button onClick={handleExport} variant='outline' size='sm'>
          <Download className='mr-2 h-4 w-4' />
          {t('common.export')}
        </Button>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
