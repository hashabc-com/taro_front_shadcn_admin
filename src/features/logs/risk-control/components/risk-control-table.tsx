import { useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useRiskControlData } from '../hooks/use-risk-control-data'
import { ParamsDetailDialog } from './params-detail-dialog'
import { getColumns } from './risk-control-columns'
import { RiskControlSearch } from './risk-control-search'

const route = getRouteApi('/_authenticated/logs/risk-control')

export function RiskControlTable() {
  const { data, isLoading, totalRecord } = useRiskControlData()
  const { lang } = useLanguage()
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailContent, setDetailContent] = useState('')

  const handleViewDetail = (text: string) => {
    setDetailContent(text)
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
      renderToolbar={(table) => <RiskControlSearch table={table} />}
    >
      <ParamsDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        content={detailContent}
      />
    </FeatureDataTable>
  )
}
