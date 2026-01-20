import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { Badge } from '@/components/ui/badge'
import { type IRowType } from '../schema'

export const getTasksColumns = (
  language: Language = 'zh'
): ColumnDef<IRowType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'companyName',
      header: t('orders.collectionRate.merchant'),
      enableHiding: false,
    },
    {
      accessorKey: 'paymentCompany',
      header: t('orders.collectionRate.paymentChannel'),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant='outline'>{row.getValue('paymentCompany')}</Badge>
      ),
    },
    {
      accessorKey: 'pickupCenter',
      header: t('orders.collectionRate.paymentType'),
    },
    {
      accessorKey: 'dealTime',
      header: t('orders.collectionRate.transactionTime'),
    },
    {
      accessorKey: 'billCount',
      header: t('orders.collectionRate.totalOrders'),
    },
    {
      accessorKey: 'successBillCount',
      header: t('orders.collectionRate.successOrders'),
    },
    {
      accessorKey: 'successRate',
      header: t('orders.collectionRate.successRate'),
    },
  ]
}

// export const tasksColumns: ColumnDef<IRowType>[] = [
//   {
//     accessorKey: 'companyName',
//     header: '商户',
//     enableHiding: false
//   },
//   {
//     accessorKey: 'paymentCompany',
//     header: '支付渠道',
//     enableSorting: false,
//     cell: ({ row }) => (
//       <Badge variant='outline'>{row.getValue('paymentCompany')}</Badge>
//     ),
//   },
//   {
//     accessorKey: 'pickupCenter',
//     header: '支付类型'
//   },
//   {
//     accessorKey: 'dealTime',
//     header: '交易时间',
//   },
// {
//     accessorKey: 'billCount',
//     header: '总订单数',
//   },
//   {
//     accessorKey: 'successBillCount',
//     header: '成功订单数',
//   },
//   {
//     accessorKey: 'successRate',
//     header: '成功率',
//   }
// ]
