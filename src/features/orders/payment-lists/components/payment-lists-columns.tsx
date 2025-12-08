import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type IPaymentListsType,statuses } from '../schema'
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
      cell: ({ row }) => row.getValue('companyName')
    },
    {
      accessorKey: 'transactionReferenceNo',
      header: t('orders.paymentOrders.merchantOrderNo'),
      cell: ({ row }) => row.getValue('transactionReferenceNo'),
    },
    {
      accessorKey: 'transactionid',
      header: t('orders.paymentOrders.platformOrderNo'),
    },
    // {
    //   accessorKey: 'certificateId',
    //   header: t('orders.paymentOrders.thirdPartyOrderNo'),
    // },
    {
      accessorKey: 'paymentCompany',
      header: t('orders.paymentOrders.paymentCompany'),
    },
    {
      accessorKey: 'pickupCenter',
      header: t('orders.paymentOrders.product'),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('pickupCenter')}</Badge>
      ),
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
    {
      accessorKey: 'updateTime',
      header: t('orders.paymentOrders.paymentTime'),
      enableSorting: false,
      cell: ({ row }) => row.getValue('updateTime'),
    },
    {
      accessorKey: 'status',
      header: t('orders.paymentOrders.status'),
      cell: ({ row }) => {
        const statusesItem = statuses[row.getValue('status') as keyof typeof statuses];
        return (

          <div className={`flex items-center text-${statusesItem.color}-600`}>
              <statusesItem.icon className='mr-1.5 h-4 w-4' />
              <span className='font-medium'>
                {t(statusesItem.i18n)}
              </span>
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
