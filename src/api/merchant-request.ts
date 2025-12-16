import http from '@/lib/http'
import { type IMerchantRequestSearch } from '@/routes/_authenticated/logs/merchant-request'

/**
 * 获取商户请求日志列表
 */
export const getMerchantRequestList = (params: IMerchantRequestSearch) => {
  return http.get('/admin/recordTransactionLog/page', params)
}
