import http, { type ResponseData } from '@/lib/http'
import type { Country } from '@/stores/country-store'
import type { Merchant } from '@/stores/merchant-store'

// 获取国家列表
export const getCountryList = () => 
  http.get<ResponseData<Country[]>>('/admin/home/v1/getCountryList')

// 获取商户列表
export const getMerchantList = () => 
  http.get<ResponseData<Merchant[]>>('/admin/user/v1/getAllUserList')
