import { type ICountryDailySummarySearch } from '@/routes/_authenticated/fund/country-daily-summary'
import { type IMerchantDailySummarySearch } from '@/routes/_authenticated/fund/merchant-daily-summary'
import { type IRechargeWithdrawSearch } from '@/routes/_authenticated/fund/recharge-withdraw'
import { type ISettlementListSearch } from '@/routes/_authenticated/fund/settlement-lists'
import http from '@/lib/http'

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

interface IRechargeData {
  currencyType: string
  customerAppid: string
  exchangeRate: number
  finalAmount: number
  rechargeAmount: number
  rechargeKey: string
  remark: string
  gauthCode: string
  userid?: number
  country: string
}

interface IWithdrawData {
  customerAppid: string
  rechargeAmount: number
  exchangeRate: number
  currencyType: string
  userid?: number
  finalAmount: number | string
  remark: string
  rechargeKey: string
  gauthCode: string
  country: string
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

// 获取商户每日汇总列表
export const getMerchantDailySummary = (params: IMerchantDailySummarySearch) =>
  http.get('/admin/financial/v1/findByPage', params)

// 获取国家每日汇总列表
export const getCountryDailySummary = (params: ICountryDailySummarySearch) =>
  http.get('/admin/financial/v1/findCountryByPage', params)

// 获取账户金额信息
export const getAccountAmount = () =>
  http.get('/admin/bill/v1/getAmountInformation')

// 添加充值记录
export const addRechargeRecord = (data: IRechargeData) =>
  http.post('/admin/bill/v1/addRechargeRecord', data)

// 添加提现记录
export const addWithdraw = (data: IWithdrawData) =>
  http.post('/admin/bill/v1/addWithdraw', data)

// 更新汇率
export const updateExchangeRate = (data: {
  name: string
  gauthCode: string
  data: string
}) => http.post('/admin/bill/v1/setExchangeRate', data)

// 获取汇率
export const getExchangeRate = () => http.get('/admin/home/v1/getExchangeRate')
