import { type ColumnDef } from '@tanstack/react-table'
import { type IMonthlySummaryType } from '../schema'

export const columns: ColumnDef<IMonthlySummaryType>[] = [
  {
    accessorKey: 'businessName',
    header: '商务名称',
    enableHiding: false,
    cell: ({ row }) => (
      <div className='max-w-[150px] truncate'>{row.getValue('businessName')}</div>
    ),
  },
  {
    accessorKey: 'localTime',
    header: '统计月份',
    enableHiding: false,
  },
  {
    accessorKey: 'inBills',
    header: '代收笔数'
  },
  {
    accessorKey: 'inAmount',
    header: '代收金额'
  },
  {
    accessorKey: 'inAmountService',
    header: '代收手续费'
  },
  {
    accessorKey: 'outBills',
    header: '代付笔数'
  },
  {
    accessorKey: 'outAmount',
    header: '代付金额'
  },
  {
    accessorKey: 'outAmountService',
    header: '代付手续费'
  },
]
