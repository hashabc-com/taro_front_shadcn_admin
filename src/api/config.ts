import http from '@/lib/http'

// ======================== 支付通道配置 API ========================

// 获取支付通道列表
export const getPaymentChannelList = (params: {
  pageNum?: number
  pageSize?: number
  channelCode?: string | null
  channelStatus?: number | null
  fundType?: number | null
  country?: string | null
}) => http.get('/admin/paymentChannel/list', params,{autoAddCountry:false})

// 新增支付通道
export const addPaymentChannel = (data: {
  channelCode: string
  channelName: string
  channelDesc?: string
  fundType: number
  singleMinAmount?: number
  singleMaxAmount?: number
  dailyMaxAmount?: number
  channelStatus: number
  costRate?: number
  externalQuoteRate?: number
  transProcessTime?: string
  runTimeRange?: string
  country?: string
  remark?: string
}) => http.post('/admin/paymentChannel/add', data,{autoAddCountry:false})

// 更新支付通道
export const updatePaymentChannel = (data: {
  id: number
  channelCode: string
  channelName: string
  channelDesc?: string
  fundType: number
  singleMinAmount?: number
  singleMaxAmount?: number
  dailyMaxAmount?: number
  channelStatus: number
  costRate?: number
  externalQuoteRate?: number
  transProcessTime?: string
  runTimeRange?: string
  country?: string
  remark?: string
}) => http.post('/admin/paymentChannel/update', data,{autoAddCountry:false})

// 更新支付通道状态
export const updatePaymentChannelStatus = (data: {
  id: number
  channelStatus: number
}) => http.post('/admin/paymentChannel/updateStatus', data,{autoAddCountry:false})

// ======================== 子渠道配置 API ========================

// 获取子渠道列表
export const getSubChannelList = (params: {
  channelCode: string
}) => http.get('/admin/paymentChannel/getSubChannelList', params, {autoAddCountry:false})

// 添加子渠道
export const addSubChannel = (data: {
  channelCode: string
  subChannelCode: string
  subChannelName: string
  subChannelStatus: number
  type: number
  country?: string
}) => http.post('/admin/paymentChannel/addSubChannel', data, {autoAddCountry:false})

// 删除子渠道
export const deleteSubChannel = (params: {
  id: number
}) => http.post('/admin/paymentChannel/delSubChannel', null, { params, autoAddCountry:false })

// ======================== 商户渠道配置 API (旧) ========================

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
}) => http.post('/admin/interface/v1/update', data,{headers: { 'Content-Type': 'multipart/form-data' }})

// 更新渠道状态(启用/禁用)
export const updateChannelStatus = (data: FormData) =>
  http.post('/admin/interface/v1/updateChannelStatus', data)

// 新增支付渠道
export const addPayChannel = (data: {
  merchantId: string
  type: number
  channel: string
  notChannel: string
}) => http.post('/admin/interface/v1/add', data,{
 headers: { 'Content-Type': 'multipart/form-data' }
})

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
}) => http.post('/admin/deplop/v1/channel', data,{
 headers: { 'Content-Type': 'multipart/form-data' }
})

// ======================== 路由策略配置 API ========================

// 获取路由策略列表
export const getRouteStrategyList = (params: {
  pageNum?: number
  pageSize?: number
  appid?: string | null
}) => http.get('/admin/paymentRouteConfig/list', params)

// 添加路由策略配置
export const addRouteStrategy = (data: {
  appid?: string
  paymentType: string
  productCode: string
  routeStrategy: string
  country: string
  paymentRouteChannelWeightList: Array<{
    paymentPlatform: string
    weight?: number
  }>
}) => http.post('/admin/paymentRouteConfig/saveOrUpdate', data)

// 根据国家和支付类型获取支付方式
export const getPaymentMethods = (params: {
  country: string
  type: string
}) => http.get('/admin/paymentRouteConfig/selectBySubChannelCodeGroup', params, { autoAddCountry: false })

// 根据国家、类型和支付方式获取支付渠道列表
export const getPaymentChannelsByMethod = (params: {
  country: string
  type: string
  subchannelcode: string
}) => http.get('/admin/paymentRouteConfig/selectByChannelCode', params, { autoAddCountry: false })

// 获取路由策略权重详情
export const getRouteStrategyWeightDetail = (params: {
  country: string
  appid: string
  productCode: string
  paymentType: string
}) => http.get('/admin/paymentRouteConfig/weightList', params, { autoAddCountry: false })

// 更新路由策略状态
export const updateRouteStrategyStatus = (data: {
  id: number
  status: string
}) => http.post('/admin/paymentRouteConfig/update', data,{autoAddCountry:false})
