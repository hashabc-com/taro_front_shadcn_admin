import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  type ColumnDef,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
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

type FeatureDataTableProps<TData> = {
  /** Column definitions */
  columns: ColumnDef<TData, unknown>[]
  /** Table data */
  data: TData[]
  /** Total number of records for pagination */
  totalRecord: number
  /** Whether the data is loading */
  isLoading: boolean
  /** Route search params (from `route.useSearch()`) */
  search: Record<string, unknown>
  /** Route navigate function (from `route.useNavigate()`) */
  navigate: NavigateFn
  /**
   * Render the search/filter toolbar.
   * Receives the table instance so toolbar can use it for column visibility, etc.
   */
  renderToolbar?: (table: ReturnType<typeof useReactTable<TData>>) => ReactNode
  /** Extra content rendered after the table (e.g. dialogs) */
  children?: ReactNode
  /** Number of skeleton rows to show while loading (default: 10) */
  skeletonRows?: number
  /** Default column visibility state */
  defaultColumnVisibility?: VisibilityState
}

/**
 * Generic data table component for feature pages.
 *
 * Encapsulates useReactTable setup, URL-synced pagination, loading skeleton,
 * table rendering, and pagination controls.
 *
 * @example
 * ```tsx
 * <FeatureDataTable
 *   columns={columns}
 *   data={data}
 *   totalRecord={totalRecord}
 *   isLoading={isLoading}
 *   search={route.useSearch()}
 *   navigate={route.useNavigate()}
 *   renderToolbar={(table) => <MySearch table={table} />}
 * />
 * ```
 */
export function FeatureDataTable<TData>({
  columns,
  data,
  totalRecord,
  isLoading,
  search,
  navigate,
  renderToolbar,
  children,
  skeletonRows = 10,
  defaultColumnVisibility = {},
}: FeatureDataTableProps<TData>) {
  const { t } = useLanguage()
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultColumnVisibility)

  const { pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
      search,
      navigate,
      pagination: { defaultPage: 1, defaultPageSize: 10, pageKey: 'pageNum' },
    })

  const pageCount = useMemo(() => {
    const pageSize = pagination.pageSize ?? 10
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
      {renderToolbar?.(table)}

      {isLoading ? (
        <div className='overflow-hidden rounded-md border'>
          <div className='space-y-3 p-4'>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div key={i} className='flex gap-4'>
                <Skeleton className='h-12 flex-1' />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='overflow-x-auto rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
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
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
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
                    colSpan={table.getAllColumns().length}
                    className='h-24 text-center'
                  >
                    {t('common.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DataTablePagination table={table} className='mt-auto' />

      {children}
    </div>
  )
}
