import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { type IMonthlySummaryType } from '../schema'

export const getMonthlySummaryColumns = (
  language: Language = 'zh'
): ColumnDef<IMonthlySummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'businessName',
      header: t('business.monthlySummary.businessAccount'),
      enableHiding: false,
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>{row.getValue('businessName')}</div>
      ),
    },
    {
      accessorKey: 'localTime',
      header: t('business.monthlySummary.month'),
      enableHiding: false,
    },
    {
      accessorKey: 'inBills',
      header: t('business.monthlySummary.collectionCount')
    },
    {
      accessorKey: 'inAmount',
      header: t('business.monthlySummary.collectionAmount')
    },
    {
      accessorKey: 'inAmountService',
      header: t('business.monthlySummary.collectionFee')
    },
    {
      accessorKey: 'inAmountProfit',
      header: t('business.dailySummary.inAmountProfit')
    },
    {
      accessorKey: 'outBills',
      header: t('business.monthlySummary.payoutCount')
    },
    {
      accessorKey: 'outAmount',
      header: t('business.monthlySummary.paymentAmount')
    },
    {
      accessorKey: 'outAmountService',
      header: t('business.monthlySummary.payoutFee')
    },
    {
      accessorKey: 'outAmountProfit',
      header: t('business.dailySummary.outAmountProfit')
    },
  ]
}
