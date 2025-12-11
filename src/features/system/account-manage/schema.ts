import { z } from 'zod'

// 账户数据结构
export const accountSchema = z.object({
  id: z.number().optional(),
  userName: z.string().optional(),
  account: z.string().optional(),
  password: z.string().optional(),
  mobile: z.string().optional(),
  roleIds: z.number().or(z.string()).optional(),
  userType: z.number().optional(),
  disabledStatus: z.number().optional(),
  createTime: z.string().optional(),
  updateTime: z.string().optional(),
})

export type IAccountType = z.infer<typeof accountSchema>

// API 响应数据结构
export const accountResponseSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  totalRecord: z.number(),
  listRecord: z.array(accountSchema),
})

// 用户类型
export const userTypes = {
  1: {
    label: '超级管理员',
    value: 1,
  },
  2: {
    label: '财务人员',
    value: 2,
  },
  3: {
    label: '商务',
    value: 3,
  },
  4: {
    label: '其他',
    value: 4,
  },
} as const

// 搜索类型
export const searchTypes = [
  { label: '姓名', value: '1' },
  { label: '账号', value: '2' },
  { label: '手机号', value: '3' },
] as const

export type TreeNode = {
  id?: number
  key: string
  title: string
  children?: TreeNode[]
}
