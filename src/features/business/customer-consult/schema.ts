import { z } from 'zod'

// 客户状态
export const customerStatusEnum = z.enum(['NEW', 'FOLLOWING', 'DEAL', 'LOST'])
export type CustomerStatus = z.infer<typeof customerStatusEnum>

// 客户级别
export const customerLevelEnum = z.enum(['A', 'B', 'C'])
export type CustomerLevel = z.infer<typeof customerLevelEnum>

// 跟进方式
export const followTypeEnum = z.enum(['PHONE', 'VISIT', 'EMAIL', 'WECHAT', 'OTHER'])
export type FollowType = z.infer<typeof followTypeEnum>

// 跟进结果
export const followResultEnum = z.enum(['INTERESTED', 'CONSIDERING', 'REFUSED', 'SUCCESS'])
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
  followType: FollowType | null
  followContent: string | null
  followResult: FollowResult | null
  nextFollowTime: string | null
  attachmentUrls: string | null
  followBy: string | null
  followAt: string | null
  remark: string | null
  createdAt: string
  updatedAt: string | null
  isDeleted: string
}

// 列表搜索参数
export interface ICustomerConsultSearch {
  pageNum: number
  pageSize: number
  country?: string
}

// 跟进表单数据
export const followUpFormSchema = z.object({
  followType: z.string().min(1, { message: 'pleaseSelectFollowType' }),
  followContent: z.string().min(1, { message: 'pleaseEnterFollowContent' }),
  followResult: z.string().min(1, { message: 'pleaseSelectFollowResult' }),
  nextFollowTime: z.string().optional().nullable(),
  attachmentUrls: z.string().optional(),
  followBy: z.string().min(1, { message: 'pleaseEnterFollowBy' }),
})

export type FollowUpFormData = z.infer<typeof followUpFormSchema>
