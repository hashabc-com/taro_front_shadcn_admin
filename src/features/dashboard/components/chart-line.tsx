import { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const description = 'A multiple line chart'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--ring)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--muted-foreground)',
  },
} satisfies ChartConfig

export default function ChartLineMultiple() {
  const [metric, setMetric] = useState<'amount' | 'count' | 'service'>('amount')
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-xl'>收款/付款统计</CardTitle>
            <CardDescription className='text-xs'>
              近三日收款与付款数据对比
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
                总金额
              </TabsTrigger>
              <TabsTrigger value='count' className='px-3 py-1 text-xs'>
                订单数
              </TabsTrigger>
              <TabsTrigger value='service' className='px-3 py-1 text-xs'>
                服务费
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[200px] w-full'>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey='desktop'
              type='monotone'
              stroke='var(--color-desktop)'
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey='mobile'
              type='monotone'
              stroke='var(--color-mobile)'
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
