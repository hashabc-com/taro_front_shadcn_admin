import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const route = getRouteApi('/_authenticated/business/merchant-bind')

export function MerchantBindSearch() {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()
  const [userName, setUserName] = useState(search.userName || '')

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        userName: userName || undefined,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setUserName('')

    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = userName

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {/* 商户订单号 */}
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('business.merchantBind.businessUserName')}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='w-[200px]'
        />
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
    </div>
    // <div className='flex flex-wrap items-center gap-3'>
    //   <div className='max-w-[200px] min-w-[120px] flex-1'>
    //     <Input
    //       placeholder='商务名称'
    //       value={searchContent}
    //       onChange={(e) => setSearchContent(e.target.value)}
    //       onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    //       className='w-[200px]'
    //     />
    //   </div>
    //   <Button onClick={handleSearch} size='sm'>
    //       <Search className='mr-2 h-4 w-4' />
    //       {t('common.search')}
    //     </Button>
    // </div>
  )
}
