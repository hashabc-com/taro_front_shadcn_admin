import { type IMessageRecordSearch } from '@/routes/_authenticated/logs/message-record'
import http from '@/lib/http'

/**
 * 获取消息记录列表
 */
export const getMessageRecordList = (params: IMessageRecordSearch) => {
  return http.get('/admin/deadLetterQueue/page', params)
}
