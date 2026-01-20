import { type ICollectionRateSearch } from '@/routes/_authenticated/orders/collection-success-rate'
import { type IPaymentListsSearch } from '@/routes/_authenticated/orders/payment-lists'
import { type IOrderSummarySearch } from '@/routes/_authenticated/orders/receive-summary-lists'
import http from '@/lib/http'

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

// 获取付款汇总
export const getPaymentSummary = (params: IOrderSummarySearch) =>
  http.get('/admin/disbursement/v1/summaryList', params)

// 准备导出收款订单
export const prepareExportReceive = (params: {
  startTime?: string
  endTime?: string
}) => http.get('/admin/collection/prepareExportData', params)

// 准备导出付款订单
export const prepareExportPayment = (params: {
  startTime?: string
  endTime?: string
}) => http.get('/admin/disbursement/prepareExportData', params)

// 获取代收成功率数据
export const getCollectionSuccessRate = (params: ICollectionRateSearch) =>
  http.get('/admin/collection/v1/orderdata', params)
