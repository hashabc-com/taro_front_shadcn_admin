import { z } from 'zod'

// 客户状态
export const customerStatusEnum = z.enum(['NEW', 'FOLLOWING', 'DEAL', 'LOST'])
export type CustomerStatus = z.infer<typeof customerStatusEnum>

// 客户级别
export const customerLevelEnum = z.enum(['A', 'B', 'C'])
export type CustomerLevel = z.infer<typeof customerLevelEnum>

// 跟进方式
export const followTypeEnum = z.enum([
  'PHONE',
  'VISIT',
  'EMAIL',
  'WECHAT',
  'OTHER',
])
export type FollowType = z.infer<typeof followTypeEnum>

// 跟进结果
export const followResultEnum = z.enum([
  'INTERESTED',
  'CONSIDERING',
  'REFUSED',
  'SUCCESS',
])
export type FollowResult = z.infer<typeof followResultEnum>

// 客户咨询信息
export interface ICustomerConsult {
  id: number
  customerName: string | null
  contactPerson: string | null
  countryCode: string
  phone: string | null
  email: string | null
  company: string | null
  industry: string | null
  source: string | null
  country: string
  status: CustomerStatus
  level: CustomerLevel | null
  consultContent: string | null
  remark: string | null
  createdAt: string
  updatedAt: string | null
  isDeleted: string
}

// 客户跟进记录
export interface IFollowRecord {
  id: number
  customerId: number
  followType: FollowType
  followContent: string
  followResult: FollowResult
  followBy: string | null
  followAt: string
  remark: string | null
  createdAt: string
  updatedAt: string | null
}

// 列表搜索参数
export interface ICustomerConsultSearch {
  pageNum: number
  pageSize: number
  country?: string
  contactPerson?: string
  phone?: string
  email?: string
  company?: string
}

// 新增客户表单类型（schema 在组件内动态创建以支持国际化）
export interface AddCustomerFormData {
  contactPerson: string
  countryCode: string
  phone: string
  email: string
  company?: string
  source?: string
  country: string
  consultContent?: string
  remark?: string
}

// 跟进表单数据类型（schema 在组件内动态创建以支持国际化）
export interface FollowUpFormData {
  followType: string
  followContent: string
  followResult: string
  remark?: string
}
