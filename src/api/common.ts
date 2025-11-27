import http, { type ResponseData } from '@/lib/http'
import type { Country } from '@/stores/country-store'
import type { Merchant } from '@/stores/merchant-store'

export interface IPaymentChannel {
  id: number
  dictType: string
  itemName: string
  itemValue: string
  sort: number
  status: boolean
  expression: string
  remark: string
  createTime: string
  children: Children[]
}

export interface Children {
  id: number
  dictType: string
  itemName: string
  itemValue: string
  sort: number
  status: boolean
  expression: string
  remark: string
  country: string
  createTime: string
}



// 获取国家列表
export const getCountryList = () => 
  http.get<ResponseData<Country[]>>('/admin/home/v1/getCountryList')

// 获取商户列表
export const getMerchantList = () => 
  http.get<ResponseData<Merchant[]>>('/admin/user/v1/getAllUserList')


// 获取支付渠道
export const getPaymentChannels = (type: 'withdraw_channel' | 'pay_channel') => 
  http.get(`/admin/interface/v1/channelDetails?type=${type}`)