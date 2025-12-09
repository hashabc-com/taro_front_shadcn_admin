import { type ColumnDef } from '@tanstack/react-table'
import { type ICountryDailySummaryType } from '../schema'
import { getTranslation, type Language } from '@/lib/i18n'

export const getCountryDailySummaryColumns = (
  language: Language = 'zh'
): ColumnDef<ICountryDailySummaryType>[] => {
  const t = (key: string) => getTranslation(language, key)
  console.log('getCountryDailySummaryColumns language:', t)
  return [
    {
      accessorKey: 'countryName',
      header: '国家',
      enableHiding: false,
    },
    {
      accessorKey: 'localTime',
      header: '日期',
      enableHiding: false
    },
    {
      accessorKey: 'inAmount',
      header: '收款金额',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'inAmountService',
      header: '收款手续费',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmount',
      header: '付款金额',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'outAmountService',
      header: '付款手续费',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'rechargeAmoubt',
      header: '充值',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'withdrawAmount',
      header: '提现',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'settlementAmount',
      header: '最终结算',
      meta:{
        className: 'text-center'
      }
    },
    {
      accessorKey: 'availableAmount',
      header: '余额',
      meta:{
        className: 'text-center'
      }
    },
  ]
}
