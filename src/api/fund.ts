import http from '@/lib/http'
import { type ISettlementListSearch } from '@/routes/_authenticated/fund/settlement-lists'  
import { type IRechargeWithdrawSearch } from '@/routes/_authenticated/fund/recharge-withdraw'


interface IRechargeWithdrawal {
  merchantId: string
  id: number
  exchangeRate?: string
  rechargeAmount: number
  finalAmount?: string
  withdrawalType: string
  type?: string
  status: number
  country?: string
  withdrawalPass?: string
  gauthcode?: string
  remark?: string
}



// 获取结算记录列表
export const getSettlementList = (params: ISettlementListSearch) => 
  http.get('/admin/bill/v1/getBillList', params)

// 获取收款汇总
// export const getReceiveSummary = (params: IOrderSummarySearch) => 
//   http.get('/admin/collection/v1/summaryList', params)

// // 获取付款订单明细
// export const getPaymentLists = (params: IPaymentListsSearch) => 
//   http.get('/admin/disbursement/v1/list', params)

// 获取申请审批列表
export const getRechargeWithdrawList = (params: IRechargeWithdrawSearch) => 
  http.get('/admin/approval/getWithdrawalList', params)

// 审批提现申请
export const approveWithdrawal = (data: IRechargeWithdrawal) => 
  http.post('/admin/approval/approveWithdrawal', data)

// 审批充值申请
export const approveRecharge = (data: IRechargeWithdrawal) => 
  http.post('/admin/recharge/v1/approveRecharge', data)