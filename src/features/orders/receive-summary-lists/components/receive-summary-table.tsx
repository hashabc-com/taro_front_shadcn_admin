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
import { DataTablePagination } from '@/components/data-table'
import { tasksColumns as columns } from './receive-summary-columns'
import { ReceiveListsSearch } from './receive-summary-search'
import { useReceiveSummaryData } from '../hooks/use-receive-summary-data'

const route = getRouteApi('/_authenticated/orders/receive-summary-lists')


export function ReceiveSummaryTable() {
  
  const { orders:data, isLoading,totalRecord, summaryData } = useReceiveSummaryData()

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Synced with URL states (updated to match route search schema defaults)
  const { pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      search: route.useSearch(),
      navigate: route.useNavigate(),
      pagination: { defaultPage: 1, defaultPageSize: 10, pageKey: 'pageNum' },
    })

  const pageCount = useMemo(() => {
      const pageSize = pagination.pageSize ?? 10
      // 如果 total 为空或为 0，至少为 1 页以避免 UI 显示 0 页
      return Math.max(1, Math.ceil((totalRecord ?? 0) / pageSize))
    }, [totalRecord, pagination.pageSize])

  // eslint-disable-next-line react-hooks/incompatible-library
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
  }, [pageCount, ensurePageInRange])

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <ReceiveListsSearch table={table} />
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
                <>
                  {table.getRowModel().rows.map((row) => (
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
                  ))}
                  {/* 合计行 */}
                  <TableRow className='bg-muted/50 font-semibold'>
                    <TableCell colSpan={3} className='text-right'>
                      合计
                    </TableCell>
                    <TableCell>
                      {summaryData.orderTotal}
                    </TableCell>
                    <TableCell>
                      {summaryData.amountTotal}
                    </TableCell>
                    <TableCell>
                      {summaryData.amountServiceTotal}
                    </TableCell>
                    <TableCell>
                      {summaryData.totalAmountTotal}
                    </TableCell>
                  </TableRow>
                </>
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
    </div>
  )
}
