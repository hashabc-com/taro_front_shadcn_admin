import { getRouteApi } from '@tanstack/react-router'
import { type Table } from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { useSearchForm } from '@/hooks/use-search-form'
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

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['ruleName', 'businessType'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='max-w-[200px] min-w-[120px] flex-1'>
        <Input
          placeholder={t('logs.riskControl.ruleName')}
          value={fields.ruleName}
          onChange={(e) => setField('ruleName', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='max-w-[160px]'>
        <Select value={fields.businessType} onValueChange={(v) => setField('businessType', v)}>
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
