import { type ColumnDef } from '@tanstack/react-table'
import { type IMerchantDailySummaryType } from '../schema'
import { getTranslation, type Language } from '@/lib/i18n'

export const getMerchantDailySummaryColumns = (
  language: Language = 'zh'
): ColumnDef<IMerchantDailySummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'companyName',
      header: t('common.merchant'),
      enableHiding: false,
    },
    {
      accessorKey: 'localTime',
      header: t('common.date'),
      enableHiding: false,
    },
    {
      accessorKey: 'inAmount',
      header: t('fund.merchantDailySummary.collectionAmount'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'inAmountService',
      header: t('fund.merchantDailySummary.collectionFee'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmount',
      header: t('fund.merchantDailySummary.paymentAmount'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmountService',
      header: t('fund.merchantDailySummary.paymentFee'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'rechargeAmoubt',
      header: t('common.recharge'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'withdrawAmount',
      header: t('common.withdrawal'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'settlementAmount',
      header: t('fund.merchantDailySummary.finalSettlement'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'availableAmount',
      header: t('common.balance'),
      meta:{
        className: 'text-center'
      }
    },
  ]
}
