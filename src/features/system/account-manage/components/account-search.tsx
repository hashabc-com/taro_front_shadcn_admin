import { getRouteApi } from '@tanstack/react-router'
import { Search, X, Plus } from 'lucide-react'
import { useI18n } from '@/hooks/use-i18n'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/date-range-picker'
import { useAccount } from './account-provider'

const route = getRouteApi('/_authenticated/system/account-manage')

export function AccountSearch() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { setOpen } = useAccount()
  const { t } = useI18n()

  const { fields, setField, handleSearch, handleReset, hasFilters } = useSearchForm({
    search,
    navigate,
    fieldKeys: ['createTimeBegin', 'createTimeEnd'] as const,
  })

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div>
        <DateRangePicker
        mode='date'
        startTime={fields.createTimeBegin}
        endTime={fields.createTimeEnd}
        onStartTimeChange={(v) => setField('createTimeBegin', v)}
        onEndTimeChange={(v) => setField('createTimeEnd', v)}
      />

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

      <Button onClick={() => setOpen('create')} size='sm' className='ml-auto'>
        <Plus className='mr-2 h-4 w-4' />
        {t('system.accountManage.addAdministrator')}
      </Button>
    </div>
  )
}
