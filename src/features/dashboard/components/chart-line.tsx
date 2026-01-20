import { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
// import { Skeleton } from '@/components/ui/skeleton'
import { type DayChartData } from '@/api/dashboard'
import { useLanguage } from '@/context/language-provider'
import { useConvertAmount } from '@/hooks/use-convert-amount'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  // type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// const chartData = [
//   { month: 'January', desktop: 186, mobile: 80 },
//   { month: 'February', desktop: 305, mobile: 200 },
//   { month: 'March', desktop: 237, mobile: 120 },
//   { month: 'April', desktop: 73, mobile: 190 },
//   { month: 'May', desktop: 209, mobile: 130 },
//   { month: 'June', desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: 'Desktop',
//     color: 'var(--ring)',
//   },
//   mobile: {
//     label: 'Mobile',
//     color: 'var(--muted-foreground)',
//   },
// } satisfies ChartConfig

export default function ChartLineMultiple({
  chartData,
}: {
  chartData?: DayChartData[]
}) {
  const convertAmount = useConvertAmount()
  const { t } = useLanguage()
  const [metric, setMetric] = useState<'amount' | 'count' | 'service'>('amount')

  const chartConfigs = {
    amount: {
      collectAmount: {
        label: t('dashboard.collectionAmount'),
        color: 'var(--ring)',
      },
      payoutAmount: {
        label: t('dashboard.paymentAmount'),
        color: 'var(--muted-foreground)',
      },
    },
    service: {
      collectServiceAmount: {
        label: t('dashboard.collectionFee'),
        color: 'var(--ring)',
      },
      payoutServiceAmount: {
        label: t('dashboard.paymentFee'),
        color: 'var(--muted-foreground)',
      },
    },
    count: {
      collectCount: {
        label: t('dashboard.collectionCount'),
        color: 'var(--ring)',
      },
      payoutCount: {
        label: t('dashboard.paymentCount'),
        color: 'var(--muted-foreground)',
      },
    },
  }

  // 转换数据，确保数值类型正确
  const processedData = (chartData || []).map((item) => ({
    ...item,
    collectAmount: Number(convertAmount(item.collectAmount, false, false)),
    payoutAmount: Number(convertAmount(item.payoutAmount, false, false)),
    collectCount: Number(convertAmount(item.collectCount, false, false)),
    payoutCount: Number(convertAmount(item.payoutCount, false, false)),
    collectServiceAmount: Number(
      convertAmount(item.collectServiceAmount, false, false)
    ),
    payoutServiceAmount: Number(
      convertAmount(item.payoutServiceAmount, false, false)
    ),
  }))

  // 如果没有数据，不渲染图表，避免从空数组到有数据的动画问题
  const hasData = processedData.length > 0

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-xl'>
              {t('dashboard.collectionPaymentStats')}
            </CardTitle>
            <CardDescription className='text-xs'>
              {t('dashboard.recentDaysComparison')}
            </CardDescription>
          </div>
          <Tabs
            value={metric}
            onValueChange={(v) =>
              setMetric(v as 'amount' | 'count' | 'service')
            }
            className='w-auto'
          >
            <TabsList className='h-8'>
              <TabsTrigger value='amount' className='px-3 py-1 text-xs'>
                {t('dashboard.totalAmount')}
              </TabsTrigger>
              <TabsTrigger value='count' className='px-3 py-1 text-xs'>
                {t('dashboard.orderCount')}
              </TabsTrigger>
              <TabsTrigger value='service' className='px-3 py-1 text-xs'>
                {t('dashboard.serviceFee')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfigs[metric]}
          className='h-[200px] w-full'
        >
          <LineChart
            accessibilityLayer
            data={processedData}
            margin={{
              top: 12,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              hide
              scale={metric === 'count' ? 'auto' : 'sqrt'}
              domain={['auto', 'auto']}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {hasData ? (
              chartConfigs[metric] &&
              Object.keys(chartConfigs[metric]).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type='monotone'
                  stroke={`var(--color-${key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))
            ) : (
              <></>
            )}
            {/* {
            chartConfigs[metric] && Object.keys(chartConfigs[metric]).map((key) => (
              <Line
              key={key}
              dataKey={key}
              type='monotone'
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
            />
            ))
          } */}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
