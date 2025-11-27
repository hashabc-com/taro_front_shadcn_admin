import { type ColumnDef } from '@tanstack/react-table'
import { type IMerchantInfoType } from '../schema'

export const columns: ColumnDef<IMerchantInfoType>[] = [
  {
    accessorKey: 'companyName',
    header: '公司名称',
  },
  {
    accessorKey: 'paymentCompany',
    header: '支付公司',
  },
  {
    accessorKey: 'dealTime',
    header: '交易时间',
  },
  {
    accessorKey: 'billCount',
    header: '账单数量',
  },
  {
    accessorKey: 'amount',
    header: '金额',
  },
  {
    accessorKey: 'serviceAmount',
    header: '服务费',
  },
  {
    accessorKey: 'totalAmount',
    header: '总金额',
  },
]
