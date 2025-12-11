import http from '@/lib/http'

// 获取支付渠道列表
export const getPayChannelList = (params: {
  pageNum?: number
  pageSize?: number
  merchantId?: string | null
}) => http.get('/admin/interface/v1/channelList', params)

// 获取渠道详情(字典类型列表)
export const getDictTypeList = (params: { type: 'withdraw_channel' | 'pay_channel' }) =>
  http.get('/admin/interface/v1/channelDetails', params)

// 更新渠道信息
export const updateChannelInfo = (data: {
  id: number
  merchantId: string
  type: number
  channel: string
  notChannel: string
}) => http.post('/admin/interface/v1/update', data)

// 更新渠道状态(启用/禁用)
export const updateChannelStatus = (data: FormData) =>
  http.post('/admin/interface/v1/updateChannelStatus', data)

// 新增支付渠道
export const addPayChannel = (data: {
  merchantId: string
  type: number
  channel: string
  notChannel: string
}) => http.post('/admin/interface/v1/add', data)

// 获取子渠道列表(存款记录列表)
export const getPaymentShopList = (params: FormData) => http.post('/admin/interface/v1/subChannelList', params)

// 更新子渠道状态
export const updatePaymentShopStatus = (data: FormData) =>
  http.post('/admin/interface/v1/updateSubChannelStatus', data)

// 一键配置
export const configChannel = (data: {
  type: number
  paymentPlatform: string
  withdrawalsShop: string
}) => http.post('/admin/interface/v1/configChannel', data)
