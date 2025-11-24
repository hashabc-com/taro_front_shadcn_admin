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
import { statuses } from '../data/data'

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
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const [referenceno, setMerchantOrderNo] = useState(
    search.referenceno || ''
  )
  const [tripartiteOrder, setThirdPartyOrderNo] = useState(
    search.tripartiteOrder || ''
  )
  const [transId, setTransId] = useState(
    search.transId || ''
  )
  const [status, setStatus] = useState(search.status || '')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.startTime ? new Date(search.startTime) : undefined,
    to: search.endTime ? new Date(search.endTime) : undefined,
  })

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1, // 重置到第一页
        referenceno: referenceno || undefined,
        tripartiteOrder: tripartiteOrder || undefined,
        transId: transId || undefined,
        status: status && status !== 'all' ? status : undefined,
        startTime: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endTime: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
    })
  }

  const handleReset = () => {
    setMerchantOrderNo('')
    setThirdPartyOrderNo('')
    setTransId('')
    setStatus('')
    setDateRange({ from: undefined, to: undefined })

    navigate({
      search: (prev) => ({
        page: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters =
    referenceno ||
    tripartiteOrder ||
    transId ||
    status ||
    dateRange.from ||
    dateRange.to

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 商户订单号 */}
      <div className='max-w-[200px] flex-1'>
        <Input
          id='referenceno'
          placeholder='请输入商户订单号'
          value={referenceno}
          onChange={(e) => setMerchantOrderNo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 三方订单号 */}
      <div className='max-w-[200px] flex-1'>
        <Input
          id='tripartiteOrder'
          placeholder='请输入三方订单号'
          value={tripartiteOrder}
          onChange={(e) => setThirdPartyOrderNo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div className='max-w-[200px] flex-1'>
        <Input
          id='transId'
          placeholder='平台订单号'
          value={transId}
          onChange={(e) => setTransId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {/* 交易状态 */}
      <div className='max-w-[120px]'>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id='status'>
            <SelectValue placeholder='全部状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>全部状态</SelectItem>
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

      {/* 日期范围 */}
      <div className='max-w-[220px]'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='w-full justify-start text-left font-normal'
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
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
                <span>选择日期范围</span>
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
          搜索
        </Button>
        {hasFilters && (
          <Button onClick={handleReset} variant='outline' size='sm'>
            <X className='mr-2 h-4 w-4' />
            重置
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
