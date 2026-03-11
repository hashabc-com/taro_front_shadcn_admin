import { getRouteApi } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const route = getRouteApi('/_authenticated/business/merchant-bind')

export function MerchantBindSearch() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['userName'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.merchantBind.businessUserName')}
          value={fields.userName}
          onChange={(e) => setField('userName', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='w-[200px]'
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
    </div>
  )
}
