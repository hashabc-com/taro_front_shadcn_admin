import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
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
import {
  DataTablePagination,
  DataTableViewOptions,
} from '@/components/data-table'
import { useCustomerConsultData } from '../hooks/use-customer-consult-data'
import { type ICustomerConsult } from '../schema'
import { AddCustomerDialog } from './add-customer-dialog'
import { getCustomerConsultColumns } from './customer-consult-columns'
import { FollowUpSheet } from './follow-up-sheet'

const route = getRouteApi('/_authenticated/business/customer-consult')

export function CustomerConsultTable() {
  const { data, isLoading, totalRecord } = useCustomerConsultData()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedCustomer, setSelectedCustomer] =
    useState<ICustomerConsult | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { t } = useLanguage()

  const { pagination, onPaginationChange, ensurePageInRange } =
    useTableUrlState({
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
      {/* Action Bar */}
      <div className='flex justify-end'>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className='mr-2 h-4 w-4' />
          {t('business.customerConsult.addCustomer')}
        </Button>
        <DataTableViewOptions table={table} />
      </div>

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
                      const enableTooltip =
                        cell.column.columnDef.meta?.enableTooltip
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
                                <div className='block cursor-default truncate'>
                                  {cellContent}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent
                                side='top'
                                className='max-w-sm break-words'
                              >
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
      <DataTablePagination table={table} className='mt-auto' />

      <FollowUpSheet
        customer={selectedCustomer}
        open={!!selectedCustomer}
        onOpenChange={(open: boolean) => !open && setSelectedCustomer(null)}
      />

      <AddCustomerDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
