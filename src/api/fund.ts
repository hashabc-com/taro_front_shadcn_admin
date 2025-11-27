import http from '@/lib/http'
import { type ISettlementListSearch } from '@/routes/_authenticated/fund/settlement-lists'  

// 获取结算记录列表
export const getSettlementList = (params: ISettlementListSearch) => 
  http.get('/admin/bill/v1/getBillList', params)

// 获取收款汇总
// export const getReceiveSummary = (params: IOrderSummarySearch) => 
//   http.get('/admin/collection/v1/summaryList', params)

// // 获取付款订单明细
// export const getPaymentLists = (params: IPaymentListsSearch) => 
//   http.get('/admin/disbursement/v1/list', params)