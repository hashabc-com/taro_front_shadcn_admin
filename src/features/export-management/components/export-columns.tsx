import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { type IExportRecord } from '@/api/export'
import { getTranslation, type Language } from '@/lib/i18n'
import {format} from 'date-fns'

const getExportTypeName = (exportType: IExportRecord['exportType'], language: Language) => {
  const typeMap = {
    PAYMENT: getTranslation(language, 'export.type.payment'),
    LENDING: getTranslation(language, 'export.type.lending'),
    TRAN: getTranslation(language, 'export.type.summary'),
  }
  return typeMap[exportType] || exportType
}

const getStatusText = (status: IExportRecord['status'], language: Language) => {
  const statusMap = {
    0: getTranslation(language, 'export.status.generating'),
    1: getTranslation(language, 'export.status.downloadable'),
    2: getTranslation(language, 'export.status.failed'),
  }
  return statusMap[status] || getTranslation(language, 'common.unknown')
}

const getStatusVariant = (status: IExportRecord['status']) => {
  const variantMap = {
    0: 'default' as const,
    1: 'success' as const,
    2: 'destructive' as const,
  }
  return variantMap[status] || 'outline' as const
}

export const getExportColumns = (
  language: Language,
  onDownload: (record: IExportRecord) => void
): ColumnDef<IExportRecord>[] => {
  const t = (key: string) => getTranslation(language, key)

  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className='w-[60px]'>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'fileName',
      header: t('export.fileName'),
      cell: ({ row }) => (
        <div className='max-w-[300px] truncate' title={row.getValue('fileName')}>
          {row.getValue('fileName')}
        </div>
      ),
    },
    {
      accessorKey: 'exportType',
      header: t('export.exportType'),
      cell: ({ row }) => getExportTypeName(row.getValue('exportType'), language),
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as IExportRecord['status']
        return (
          <Badge variant={getStatusVariant(status)}>
            {getStatusText(status, language)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createTime',
      header: t('export.createTime'),
      cell: ({ row }) => {
        const time = row.getValue('createTime') as string
        return time ? format(new Date(time), 'yyyy-MM-dd HH:mm:ss') : '-'
      },
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => {
        const record = row.original
        return (
          <Button
            variant='link'
            size='sm'
            disabled={record.status !== 1}
            onClick={() => onDownload(record)}
            className='h-8 !px-0'
          >
            <Download className='mr-1 h-4 w-4' />
            {t('common.download')}
          </Button>
        )
      },
    },
  ]
}
