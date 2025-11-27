import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X } from 'lucide-react'
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
import { statuses, types } from '../schema'

const route = getRouteApi('/_authenticated/fund/settlement-lists')

type SettlementListsSearchProps<TData> = {
  table: Table<TData>
}

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export function SettlementListsSearch<TData>({
  table,
}: SettlementListsSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const [status, setStatus] = useState(search.status || '')
  const [type, setType] = useState(search.type || '')
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.startTime ? new Date(search.startTime) : undefined,
    to: search.endTime ? new Date(search.endTime) : undefined,
  })

  const hasFilters = status || type || dateRange.from || dateRange.to
  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1, // 重置到第一页
        status: status || undefined,
        type: type || undefined,
        startTime: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        endTime: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined,
      }),
    })
  }

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined })
    setStatus('')
    setType('')
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
      <div className='max-w-[230px]'>
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
                <span className='text-muted-foreground'>选择日期范围</span>
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

      <div className='max-w-[120px]'>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id='type'>
            <SelectValue placeholder='类型' />
          </SelectTrigger>
          <SelectContent>
            {types.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id='status'>
            <SelectValue placeholder='交易状态' />
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

      {/* 操作按钮 */}
      <div className='mt-0.5 flex gap-2'>
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
