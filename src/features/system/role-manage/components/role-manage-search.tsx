import { useState } from 'react'
import { format } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
import { zhCN } from 'date-fns/locale'
import { Search, CalendarIcon, X } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

const route = getRouteApi('/_authenticated/system/role-manage')

export function RoleManageSearch() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useI18n()

  // const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: search.createTimeBegin ? new Date(search.createTimeBegin) : undefined,
    to: search.createTimeEnd ? new Date(search.createTimeEnd) : undefined,
  })

  // 获取角色列表用于下拉框
  //   const { data: rolesData } = useQuery({
  //     queryKey: ['all-roles'],
  //     queryFn: getAllRoles,
  //   })

  //   const roles = rolesData?.result || []

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1, // 重置到第一页
        createTimeBegin: dateRange.from
          ? format(dateRange.from, 'yyyy-MM-dd')
          : undefined,
        createTimeEnd: dateRange.to
          ? format(dateRange.to, 'yyyy-MM-dd')
          : undefined,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined })
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = search.createTimeBegin || search.createTimeEnd

  return (
    <>
      <div className='flex flex-wrap items-end gap-2'>
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
      </div>
    </>
  )
}
