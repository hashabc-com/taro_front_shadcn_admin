import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useMessageRecordData } from '../hooks/use-message-record-data'
import type { IMessageRecordType } from '../schema'
import { MessageDetailDialog } from './message-detail-dialog'
import { getColumns } from './message-record-columns'
import { MessageRecordSearch } from './message-record-search'

const route = getRouteApi('/_authenticated/logs/message-record')

export function MessageRecordTable() {
  const { data, isLoading, totalRecord } = useMessageRecordData()
  const { lang } = useLanguage()
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] =
    useState<IMessageRecordType | null>(null)

  const handleViewDetail = (record: IMessageRecordType) => {
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
      renderToolbar={(table) => <MessageRecordSearch table={table} />}
    >
      <MessageDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        record={selectedRecord}
      />
    </FeatureDataTable>
  )
}
