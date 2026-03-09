import { useMemo } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { downloadExportFile, type IExportRecord } from '@/api/export'
import { useLanguage } from '@/context/language-provider'
import { FeatureDataTable } from '@/components/data-table'
import { useExportData } from '../hooks/use-export-data'
import { getExportColumns } from './export-columns'

const route = getRouteApi('/_authenticated/export-management')

export function ExportTable() {
  const { lang, t } = useLanguage()
  const { exports: data, isLoading, totalRecord } = useExportData()

  const handleDownload = async (record: IExportRecord) => {
    if (record.status !== 1) {
      toast.warning(t('export.downloadWarning'))
      return
    }

    try {
      const response = await downloadExportFile(record.fileId)
      const blob = response.result || response
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', record.fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(t('export.downloadSuccess'))
    } catch (error) {
      console.error('下载失败:', error)
      toast.error(t('export.downloadError'))
    }
  }

  const columns = useMemo(() => getExportColumns(lang, handleDownload), [lang])

  return (
    <FeatureDataTable
      columns={columns}
      data={data}
      totalRecord={totalRecord}
      isLoading={isLoading}
      search={route.useSearch()}
      navigate={route.useNavigate()}
    />
  )
}
