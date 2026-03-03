import http from '@/lib/http'

// 账户金额信息
export interface AmountInfo {
  id: number | null
  merchantId: string | null
  rechargeAmount: number
  frozenAmount: number
  availableAmount: number
  consumptionAmount: number | null
  version: string | null
  createTime: string | null
  updateTime: string | null
  rechargeAmountTwo: string
  frozenAmountTwo: string
  availableAmountTwo: string
  rechargeAmountAll: number
  availableAmountUsd: number
  frozenAmountUsd: number
  rechargeAmountUsd: number
}

// 日交易数据
export interface DayChartData {
  date: string
  collectAmount: string
  payoutAmount: string
  collectCount: string
  payoutCount: string
  collectServiceAmount: string
  payoutServiceAmount: string
  collectServiceAmountUsd: string
  payoutServiceAmountUsd: string
  collectAmountUsd: string
  payoutAmountUsd: string
}

// 交易统计
export interface ChartDataOfDay {
  data: DayChartData[]
  withdrawalAmount: string
  rechargeAmount: string
  withdrawalAmountUsd: string
  rechargeAmountUsd: string
}

// 获取账户金额信息
export const getAmountInformation = () => {
  return http.get<AmountInfo>('/admin/bill/v1/getAmountInformation')
}

// 获取日交易统计
export const getChartDataOfDay = () => {
  return http.post<ChartDataOfDay>(
    '/admin/home/v1/chartDataOfDay',
    new FormData()
  )
}

// ======================== 通道统计 API ========================

// 通道统计数据
export interface ChannelStats {
  channelCode: string
  channelName: string
  /** 1=正常 2=维护中 3=已暂停 */
  channelStatus: number
  /** 成功率百分比 0-100 */
  successRate: number
  /** 总交易量（笔数） */
  totalCount: number
  /** 成功交易量 */
  successCount: number
  /** 失败交易量 */
  failCount: number
  /** 交易金额 */
  totalAmount: number
}

export type ChannelStatsPeriod = 'day' | 'week' | 'month' | 'custom'

export interface ChannelStatsParams {
  period: ChannelStatsPeriod
  startTime?: string
  endTime?: string
}

// TODO: 后端 API 就绪后替换为真实接口
// export const getChannelStats = (params: ChannelStatsParams) =>
//   http.get<ChannelStats[]>('/admin/home/v1/channelStats', params)

// 模拟数据
const mockChannelStats: ChannelStats[] = [
  { channelCode: 'DANA', channelName: 'Dana', channelStatus: 1, successRate: 95.2, totalCount: 12580, successCount: 11977, failCount: 603, totalAmount: 856000000 },
  { channelCode: 'OVO', channelName: 'OVO', channelStatus: 1, successRate: 89.7, totalCount: 8930, successCount: 8010, failCount: 920, totalAmount: 623000000 },
  { channelCode: 'GOPAY', channelName: 'GoPay', channelStatus: 2, successRate: 78.3, totalCount: 6720, successCount: 5262, failCount: 1458, totalAmount: 445000000 },
  { channelCode: 'LINKAJA', channelName: 'LinkAja', channelStatus: 1, successRate: 92.1, totalCount: 4350, successCount: 4006, failCount: 344, totalAmount: 312000000 },
  { channelCode: 'SHOPEEPAY', channelName: 'ShopeePay', channelStatus: 3, successRate: 45.6, totalCount: 2100, successCount: 958, failCount: 1142, totalAmount: 156000000 },
  { channelCode: 'QRIS', channelName: 'QRIS', channelStatus: 1, successRate: 97.8, totalCount: 15600, successCount: 15257, failCount: 343, totalAmount: 1020000000 },
  { channelCode: 'BCA', channelName: 'BCA VA', channelStatus: 1, successRate: 88.5, totalCount: 7200, successCount: 6372, failCount: 828, totalAmount: 580000000 },
  { channelCode: 'BNI', channelName: 'BNI VA', channelStatus: 2, successRate: 72.4, totalCount: 3100, successCount: 2244, failCount: 856, totalAmount: 230000000 },
]

export const getChannelStats = async (
  params: ChannelStatsParams
): Promise<{ code: number; result: ChannelStats[] }> => {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 600))
  // 根据日期范围天数计算倍数
  let multiplier = 1
  if (params.startTime && params.endTime) {
    const diff = new Date(params.endTime).getTime() - new Date(params.startTime).getTime()
    multiplier = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
  } else {
    multiplier = params.period === 'day' ? 1 : params.period === 'week' ? 7 : 30
  }
  return {
    code: 200,
    result: mockChannelStats.map((ch) => ({
      ...ch,
      totalCount: Math.round(ch.totalCount * multiplier * (0.8 + Math.random() * 0.4)),
      successCount: Math.round(ch.successCount * multiplier * (0.8 + Math.random() * 0.4)),
      failCount: Math.round(ch.failCount * multiplier * (0.8 + Math.random() * 0.4)),
      totalAmount: Math.round(ch.totalAmount * multiplier * (0.8 + Math.random() * 0.4)),
      successRate: Math.round((ch.successRate + (Math.random() - 0.5) * 5) * 10) / 10,
    })),
  }
}
