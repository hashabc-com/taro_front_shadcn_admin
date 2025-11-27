import http from '@/lib/http'
import { type IOrderSummarySearch } from '@/routes/_authenticated/orders/receive-summary-lists'
import { type IPaymentListsSearch } from '@/routes/_authenticated/orders/payment-lists'

export interface IOrderListParams {
  pageNum: number
  pageSize: number
  country?: string
  referenceno?: string
  tripartiteOrder?: string
  status?: string
  startTime?: string
  endTime?: string
  transId?: string
}

// 获取收款订单列表
export const getOrderList = (params: IOrderListParams) => 
  http.get('/admin/collection/v1/list', params)

// 获取收款汇总
export const getReceiveSummary = (params: IOrderSummarySearch) => 
  http.get('/admin/collection/v1/summaryList', params)

// 获取付款订单明细
export const getPaymentLists = (params: IPaymentListsSearch) => 
  http.get('/admin/disbursement/v1/list', params)