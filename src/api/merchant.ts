import http from '@/lib/http'
import { type IMerchantInfoSearch } from '@/routes/_authenticated/merchant/info-lists'

// 获取商户信息列表
export const getMerchantInfoList = (params: IMerchantInfoSearch) =>
  http.get('/admin/user/v1/getUserList', params)
