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
}: {
  mediaId?: string
  localUrl?: string
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
            <DialogTitle>凭证预览</DialogTitle>
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
      header: '商户',
      enableHiding: false,
    },
    {
      accessorKey: 'createTime',
      header: '申请日期',
    },
    {
      accessorKey: 'type',
      header: '类型',
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('type')}</Badge>
      ),
    },
    {
      accessorKey: 'rechargeAmount',
      header: '金额',
    },
    {
      accessorKey: 'withdrawalType',
      header: '申请币种',
    },
    {
      accessorKey: 'exchangeRate',
      header: '汇率',
    },
    {
      accessorKey: 'finalAmount',
      header: '换算金额',
    },
    {
      accessorKey: 'withdrawalAddress',
      header: '提现账号',
    },
    {
      accessorKey: 'mediaId',
      header: '充值凭证',
      cell: ({ row }) => {
        return (
          <ImagePreview
            mediaId={row.getValue('mediaId')}
            localUrl={row.original.local_url}
            // type={row.getValue('type')}
          />
        )
      },
    },

    {
      accessorKey: 'remark',
      header: '备注',
    },
    {
      accessorKey: 'processStatus',
      header: '审核状态',
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
