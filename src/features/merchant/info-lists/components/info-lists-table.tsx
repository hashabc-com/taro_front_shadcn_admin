import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'sonner'
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
import { useMerchantInfoData } from '../hooks/use-info-lists-data'
import { getColumns } from './info-lists-columns'
import { MerchantInfoSearch } from './info-lists-search'
import { EditMerchantDialog } from './edit-merchant-dialog'
import { ChangePasswordDialog } from './change-password-dialog'
import { UnbindKeyDialog, AddIpDialog } from './merchant-dialogs'
import { RateConfigDialog } from './rate-config-dialog'
import { updateCustomer, getAutoLoginToken } from '@/api/merchant'
import { type IMerchantInfoType } from '../schema'
import { useLanguage } from '@/context/language-provider'

const route = getRouteApi('/_authenticated/merchant/info-lists')

const isProduction = import.meta.env.MODE === 'production'

export function MerchantInfoTable() {
  const { lang } = useLanguage()
  const { data, isLoading, totalRecord, refetch } = useMerchantInfoData()

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [currentMerchant, setCurrentMerchant] =
    useState<IMerchantInfoType | null>(null)

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [unbindKeyDialogOpen, setUnbindKeyDialogOpen] = useState(false)
  const [addIpDialogOpen, setAddIpDialogOpen] = useState(false)
  const [rateConfigDialogOpen, setRateConfigDialogOpen] = useState(false)

  // Synced with URL states
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

  // Action handlers
  const handleEdit = (merchant: IMerchantInfoType) => {
    setCurrentMerchant(merchant)
    setEditDialogOpen(true)
  }

  const handleChangePassword = (merchant: IMerchantInfoType) => {
    setCurrentMerchant(merchant)
    setPasswordDialogOpen(true)
  }

  const handleToggleStatus = async (merchant: IMerchantInfoType) => {
    const newStatus = merchant.status === 0 ? 1 : 0
    try {
      const res = await updateCustomer({
        ...merchant,
        status: newStatus,
      })

      if (res) {
        toast.success(`${merchant.companyName} 状态更新成功`)
        refetch()
      } else {
        toast.error('状态更新失败')
      }
    } catch (_error) {
      toast.error('状态更新失败')
    }
  }

  const handleUnbindKey = (merchant: IMerchantInfoType) => {
    setCurrentMerchant(merchant)
    setUnbindKeyDialogOpen(true)
  }

  const handleBindIp = (merchant: IMerchantInfoType) => {
    setCurrentMerchant(merchant)
    setAddIpDialogOpen(true)
  }

  const handleRateConfig = (merchant: IMerchantInfoType) => {
    setCurrentMerchant(merchant)
    setRateConfigDialogOpen(true)
  }

  const handleAutoLogin = async (merchant: IMerchantInfoType) => {
    try {
      const res = await getAutoLoginToken(merchant.appid)
      const baseUrl = isProduction
        ? 'https://merchant.taropay.com'
        : 'https://merchant-test.taropay.com'
      window.open(`${baseUrl}?token=${res.result}`, '_blank')
    } catch (_error) {
      toast.error('获取登录令牌失败')
    }
  }

  const handleSuccess = () => {
    refetch()
  }

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onChangePassword: handleChangePassword,
        onToggleStatus: handleToggleStatus,
        onUnbindKey: handleUnbindKey,
        onBindIp: handleBindIp,
        onRateConfig: handleRateConfig,
        onAutoLogin: handleAutoLogin,
      }, lang),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
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
      <MerchantInfoSearch table={table} />
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
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DataTablePagination table={table} className='mt-auto' />

      {/* Dialogs */}
      <EditMerchantDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        merchant={currentMerchant}
        isAdd={false}
        onSuccess={handleSuccess}
      />
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        merchant={currentMerchant}
        onSuccess={handleSuccess}
      />
      <UnbindKeyDialog
        open={unbindKeyDialogOpen}
        onOpenChange={setUnbindKeyDialogOpen}
        merchant={currentMerchant}
        onSuccess={handleSuccess}
      />
      <AddIpDialog
        open={addIpDialogOpen}
        onOpenChange={setAddIpDialogOpen}
        merchant={currentMerchant}
        onSuccess={handleSuccess}
      />
      <RateConfigDialog
        open={rateConfigDialogOpen}
        onOpenChange={setRateConfigDialogOpen}
        merchant={currentMerchant}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
