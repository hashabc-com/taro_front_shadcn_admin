import { type IDailySummarySearch } from '@/routes/_authenticated/business/daily-summary'
import { type IMonthlySummarySearch } from '@/routes/_authenticated/business/monthly-summary'
import http from '@/lib/http'

// 获取商务绑定列表
export const getBusinessBindList = (params: {
  pageNum: number
  pageSize: number
  searchContent?: string
}) => http.get('/admin/supervisorsCustomer/list', params)

// 根据商务ID获取商户列表
export const getMerchantsByBusinessId = (params: { supervisorsId: number }) =>
  http.get('/admin/supervisorsCustomer/getCustomerListBySuperId', params)

// 更新商务绑定
export const updateBusinessBind = (data: {
  supervisorsName: string
  supervisorsId: number
  customerList: Array<{
    customerappId: string
    country: string | null
  }>
}) => http.post('/admin/supervisorsCustomer/updateBatch', data)

// 获取商务日汇总
export const getBusinessDaySummary = (params: IDailySummarySearch) =>
  http.get('/admin/business/dailyReportList', params)

// 获取商务月汇总
export const getBusinessMonthlySummary = (params: IMonthlySummarySearch) =>
  http.get('/admin/business/monthlyReportList', params)

// 获取商务汇率
export const getBusinessRate = (businessId: number | string) =>
  http.get(
    '/admin/costRateConfig/getBusinessRateListByAppid',
    { businessId },
    { autoAddMerchantId: false }
  )

// 配置商务汇率
export const configureBusinessRate = (data: unknown[]) =>
  http.post('/admin/costRateConfig/saveOrUpdate', data, {
    autoAddMerchantId: false,
    autoAddCountry: false,
  })

// 获取客户咨询列表
export const getCustomerConsultList = (params: {
  pageNum: number
  pageSize: number
  country?: string
}) => http.get('/admin/customerInfoFollowUp/getList', params)

// 新增客户咨询
export const addCustomerConsult = (data: {
  contactPerson: string
  countryCode: string
  phone: string
  email?: string
  company?: string
  source?: string
  country: string
  consultContent?: string
  remark?: string
}) => http.post('/admin/customerInfoFollowUp/save', data)

// 获取客户跟进记录列表
export const getFollowRecordList = (customerId: number | string) =>
  http.get('/admin/customerInfoFollowUp/getCustomerFollowRecordList', {
    customerId,
  })

// 新增跟进记录
export const addFollowRecord = (data: {
  customerId: number | string
  followType: string
  followContent: string
  followResult: string
  remark?: string
}) => http.post('/admin/customerInfoFollowUp/saveCustomerFollowRecord', data)

// 更新客户跟进信息（保留用于兼容）
export const updateCustomerFollowUp = (data: {
  id: number | string
  followType?: string
  followContent?: string
  followResult?: string
}) => http.post('/admin/customerInfoFollowUp/update', data)
