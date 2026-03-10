import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type IPaymentListsType, statuses } from '../schema'
import { DataTableRowActions } from './data-table-row-actions'

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<IPaymentListsType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'companyName',
      header: t('orders.paymentOrders.merchant'),
      enableHiding: false,
      cell: ({ row }) => row.getValue('companyName'),
    },
    {
      accessorKey: 'localSuccessTime',
      header: `${t('common.create')}/${t('orders.receiveOrders.finishTime')}`,
      cell: ({ row }) => {
        const localTime = row.original.localTime
        const localPaymentDate = row.original.localSuccessTime
        const updateTime = row.original.updateTime
        const status = row.original.status
        return (
          <div className='text-muted-foreground flex flex-col gap-0.5 text-xs'>
            <div>{localTime || '-'}</div>
            <div>{ status == '2' ? updateTime || '-' : localPaymentDate || '-'}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'referenceno',
      header: `${t('common.thirdParty')}/${t('common.platform')}/${t('orders.receiveOrders.merchantOrderNo')}`,
      cell: ({ row }) => {
        const transactionReferenceNo = row.original.transactionReferenceNo
        const transactionid = row.original.transactionid // 平台订单号
        const certificateId = row.original.certificateId // 三方
        return (
          <div className='text-muted-foreground flex flex-col gap-0.5 font-mono text-xs'>
            <div>{certificateId || '-'}</div>
            <div>{transactionid || '-'}</div>
            <div>{transactionReferenceNo || '-'}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'mobile',
      header: t('common.phone')
    },
    {
      accessorKey: 'userName',
      header: t('signIn.username')
    },
    // {
    //   accessorKey: 'transactionReferenceNo',
    //   header: t('orders.paymentOrders.merchantOrderNo'),
    //   cell: ({ row }) => row.getValue('transactionReferenceNo'),
    // },
    // {
    //   accessorKey: 'transactionid',
    //   header: t('orders.paymentOrders.platformOrderNo'),
    // },
    // {
    //   accessorKey: 'certificateId',
    //   header: t('orders.paymentOrders.thirdPartyOrderNo'),
    // },
    {
      accessorKey: 'pickupCenter',
      header: t('orders.paymentOrders.product'),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('pickupCenter')}</Badge>
      ),
    },
    {
      accessorKey: 'paymentCompany',
      header: t('orders.paymentOrders.paymentCompany'),
    },
    {
      accessorKey: 'accountNumber',
      header: t('orders.paymentOrders.receivingAccount'),
    },
    {
      accessorKey: 'amount',
      header: t('orders.paymentOrders.amount'),
      cell: ({ row }) => row.getValue('amount'),
    },
    {
      accessorKey: 'serviceAmount',
      header: t('orders.paymentOrders.serviceFee'),
      cell: ({ row }) => row.getValue('serviceAmount'),
    },
    // {
    //   accessorKey: 'localSuccessTime',
    //   header: t('orders.paymentOrders.paymentTime'),
    //   enableSorting: false,
    //   // cell: ({ row }) => row.getValue('updateTime'),
    // },
    {
      accessorKey: 'status',
      header: t('orders.paymentOrders.status'),
      cell: ({ row }) => {
        const statusesItem =
          statuses[row.getValue('status') as keyof typeof statuses]
        return (
          <div className={`flex items-center text-${statusesItem.color}-600`}>
            <statusesItem.icon className='mr-1.5 h-4 w-4' />
            <span className='font-medium'>{t(statusesItem.i18n)}</span>
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
