import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useMerchantRequestData } from '../hooks/use-merchant-request-data'
import type { IMerchantRequest } from '../schema'
import { getColumns } from './merchant-request-columns'
import { MerchantRequestDetailDialog } from './merchant-request-detail-dialog'
import { MerchantRequestSearch } from './merchant-request-search'

const route = getRouteApi('/_authenticated/logs/merchant-request')

export function MerchantRequestTable() {
  const { data, isLoading, totalRecord } = useMerchantRequestData()
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<IMerchantRequest | null>(
    null
  )
  const { lang } = useLanguage()

  const handleViewDetail = (record: IMerchantRequest) => {
    setSelectedRecord(record)
    setDetailOpen(true)
  }

  const columns = useMemo(() => getColumns(handleViewDetail, lang), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
      renderToolbar={(table) => <MerchantRequestSearch table={table} />}
    >
      <MerchantRequestDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        record={selectedRecord}
      />
    </FeatureDataTable>
  )
}
