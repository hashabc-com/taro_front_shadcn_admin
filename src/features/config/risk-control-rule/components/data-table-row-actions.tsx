import { type Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil } from 'lucide-react'
import { useLanguage } from '@/context/language-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type RuleConfig } from '../schema'

interface DataTableRowActionsProps {
  row: Row<RuleConfig>
  onEdit: (rule: RuleConfig) => void
  onDelete: (rule: RuleConfig) => void
}

export function DataTableRowActions({ row, onEdit }: DataTableRowActionsProps) {
  const rule = row.original
  const { t } = useLanguage()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>打开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => onEdit(rule)}>
          <Pencil className='mr-2 h-4 w-4' />
          {t('common.edit')}
        </DropdownMenuItem>
        {/* 暂时隐藏删除功能,与原 Vue 版本保持一致 */}
        {/* <DropdownMenuItem
          onClick={() => onDelete(rule)}
          className='text-red-600'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          删除
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
