import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format, subDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { Activity, TrendingUp, AlertTriangle, CalendarIcon } from 'lucide-react'
import { useCountryStore, useMerchantStore } from '@/stores'
import { getChannelStats } from '@/api/dashboard'
import { useLanguage } from '@/context/language-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_CONFIG: Record<
  number,
  { variant: 'default' | 'secondary' | 'destructive'; dotColor: string }
> = {
  1: { variant: 'default', dotColor: 'bg-green-500' },
  2: { variant: 'secondary', dotColor: 'bg-yellow-500' },
  3: { variant: 'destructive', dotColor: 'bg-red-500' },
}

const BAR_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--ring)',
  'var(--muted-foreground)',
  'var(--accent-foreground)',
]

function getSuccessRateColor(rate: number) {
  if (rate >= 90) return 'text-green-600'
  if (rate >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export default function ChannelStatsCard() {
  const { t, lang } = useLanguage()
  const { selectedCountry } = useCountryStore()
  const { selectedMerchant } = useMerchantStore()
  const [chartMetric, setChartMetric] = useState<'successRate' | 'totalCount'>(
    'successRate'
  )

  const today = new Date()
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({ from: today, to: today })

  const queryParams = useMemo(() => {
    return {
      period: 'custom' as const,
      startTime: dateRange.from
        ? format(dateRange.from, 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      endTime: dateRange.to
        ? format(dateRange.to, 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
    }
  }, [dateRange])

  const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setDateRange({ from: range?.from, to: range?.to })
  }

  const applyPreset = (from: Date, to: Date) => {
    setDateRange({ from, to })
  }

  const { data, isLoading } = useQuery({
    queryKey: [
      'dashboard',
      'channel-stats',
      queryParams,
      selectedCountry?.code,
      selectedMerchant?.appid,
    ],
    queryFn: () => getChannelStats(queryParams),
    enabled: !!selectedCountry?.code,
  })

  const channels = data?.result || []

  // 图表配置
  const chartConfig: Record<string, { label: string; color: string }> = {}
  channels.forEach((ch, i) => {
    chartConfig[ch.channelCode] = {
      label: ch.channelName,
      color: BAR_COLORS[i % BAR_COLORS.length],
    }
  })

  // 按成功率排序用于图表
  const sortedByMetric = [...channels].sort(
    (a, b) => b[chartMetric] - a[chartMetric]
  )

  const chartData = sortedByMetric.map((ch) => ({
    name: ch.channelCode,
    value: chartMetric === 'successRate' ? ch.successRate : ch.totalCount,
  }))

  const statusText = (status: number) => {
    const map: Record<number, string> = {
      1: t('dashboard.channelStats.statusNormal'),
      2: t('dashboard.channelStats.statusMaintenance'),
      3: t('dashboard.channelStats.statusPaused'),
    }
    return map[status] || '-'
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <Activity className='text-muted-foreground h-5 w-5' />
            <div>
              <CardTitle className='text-xl'>
                {t('dashboard.channelStats.title')}
              </CardTitle>
              <CardDescription className='text-xs'>
                {t('dashboard.channelStats.description')}
              </CardDescription>
            </div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='h-8 justify-start text-xs font-normal'
              >
                <CalendarIcon className='mr-1.5 h-3.5 w-3.5' />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'yyyy-MM-dd')} ~{' '}
                      {format(dateRange.to, 'yyyy-MM-dd')}
                    </>
                  ) : (
                    format(dateRange.from, 'yyyy-MM-dd')
                  )
                ) : (
                  <span className='text-muted-foreground'>
                    {t('common.selectDateRange')}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='flex w-auto p-0' align='end'>
              <div className='border-r flex flex-col gap-1 p-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='justify-start text-xs'
                  onClick={() => applyPreset(new Date(), new Date())}
                >
                  {t('dashboard.channelStats.today')}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='justify-start text-xs'
                  onClick={() => applyPreset(subDays(new Date(), 6), new Date())}
                >
                  {t('dashboard.channelStats.lastWeek')}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='justify-start text-xs'
                  onClick={() => applyPreset(subDays(new Date(), 29), new Date())}
                >
                  {t('dashboard.channelStats.lastMonth')}
                </Button>
              </div>
              <Calendar
                mode='range'
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                locale={lang === 'zh' ? zhCN : undefined}
                disabled={(date: Date) =>
                  date > new Date() || date < subDays(new Date(), 365)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton className='h-[200px] w-full' />
            <div className='space-y-2'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-full' />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* 图表 */}
            <div>
              <div className='mb-2 flex items-center justify-end gap-2'>
                <Tabs
                  value={chartMetric}
                  onValueChange={(v) =>
                    setChartMetric(v as 'successRate' | 'totalCount')
                  }
                  className='w-auto'
                >
                  <TabsList className='h-7'>
                    <TabsTrigger
                      value='successRate'
                      className='px-2 py-0.5 text-xs'
                    >
                      <TrendingUp className='mr-1 h-3 w-3' />
                      {t('dashboard.channelStats.successRate')}
                    </TabsTrigger>
                    <TabsTrigger
                      value='totalCount'
                      className='px-2 py-0.5 text-xs'
                    >
                      <Activity className='mr-1 h-3 w-3' />
                      {t('dashboard.channelStats.transactionVolume')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ChartContainer
                config={chartConfig}
                className='h-[200px] w-full'
              >
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey='name'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) =>
                      chartMetric === 'successRate'
                        ? `${value}%`
                        : formatNumber(value)
                    }
                    domain={
                      chartMetric === 'successRate' ? [0, 100] : ['auto', 'auto']
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          chartMetric === 'successRate'
                            ? `${value}%`
                            : formatNumber(value as number)
                        }
                      />
                    }
                  />
                  <Bar dataKey='value' radius={[4, 4, 0, 0]} barSize={32}>
                    {chartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>

            {/* 表格 */}
            <div className='overflow-x-auto rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.channelStats.channel')}</TableHead>
                    <TableHead className='text-center'>
                      {t('common.status')}
                    </TableHead>
                    <TableHead className='text-right'>
                      {t('dashboard.channelStats.successRate')}
                    </TableHead>
                    <TableHead className='text-right'>
                      {t('dashboard.channelStats.totalOrders')}
                    </TableHead>
                    <TableHead className='text-right'>
                      {t('dashboard.channelStats.successOrders')}
                    </TableHead>
                    <TableHead className='text-right'>
                      {t('dashboard.channelStats.failOrders')}
                    </TableHead>
                    <TableHead className='text-right'>
                      {t('dashboard.channelStats.totalAmount')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='h-20 text-center'>
                        {t('common.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    channels.map((ch) => {
                      const statusCfg = STATUS_CONFIG[ch.channelStatus] || STATUS_CONFIG[1]
                      return (
                        <TableRow key={ch.channelCode}>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium'>
                                {ch.channelName}
                              </span>
                              <span className='text-muted-foreground text-xs'>
                                {ch.channelCode}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className='text-center'>
                            <Badge
                              variant={statusCfg.variant}
                              className='gap-1'
                            >
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${statusCfg.dotColor}`}
                              />
                              {statusText(ch.channelStatus)}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-right'>
                            <span
                              className={`font-semibold ${getSuccessRateColor(ch.successRate)}`}
                            >
                              {ch.successRate}%
                            </span>
                            {ch.successRate < 70 && (
                              <AlertTriangle className='ml-1 inline h-3 w-3 text-red-500' />
                            )}
                          </TableCell>
                          <TableCell className='text-right font-mono text-sm'>
                            {ch.totalCount.toLocaleString()}
                          </TableCell>
                          <TableCell className='text-right font-mono text-sm text-green-600'>
                            {ch.successCount.toLocaleString()}
                          </TableCell>
                          <TableCell className='text-right font-mono text-sm text-red-500'>
                            {ch.failCount.toLocaleString()}
                          </TableCell>
                          <TableCell className='text-right font-mono text-sm'>
                            {formatNumber(ch.totalAmount)}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
