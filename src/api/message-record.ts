import http from '@/lib/http'
import { type IMessageRecordSearch } from '@/routes/_authenticated/logs/message-record'


/**
 * 获取消息记录列表
 */
export const getMessageRecordList = (
  params: IMessageRecordSearch
) => {
  return http.get('/admin/deadLetterQueue/page', params)
}
