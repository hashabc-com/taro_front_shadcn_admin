import { z } from 'zod'

export const businessSchema = z.object({
  id: z.number(),
  account: z.string(),
  userName: z.string(),
  disabledStatus: z.number(), // 0: 启用, 1: 禁用
  phone: z.string().nullable().optional(),
  createTime: z.string(),
})

export type IBusinessType = z.infer<typeof businessSchema>

export const merchantItemSchema = z.object({
  customerappId: z.string(),
  customerName: z.string(),
  country: z.string(),
  status: z.number(), // 0: 未绑定, 1: 已绑定
})

export type IMerchantItem = z.infer<typeof merchantItemSchema>
