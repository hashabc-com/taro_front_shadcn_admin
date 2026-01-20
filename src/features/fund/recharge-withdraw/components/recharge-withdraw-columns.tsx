import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { statuses, type IRechargeWithdrawType } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

// 图片预览组件
function ImagePreview({
  mediaId,
  localUrl,
  t,
}: {
  mediaId?: string
  localUrl?: string
  t: (key: string) => string
}) {
  const [previewOpen, setPreviewOpen] = useState(false)

  // if (type === '提现') {
  //   return <span className='ml-8'>--</span>
  // }

  if (!mediaId) return null

  return (
    <>
      <img
        src={localUrl}
        alt='凭证'
        className='h-16 w-16 cursor-pointer rounded object-cover'
        onClick={() => setPreviewOpen(true)}
      />
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {t('fund.rechargeWithdraw.voucherPreview')}
            </DialogTitle>
          </DialogHeader>
          <img src={localUrl} alt='凭证' className='h-auto w-full' />
        </DialogContent>
      </Dialog>
    </>
  )
}

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<IRechargeWithdrawType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'companyName',
      header: t('fund.rechargeWithdraw.merchant'),
      enableHiding: false,
    },
    {
      accessorKey: 'createTime',
      header: t('fund.rechargeWithdraw.applicationDate'),
    },
    {
      accessorKey: 'type',
      header: t('fund.rechargeWithdraw.type'),
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('type')}</Badge>
      ),
    },
    {
      accessorKey: 'rechargeAmount',
      header: t('fund.rechargeWithdraw.amount'),
    },
    {
      accessorKey: 'withdrawalType',
      header: t('fund.rechargeWithdraw.applicationCurrency'),
    },
    {
      accessorKey: 'exchangeRate',
      header: t('fund.rechargeWithdraw.exchangeRate'),
    },
    {
      accessorKey: 'costRate',
      header: t('fund.rechargeWithdraw.costExchangeRate'),
    },
    {
      accessorKey: 'profitAmountTwo',
      header: t('fund.rechargeWithdraw.profit'),
    },
    {
      accessorKey: 'finalAmount',
      header: t('fund.rechargeWithdraw.convertedAmount'),
    },
    {
      accessorKey: 'withdrawalAddress',
      header: t('fund.rechargeWithdraw.withdrawalAccount'),
    },
    {
      accessorKey: 'mediaId',
      header: t('fund.rechargeWithdraw.rechargeVoucher'),
      cell: ({ row }) => {
        return (
          <ImagePreview
            mediaId={row.getValue('mediaId')}
            localUrl={row.original.local_url}
            t={t}
            // type={row.getValue('type')}
          />
        )
      },
    },

    {
      accessorKey: 'remark',
      header: t('fund.rechargeWithdraw.remark'),
    },
    {
      accessorKey: 'processStatus',
      header: t('fund.rechargeWithdraw.auditStatus'),
      cell: ({ row }) => {
        const statusesItem =
          statuses[row.getValue('processStatus') as keyof typeof statuses]
        if (!statusesItem) return null
        return (
          <div className={`flex items-center text-${statusesItem.color}-600`}>
            <statusesItem.icon className='mr-1.5 h-4 w-4' />
            <span className='font-medium'>{t(statusesItem.label)}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: t('orders.paymentOrders.action'),
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
