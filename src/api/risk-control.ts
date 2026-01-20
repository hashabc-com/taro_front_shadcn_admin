import type { IRiskControlSearch } from '@/routes/_authenticated/logs/risk-control'
import http from '@/lib/http'

// import type { ResponseData, PageParams, PageResult } from '@/types/api'

// export type RiskControlRecord = {
//   id: number
//   ruleId: number
//   ruleName: string
//   customerName: string
//   businessType: 'PAY_PAYIN' | 'PAY_PAYOUT'
//   businessId: string
//   actionCode: 'REJECT' | 'ALARM' | 'BLOCK'
//   reason?: string
//   requestParams?: string
//   responseParams?: string
//   createTime: string
//   localTime: string
// }

// export type RiskControlSearchParams = PageParams & {
//   ruleName?: string
//   businessType?: 'PAY_PAYIN' | 'PAY_PAYOUT'
// }

/**
 * 获取风控规则记录列表
 */
export const getRiskControlRecordList = (params: IRiskControlSearch) => {
  return http.get('/admin/ruleLog/list', params)
}
