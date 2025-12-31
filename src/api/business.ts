import http from '@/lib/http'
import { type IDailySummarySearch } from '@/routes/_authenticated/business/daily-summary'
import { type IMonthlySummarySearch } from '@/routes/_authenticated/business/monthly-summary'

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
export const getBusinessDaySummary = (params: IDailySummarySearch) => http.get('/admin/business/dailyReportList', params)

// 获取商务月汇总
export const getBusinessMonthlySummary = (params: IMonthlySummarySearch) => http.get('/admin/business/monthlyReportList', params)


// 获取商务汇率
export const getBusinessRate = (businessId: number) =>
  http.get('/admin/costRateConfig/getBusinessRateListByAppid', { businessId },{autoAddMerchantId:false})

// 配置商务汇率
export const configureBusinessRate = (data: unknown[]) =>
  http.post('/admin/costRateConfig/saveOrUpdate', data,{autoAddMerchantId:false,autoAddCountry:false})