import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { sceneCodeMap } from '../schema'
import { DataTableViewOptions } from '@/components/data-table'
import type { Table } from '@tanstack/react-table'

const route = getRouteApi('/_authenticated/config/risk-control-rule')

type RuleConfigSearchProps<TData> = {
  table: Table<TData>
}

export function RuleConfigSearch<TData>({
  table,
}: RuleConfigSearchProps<TData>) {
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const [ruleName, setRuleName] = useState(search.ruleName || '')
  const [sceneCode, setSceneCode] = useState<string | undefined>(
    search.sceneCode || undefined
  )
  const [status, setStatus] = useState<string | undefined>(search.status)

  const handleSearch = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        pageNum: 1,
        ruleName: ruleName || undefined,
        sceneCode: sceneCode || undefined,
        status: status,
        refresh: Date.now()
      }),
    })
  }

  const handleReset = () => {
    setRuleName('')
    setSceneCode('')
    setStatus('')
    navigate({
      search: (prev) => ({
        pageNum: 1,
        pageSize: prev.pageSize,
      }),
    })
  }

  const hasFilters = ruleName || sceneCode || status

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex flex-col gap-2'>
        <Input
          placeholder='规则名称'
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          className='w-[160px]'
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <Select value={sceneCode} onValueChange={setSceneCode}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder='规则场景' />
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
          value={status?.toString()}
          onValueChange={(value) => setStatus(value)}
        >
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='状态' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>启用</SelectItem>
            <SelectItem value='0'>禁用</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-0.5 flex gap-2'>
        <Button onClick={handleSearch} size='sm'>
          <Search className='mr-2 h-4 w-4' />
          搜索
        </Button>
        {!!hasFilters && (
          <Button onClick={handleReset} variant='outline' size='sm'>
            <X className='mr-2 h-4 w-4' />
            重置
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
