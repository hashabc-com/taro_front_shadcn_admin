import { type ColumnDef } from '@tanstack/react-table'
import { type ICountryDailySummaryType } from '../schema'
import { getTranslation, type Language } from '@/lib/i18n'

export const getCountryDailySummaryColumns = (
  language: Language = 'zh'
): ColumnDef<ICountryDailySummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)
  return [
    {
      accessorKey: 'countryName',
      header: t('common.country'),
      enableHiding: false,
    },
    {
      accessorKey: 'localTime',
      header: t('common.date'),
      enableHiding: false
    },
    {
      accessorKey: 'inAmount',
      header: t('fund.countryDailySummary.collectionAmount'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'inAmountService',
      header: t('fund.countryDailySummary.collectionFee'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'inAmountProfit',
      header: t('business.dailySummary.inAmountProfit'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmount',
      header: t('fund.countryDailySummary.paymentAmount'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmountService',
      header: t('fund.countryDailySummary.paymentFee'),
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmountProfit',
      header: t('business.dailySummary.outAmountProfit'),
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
      header: t('fund.countryDailySummary.finalSettlement'),
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
