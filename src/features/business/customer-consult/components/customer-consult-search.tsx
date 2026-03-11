import { getRouteApi } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function CustomerConsultSearch() {
  const { t } = useLanguage()
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['contactPerson', 'phone', 'email', 'company'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.contactPerson')}
          value={fields.contactPerson}
          onChange={(e) => setField('contactPerson', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.phone')}
          value={fields.phone}
          onChange={(e) => setField('phone', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.email')}
          value={fields.email}
          onChange={(e) => setField('email', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.company')}
          value={fields.company}
          onChange={(e) => setField('company', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

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
  )
}
