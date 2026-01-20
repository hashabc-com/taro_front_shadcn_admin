import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableViewOptions } from '@/components/data-table'
import type { IRiskControlType } from '../schema'

const route = getRouteApi('/_authenticated/logs/risk-control')

type RiskControlSearchProps = {
  table: Table<IRiskControlType>
}

export function RiskControlSearch({ table }: RiskControlSearchProps) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()
  const [ruleName, setRuleName] = useState(search.ruleName || '')
  const [businessType, setBusinessType] = useState<string | undefined>(
    search.businessType
  )

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        ruleName: ruleName || undefined,
        businessType: businessType as 'PAY_PAYIN' | 'PAY_PAYOUT' | undefined,
        pageNum: 1,
        refresh: Date.now(),
      }),
    })
  }

  const handleReset = () => {
    setRuleName('')
    setBusinessType('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = ruleName || businessType

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('logs.riskControl.ruleName')}
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[160px]'>
        <Select value={businessType} onValueChange={setBusinessType}>
          <SelectTrigger>
            <SelectValue placeholder={t('logs.riskControl.businessType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='PAY_PAYIN'>
              {t('logs.riskControl.payin')}
            </SelectItem>
            <SelectItem value='PAY_PAYOUT'>
              {t('logs.riskControl.payout')}
            </SelectItem>
          </SelectContent>
        </Select>
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

      <DataTableViewOptions table={table} />
    </div>
  )
}
