import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
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
import { getStatuses } from '../schema'
import {getProductDict} from '@/api/common'
import { useQuery } from '@tanstack/react-query'
import { useLanguage } from '@/context/language-provider'

const route = getRouteApi('/_authenticated/orders/receive-lists')

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
  const { t } = useLanguage()
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const [referenceno, setMerchantOrderNo] = useState(
    search.referenceno || ''
  )
  const [transId, setTransId] = useState(
    search.transId || ''
  )
  const [status, setStatus] = useState(search.status || '')
  const [pickupCenter, setPickupCenter] = useState(search.pickupCenter || '')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.startTime ? new Date(search.startTime) : undefined,
    to: search.endTime ? new Date(search.endTime) : undefined,
  })
  const {countryCode} = JSON.parse(localStorage.getItem('_userInfo') || '{}');

  const { data } = useQuery({
    queryKey: ['product-dict', countryCode],
    queryFn: () => getProductDict(countryCode)
  })

  const payinChannel = data?.result?.payinChannel || [];

  const statuses = getStatuses(t)

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1, // 重置到第一页
        referenceno: referenceno || undefined,
        transId: transId || undefined,
        status: status || undefined,
        pickupCenter: pickupCenter || undefined,
        startTime: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endTime: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        refresh: Date.now()
      }),
    })
  }

  const handleReset = () => {
    setMerchantOrderNo('')
    setTransId('')
    setStatus('')
    setPickupCenter('')
    setDateRange({ from: undefined, to: undefined })

    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters =
    referenceno ||
    transId ||
    status ||
    dateRange.from ||
    dateRange.to

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 商户订单号 */}
      <div className='max-w-[200px] flex-1 min-w-[120px]'>
        <Input
          id='referenceno'
          placeholder={t('orders.receiveOrders.merchantOrderNo')}
          value={referenceno}
          onChange={(e) => setMerchantOrderNo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] flex-1 min-w-[120px]'>
        <Input
          id='transId'
          placeholder={t('orders.receiveOrders.platformOrderNo')}
          value={transId}
          onChange={(e) => setTransId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 交易状态 */}
      <div className='max-w-[120px]'>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id='status'>
            <SelectValue placeholder={t('orders.receiveOrders.status')} />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <div className='flex items-center gap-2'>
                  {item.icon && <item.icon className='size-4' />}
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 产品 */}
      <div className='max-w-[120px]'>
        <Select value={pickupCenter} onValueChange={setPickupCenter}>
          <SelectTrigger id='pickupCenter'>
            <SelectValue placeholder={t('common.product')} />
          </SelectTrigger>
          <SelectContent>
            {payinChannel.map((item) => (
              <SelectItem key={item} value={item}>
                <div className='flex items-center gap-2'>
                  {item}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
