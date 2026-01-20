import { useQuery } from '@tanstack/react-query'
import { useMerchantStore, useCountryStore } from '@/stores'
import {
  DollarSign,
  Wallet,
  Lock,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react'
import { getAmountInformation, getChartDataOfDay } from '@/api/dashboard'
import { useLanguage } from '@/context/language-provider'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ChartLineMultiple from './chart-line'

export function Analytics() {
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const { t } = useLanguage()
  const convertAmount = useConvertAmount()
  // 获取账户金额信息
  const { data: amountData } = useQuery({
    queryKey: [
      'dashboard',
      'amount-info',
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: getAmountInformation,
    enabled: !!selectedCountry?.code,
  })

  // 获取交易统计
  const { data: chartData } = useQuery({
    queryKey: [
      'dashboard',
      'chart-data',
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: getChartDataOfDay,
    enabled: !!selectedCountry?.code,
  })

  const amountInfo = amountData?.result || amountData?.data
  const transactionStats = chartData?.result || chartData?.data

  return (
    <div className='space-y-3'>
      {/* 收款/付款统计 */}
      <ChartLineMultiple chartData={transactionStats?.data} />

      {/* 账户金额统计 */}
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-base font-medium'>
              {t('dashboard.availableBalance')}
            </CardTitle>
            <Wallet className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='text-xl font-bold'>
              {convertAmount(amountInfo?.availableAmount || 0)}
            </div>
            {/* <p className='text-muted-foreground text-xs'>
              ${amountInfo?.availableAmountUsd || '0.00'}
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-base font-medium'>
              {t('dashboard.pendingSettlement')}
            </CardTitle>
            <DollarSign className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='text-xl font-bold'>
              {convertAmount(amountInfo?.frozenAmount || 0)}
            </div>
            {/* <p className='text-muted-foreground text-xs'>
              ${amountInfo?.frozenAmountUsd || '0.00'}
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-1.5'>
            <CardTitle className='text-base font-medium'>
              {t('dashboard.frozenAmount')}
            </CardTitle>
            <Lock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='text-xl font-bold'>
              {convertAmount(amountInfo?.rechargeAmount || 0)}
            </div>
            {/* <p className='text-muted-foreground text-xs'>
              ${amountInfo?.rechargeAmountUsd || '0.00'}
            </p> */}
          </CardContent>
        </Card>
      </div>

      {/* 充值和提现金额 */}
      <div className='grid gap-3 sm:grid-cols-2'>
        <Card className='border-l-4 border-l-blue-500'>
          <CardContent className='pt-4 pb-3'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-muted-foreground text-sm'>
                  {t('dashboard.rechargeAmount')}
                </p>
                <div className='text-2xl font-bold'>
                  {convertAmount(transactionStats?.rechargeAmount || 0)}
                </div>
                {/* <p className='text-xs text-muted-foreground'>
                  ${transactionStats?.rechargeAmountUsd || '0.00'}
                </p> */}
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
                <p className='text-muted-foreground text-sm'>
                  {t('dashboard.withdrawalAmount')}
                </p>
                <div className='text-2xl font-bold'>
                  {convertAmount(transactionStats?.withdrawalAmount || 0)}
                </div>
                {/* <p className='text-xs text-muted-foreground'>
                  ${transactionStats?.withdrawalAmountUsd || '0.00'}
                </p> */}
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
