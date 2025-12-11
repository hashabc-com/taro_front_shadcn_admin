import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { zhCN } from 'date-fns/locale'
import { CalendarIcon, Search, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAccount } from './account-provider'

const route = getRouteApi('/_authenticated/system/account-manage')


type DateRange = {
  from: Date | undefined
  to: Date | undefined
}


export function AccountSearch() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { setOpen } = useAccount()

  const [dateRange, setDateRange] = useState<DateRange>({
      from: search.createTimeBegin ? new Date(search.createTimeBegin) : undefined,
      to: search.createTimeEnd ? new Date(search.createTimeEnd) : undefined,
    })

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1,
        searchType: null,
        createTimeBegin: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : null,
        createTimeEnd: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : null,
        refresh: Date.now()
      }),
    })
  }

  const handleReset = () => {
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
        createTimeBegin: null,
        createTimeEnd: null,
      }),
    })
  }

   const hasFilters = dateRange.from || dateRange.to

  return (
    <div className='flex flex-wrap items-center gap-2'>
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

      <Button onClick={() => setOpen('create')} size='sm' className='ml-auto'>
        <Plus className='mr-2 h-4 w-4' />
        添加管理员
      </Button>
    </div>
  )
}
