import http from '@/lib/http'
// import { type OrderListResponse } from '@/features/orders/receive-lists/data/schema'

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
