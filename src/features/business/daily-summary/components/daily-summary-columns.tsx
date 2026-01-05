import { type ColumnDef } from '@tanstack/react-table'
import { getTranslation, type Language } from '@/lib/i18n'
import { type IDailySummaryType } from '../schema'

export const getDailySummaryColumns = (
  language: Language = 'zh'
): ColumnDef<IDailySummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'businessName',
      header: t('business.dailySummary.businessAccount'),
      enableHiding: false,
      cell: ({ row }) => (
        <div className='max-w-[150px] truncate'>{row.getValue('businessName')}</div>
      ),
    },
    {
      accessorKey: 'localTime',
      header: t('business.dailySummary.date'),
      enableHiding: false,
    },
    {
      accessorKey: 'inBills',
      header: t('business.dailySummary.collectionCount')
    },
    {
      accessorKey: 'inAmount',
      header: t('business.dailySummary.collectionAmount')
    },
    {
      accessorKey: 'inAmountService',
      header: t('business.dailySummary.collectionFee')
    },
    {
      accessorKey: 'inAmountProfit',
      header: t('business.dailySummary.inAmountProfit')
    },
    {
      accessorKey: 'outBills',
      header: t('business.dailySummary.payoutCount')
    },
    {
      accessorKey: 'outAmount',
      header: t('business.dailySummary.paymentAmount')
    },
    {
      accessorKey: 'outAmountService',
      header: t('business.dailySummary.payoutFee')
    },
    {
      accessorKey: 'outAmountProfit',
      header: t('business.dailySummary.outAmountProfit')
    },
  ]
}
