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
  return http.post<ChartDataOfDay>('/admin/home/v1/chartDataOfDay', new FormData())
}
