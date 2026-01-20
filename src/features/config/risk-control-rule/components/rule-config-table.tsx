import { useMemo, useState, useCallback } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { useRuleConfigData } from '../hooks/use-rule-config-data'
import { type RuleConfig } from '../schema'
import { getColumns } from './rule-config-columns'
import { RuleConfigSearch } from './rule-config-search'
import { RuleEditDialog } from './rule-edit-dialog'

const route = getRouteApi('/_authenticated/config/risk-control-rule')

export function RuleConfigTable() {
  const { data, isLoading, totalRecord } = useRuleConfigData()

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [currentRule, setCurrentRule] = useState<RuleConfig | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const { lang } = useLanguage()
  // Synced with URL states
  const { pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      search: route.useSearch(),
      navigate: route.useNavigate() as never,
      pagination: { defaultPage: 1, defaultPageSize: 10, pageKey: 'pageNum' },
    })

  const pageCount = useMemo(() => {
    const pageSize = pagination.pageSize ?? 10
    return Math.max(1, Math.ceil((totalRecord ?? 0) / pageSize))
  }, [totalRecord, pagination.pageSize])

  // Action handlers
  const handleEdit = useCallback((rule: RuleConfig) => {
    setCurrentRule(rule)
    setEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((rule: RuleConfig) => {
    console.log('Delete rule:', rule)
    // 暂时不实现删除功能,与原 Vue 版本保持一致
  }, [])

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete, lang),
    [handleEdit, handleDelete, lang]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      pagination,
    },
    pageCount,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  // Ensure page is in valid range
  ensurePageInRange(pageCount)

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <RuleConfigSearch table={table} />
      {isLoading ? (
        <div className='overflow-hidden rounded-md border'>
          <div className='space-y-3 p-4'>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className='flex gap-4'>
                <Skeleton className='h-12 flex-1' />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.columnDef.meta?.className,
                          cell.column.columnDef.meta?.tdClassName
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <DataTablePagination table={table} className='mt-auto' />

      <RuleEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        rule={currentRule}
        isAdd={false}
      />
    </div>
  )
}
