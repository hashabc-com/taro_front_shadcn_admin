import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Eye } from 'lucide-react'
import type { IMerchantRequest } from '../schema'

const getTransactionTypeLabel = (type: string | undefined, t: (key: string) => string) => {
  if (!type) return '-'
  switch (type) {
    case 'P':
      return t('logs.merchantRequest.payment')
    case 'L':
      return t('logs.merchantRequest.lending')
    default:
      return type
  }
}

const getStatusLabel = (status: number | undefined, t: (key: string) => string) => {
  if (status === undefined) return '-'
  switch (status) {
    case 0:
      return t('logs.merchantRequest.statusSuccess')
    case 1:
      return t('logs.merchantRequest.statusProcessing')
    case 2:
      return t('logs.merchantRequest.statusFailed')
    case 3:
      return t('logs.merchantRequest.statusExpired')
    default:
      return String(status)
  }
}

const getStatusClass = (status: number | undefined) => {
  switch (status) {
    case 0:
      return 'text-green-600'
    case 1:
      return 'text-blue-600'
    case 2:
      return 'text-red-600'
    case 3:
      return 'text-gray-600'
    default:
      return ''
  }
}

export const getColumns = (
  onViewDetail: (record: IMerchantRequest) => void,
  language: Language = 'zh'
): ColumnDef<IMerchantRequest>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    // {
    //   accessorKey: 'id',
    //   header: 'ID',
    //   enableHiding: false,
    // },
    {
      accessorKey: 'transactionType',
      header: t('logs.merchantRequest.transactionType'),
      cell: ({ row }) => getTransactionTypeLabel(row.original.transactionType, t),
      enableHiding: false
    },
    {
      accessorKey: 'referenceno',
      header: t('logs.merchantRequest.referenceno'),
      enableHiding: false,
      cell: ({ row }) => {
        if(row.original.transactionType === 'P') {
          return row.original.referenceno
        }
        return row.original.transactionReferenceNo
      }
    },
    {
      accessorKey: 'transId',
      header: t('logs.merchantRequest.transId'),
      enableHiding: false,
      cell: ({ row }) => {
        if(row.original.transactionType === 'P') {
          return row.original.transId
        }
        return row.original.transactionid
      }
    },
    {
      accessorKey: 'paymentCompany',
      header: t('logs.merchantRequest.paymentCompany'),
    },
    {
      accessorKey: 'userName',
      header: t('logs.merchantRequest.userName'),
    },
    {
      accessorKey: 'mobile',
      header: t('logs.merchantRequest.mobile'),
    },
    {
      accessorKey: 'amount',
      header: t('logs.merchantRequest.amount'),
    },
    {
      accessorKey: 'serviceAmount',
      header: t('logs.merchantRequest.serviceAmount')
    },
    {
      accessorKey: 'status',
      header: t('logs.merchantRequest.status'),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <span className={getStatusClass(status)}>
            {getStatusLabel(status, t)}
          </span>
        )
      },
    },
    {
      accessorKey: 'createTime',
      header: t('logs.merchantRequest.createTime'),
    },
    {
      id: 'actions',
      header: t('common.action'),
      cell: ({ row }) => (
        <div
          className='flex justify-center items-center gap-1 cursor-pointer'
          onClick={() => onViewDetail(row.original)}
        >
          <Eye className='h-4 w-4' />
          {t('logs.merchantRequest.viewDetail')}
        </div>
      ),
    },
  ]
}
