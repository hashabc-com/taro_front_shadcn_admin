import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
import { getTranslation } from '@/lib/i18n'
import { useLanguage } from '@/context/language-provider'
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
import { statuses } from '../schema'

// const statuses = {
//   0:{
//     label: '付款成功',
//     icon: CheckCircle,
//   },
//   1:{
//     label: '待付款',
//     icon: Clock,
//   },
//   2:{
//     label: '付款失败',
//     icon: XCircle,
//   },
// }

// const statuses = [
//   {
//     label: '付款成功',
//     value: '0' as const,
//     icon: CheckCircle,
//   },
//   {
//     label: '待付款',
//     value: '1' as const,
//     icon: Clock,
//   },
//   {
//     label: '付款失败',
//     value: '2' as const,
//     icon: XCircle,
//   },
// ]

const route = getRouteApi('/_authenticated/orders/payment-lists')

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
  const { lang } = useLanguage()
  const t = (key: string) => getTranslation(lang, key)
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const [refNo, setRefNo] = useState(search.refNo || '')
  const [transId, setTransId] = useState(search.transId || '')
  const [status, setStatus] = useState(search.status || '')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.startTime ? new Date(search.startTime) : undefined,
    to: search.endTime ? new Date(search.endTime) : undefined,
  })

  const hasFilters =
    refNo || status || transId || dateRange.from || dateRange.to
  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1, // 重置到第一页
        refNo: refNo || undefined,
        transId: transId || undefined,
        status: status || undefined,
        startTime: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endTime: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined })
    setRefNo('')
    setTransId('')
    setStatus('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 日期范围 */}
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start text-left font-normal'
            >
              <CalendarIcon className='text-muted-foreground mr-2 h-4 w-4' />
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
                <span className='text-muted-foreground'>
                  {t('common.selectDateRange')}
                </span>
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
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='transId'
          placeholder={t('orders.paymentOrders.merchantOrderNo')}
          value={transId}
          onChange={(e) => setTransId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          id='refNo'
          placeholder={t('orders.paymentOrders.platformOrderNo')}
          value={refNo}
          onChange={(e) => setRefNo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 交易状态 */}
      <div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id='status' clearable>
            <SelectValue placeholder={t('orders.paymentOrders.status')} />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statuses).map((key) => {
              const item = statuses[key as unknown as keyof typeof statuses]
              return (
                <SelectItem key={key} value={key}>
                  <div className='flex items-center gap-2'>
                    {item.icon && <item.icon className='size-4' />}
                    {t(item.i18n)}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* 操作按钮 */}
      <div className='mt-0.5 flex gap-2'>
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
