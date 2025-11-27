import { z } from 'zod'

// 商户信息数据结构
export const merchantInfoSchema = z.object({
  companyName: z.string(),
  paymentCompany: z.string(),
  dealTime: z.string(),
  billCount: z.number(),
  amount: z.number(),
  serviceAmount: z.number(),
  totalAmount: z.number(),
})

export type IMerchantInfoType = z.infer<typeof merchantInfoSchema>

// API 响应数据结构
export const merchantInfoResponseSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  orderColumn: z.string().nullable(),
  totalRecord: z.number(),
  listRecord: z.array(merchantInfoSchema),
  orderTotal: z.string().nullable(),
  amountTotal: z.string().nullable(),
  amountServiceTotal: z.string().nullable(),
  totalAmountTotal: z.string().nullable(),
  successRate: z.string().nullable(),
  successOrder: z.number().nullable(),
  allOrder: z.number().nullable(),
  amountTotalUSD: z.number().nullable(),
  amountServiceTotalUSD: z.number().nullable(),
  totalAmountTotalUSD: z.number().nullable(),
})

export type MerchantInfoResponse = z.infer<typeof merchantInfoResponseSchema>
