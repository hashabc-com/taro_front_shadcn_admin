import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTablePagination } from '@/components/data-table'
import { useLanguage } from '@/context/language-provider'
import { getCustomerConsultColumns } from './customer-consult-columns'
import { useCustomerConsultData } from '../hooks/use-customer-consult-data'
import { FollowUpDialog } from './follow-up-dialog'
import { type ICustomerConsult } from '../schema'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function CustomerConsultTable() {
  const { data, isLoading, totalRecord } = useCustomerConsultData()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomerConsult | null>(null)
  const { t } = useLanguage()
  
  const { pagination, onPaginationChange, ensurePageInRange } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10, pageKey: 'pageNum' },
  })

  const pageCount = useMemo(() => {
    const pageSize = pagination.pageSize ?? 10
    return Math.max(1, Math.ceil((totalRecord ?? 0) / pageSize))
  }, [totalRecord, pagination.pageSize])

  const columns = useMemo(
    () => getCustomerConsultColumns(t, setSelectedCustomer),
    [t]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      pagination,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    onPaginationChange,
  })

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange, totalRecord, isLoading])

  return (
    <div className='flex flex-1 flex-col gap-4'>
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
        <div className='overflow-hidden rounded-md border'>
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
                    {row.getVisibleCells().map((cell) => {
                      const enableTooltip = cell.column.columnDef.meta?.enableTooltip
                      const cellContent = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )
                      
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            cell.column.columnDef.meta?.className,
                            cell.column.columnDef.meta?.tdClassName
                          )}
                        >
                          {enableTooltip ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='block truncate cursor-default'>
                                  {cellContent}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side='top' className='max-w-sm break-words'>
                                {cellContent}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            cellContent
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <DataTablePagination table={table} />
      
      <FollowUpDialog
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
      />
    </div>
  )
}
