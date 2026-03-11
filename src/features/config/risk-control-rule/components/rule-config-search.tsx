import { getRouteApi } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
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
import { sceneCodeMap } from '../schema'

const route = getRouteApi('/_authenticated/config/risk-control-rule')

type RuleConfigSearchProps<TData> = {
  table: Table<TData>
}

export function RuleConfigSearch<TData>({
  table,
}: RuleConfigSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()
  const { t } = useLanguage()

  const { fields, setField, handleSearch, handleReset, hasFilters } =
    useSearchForm({
      search,
      navigate,
      fieldKeys: ['ruleName', 'sceneCode', 'status'] as const,
    })

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <Input
          placeholder={t('config.riskControlRule.ruleName')}
          value={fields.ruleName}
          onChange={(e) => setField('ruleName', e.target.value)}
          className='w-[160px]'
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Select value={fields.sceneCode} onValueChange={(v) => setField('sceneCode', v)}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder={t('config.riskControlRule.ruleScene')} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sceneCodeMap).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-2'>
        <Select
          value={fields.status}
          onValueChange={(v) => setField('status', v)}
        >
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder={t('config.riskControlRule.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>{t('common.enabled')}</SelectItem>
            <SelectItem value='0'>{t('common.disabled')}</SelectItem>
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
