import { getRouteApi } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'

const route = getRouteApi('/_authenticated/system/role-manage')

export function RoleManageSearch() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useI18n()

  const { fields, setField, handleSearch, handleReset, hasFilters } = useSearchForm({
    search,
    navigate,
    fieldKeys: ['createTimeBegin', 'createTimeEnd'] as const,
  })

  return (
    <>
      <div className='flex flex-wrap items-end gap-2'>
        <DateRangePicker
          mode='date'
          startTime={fields.createTimeBegin}
          endTime={fields.createTimeEnd}
          onStartTimeChange={(v) => setField('createTimeBegin', v)}
          onEndTimeChange={(v) => setField('createTimeEnd', v)}
        />

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
