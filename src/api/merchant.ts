import http from '@/lib/http'
import { type IMerchantInfoSearch } from '@/routes/_authenticated/merchant/info-lists'

import { type IMerchantInfoType } from '@/features/merchant/info-lists/schema'

// export interface IMerchantInfoType {
//   id?: number
//   freezeType: number
//   accountFreezeDay: number | null
//   provice: string
//   zipcode?: string | null
//   account: string
//   password?: string
//   companyName: string
//   bankServiceFree?: string
//   country?: string
//   phoneNumber?: string
//   email?: string
//   mobile?: string
//   gauthKey: string
// }

// 获取商户信息列表
export const getMerchantInfoList = (params: IMerchantInfoSearch) =>
  http.get('/admin/user/v1/getUserList', params)

// 全部商户（下拉框）
export const getAllCustomer = () => http.get('/admin/user/v1/getAllUserList')

// 新增商户
export const addCustomer = (data: IMerchantInfoType) =>
  http.post('/admin/user/v1/addUser', data)

// 修改密码
export const updatePass = (data: FormData) =>
  http.post('/admin/user/v1/updateUserPass', data)

// 更新用户信息
export const updateCustomer = (data: IMerchantInfoType) =>
  http.post('/admin/user/v1/updateUser', data)

// 解绑Google验证
export const unbindGoogle = (data: FormData) => http.post('/admin/deplop/v1/unbindGoogle', data,{autoAddMerchantId:false})

// 添加IP
export const addIP = (data: {
  merchantId: string
  ip: string
  googleCode: string
}) => http.post('/admin/deplop/v1/addIp', data)

// 绑定TG群组
export const bindTgGroup = (data: FormData) =>
  http.post('/admin/user/v1/bindTgGroup', data,{autoAddCountry:false})

// 获取商户费率
export const getMerchantRate = (params: { merchantId: string }) =>
  http.get('/admin/customerRate/getRateListByAppid', params,{autoAddMerchantId:false})

// 更新商户费率
export const updateMerchantRate = (data: unknown[]) =>
  http.post('/admin/customerRate/update', data,{autoAddMerchantId:false,autoAddCountry:false})

// 获取渠道类型列表
export const getChannelTypeList = (country: string,channelCode: string) =>
  http.get('/admin/user/v1/getChannelTypeList', { country, channelCode })

// 获取自动登录token
export const getAutoLoginToken = (merchantId: string, googleCode: string) =>
  http.post(`/admin/user/v1/loginCustomerBackstage?merchantId=${merchantId}&gauthKey=${googleCode}`,{},{autoAddMerchantId:false,autoAddCountry:false})

