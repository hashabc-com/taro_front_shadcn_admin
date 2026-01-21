import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function CustomerConsultSearch() {
  const { t } = useLanguage()
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const [contactPerson, setContactPerson] = useState(
    search.contactPerson || ''
  )
  const [phone, setPhone] = useState(search.phone || '')
  const [email, setEmail] = useState(search.email || '')
  const [company, setCompany] = useState(search.company || '')

  const hasFilters = contactPerson || phone || email || company

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1, // 重置到第一页
        contactPerson: contactPerson || undefined,
        phone: phone || undefined,
        email: email || undefined,
        company: company || undefined,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setContactPerson('')
    setPhone('')
    setEmail('')
    setCompany('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.contactPerson')}
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.phone')}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[180px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.customerConsult.company')}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
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
