import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getAmountInformation, getChartDataOfDay } from '@/api/dashboard'
import { DollarSign, Wallet, Lock, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { useCurrencyConversionStore } from '@/stores/currency-conversion-store'
import { useCountryStore } from '@/stores/country-store'
import { useExchangeRatesStore } from '@/stores/exchange-rates-store'
import { formatCurrency } from '@/lib/currency'

import ChartLineMultiple from './chart-line'

export function Analytics() {
  const displayCurrency = useCurrencyConversionStore((state) => state.displayCurrency)
  const selectedCountry = useCountryStore((state) => state.selectedCountry)
  const baseCurrency = selectedCountry?.currency || 'IDR'
  const exchangeRates = useExchangeRatesStore()

  // 获取账户金额信息
  const { data: amountData } = useQuery({
    queryKey: ['dashboard', 'amount-info', selectedCountry?.id],
    queryFn: getAmountInformation,
  })

  // 获取交易统计
  const { data: chartData } = useQuery({
    queryKey: ['dashboard', 'chart-data', selectedCountry?.id],
    queryFn: getChartDataOfDay,
  })

  // 客户端货币转换函数
  const convertValue = useMemo(() => {
    return (value: number | string) => {
      if (!displayCurrency || displayCurrency === baseCurrency) {
        return value
      }
      
      const rate = exchangeRates.rates[displayCurrency]
      if (!rate) return value
      
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(numValue)) return value
      
      return numValue * rate
    }
  }, [displayCurrency, baseCurrency, exchangeRates.rates])

  const amountInfo = amountData?.result || amountData?.data
  const transactionStats = chartData?.result || chartData?.data

  // 格式化金额显示
  const formatAmount = (amount: string | number) => {
    const convertedAmount = convertValue(amount)
    const currency = displayCurrency || baseCurrency
    return formatCurrency(convertedAmount, currency)
  }

  return (
    <div className='space-y-3'>
      {/* 收款/付款统计 */}
      <ChartLineMultiple />

      {/* 账户金额统计 */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-base font-medium'>账户可用余额</CardTitle>
            <Wallet className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='text-xl font-bold'>
              {formatAmount(amountInfo?.availableAmount || '0.00')}
            </div>
            <p className='text-muted-foreground text-xs'>
              ${amountInfo?.availableAmountUsd || '0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-base font-medium'>待结算金额</CardTitle>
            <DollarSign className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='text-xl font-bold'>
              {formatAmount(amountInfo?.frozenAmountTwo || '0.00')}
            </div>
            <p className='text-muted-foreground text-xs'>
              ${amountInfo?.frozenAmountUsd || '0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-base font-medium'>冻结金额</CardTitle>
            <Lock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='text-xl font-bold'>
              {formatAmount(amountInfo?.rechargeAmountTwo || '0.00')}
            </div>
            <p className='text-muted-foreground text-xs'>
              ${amountInfo?.rechargeAmountUsd || '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 充值和提现金额 */}
      <div className='grid gap-3 sm:grid-cols-2'>
        <Card className='border-l-4 border-l-blue-500'>
          <CardContent className='pt-4 pb-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>充值金额</p>
                <div className='text-2xl font-bold'>
                  {formatAmount(transactionStats?.rechargeAmount || '0.00')}
                </div>
                <p className='text-xs text-muted-foreground'>
                  ${transactionStats?.rechargeAmountUsd || '0.00'}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                <ArrowDownToLine className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-green-500'>
          <CardContent className='pt-4 pb-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>提现金额</p>
                <div className='text-2xl font-bold'>
                  {formatAmount(transactionStats?.withdrawalAmount || '0.00')}
                </div>
                <p className='text-xs text-muted-foreground'>
                  ${transactionStats?.withdrawalAmountUsd || '0.00'}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <ArrowUpFromLine className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
