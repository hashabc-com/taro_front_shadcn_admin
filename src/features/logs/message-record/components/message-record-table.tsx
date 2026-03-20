import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useMessageRecordData } from '../hooks/use-message-record-data'
import { AddMessageDialog } from './add-message-dialog'
import { MessageDetailDialog } from './message-detail-dialog'
import { getColumns } from './message-record-columns'
import { useMessageRecord } from './message-record-provider'
import { MessageRecordSearch } from './message-record-search'

const route = getRouteApi('/_authenticated/logs/message-record')

export function MessageRecordTable() {
  const { data, isLoading, totalRecord } = useMessageRecordData()
  const { lang } = useLanguage()
  const { open, setOpen, currentRow, setCurrentRow } = useMessageRecord()

  const columns = useMemo(
    () =>
      getColumns((record) => {
        setCurrentRow(record)
        setOpen('detail')
      }, lang),
    [lang, setCurrentRow, setOpen]
  )

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
        open={open === 'detail'}
        onOpenChange={(v) => setOpen(v ? 'detail' : null)}
        record={currentRow}
      />
      <AddMessageDialog
        open={open === 'add'}
        onOpenChange={(v) => setOpen(v ? 'add' : null)}
      />
    </FeatureDataTable>
  )
}
