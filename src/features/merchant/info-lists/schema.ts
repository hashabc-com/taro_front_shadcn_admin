import { z } from 'zod'

// 商户信息数据结构
export const merchantInfoSchema = z.object({
  id: z.number(),
  account: z.string(),
  companyName: z.string(),
  country: z.string(),
  appid: z.string(),
  secretKey: z.string(),
  status: z.number(), // 0: 启用, 1: 禁用
  createTime: z.string(),
  paymentCompany: z.string().optional(),
  dealTime: z.string().optional(),
  billCount: z.number().optional(),
  amount: z.number().optional(),
  serviceAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  freezeType: z.number().optional(),
  accountFreezeDay: z.number().nullable().optional(),
  provice: z.string().optional(),
  zipcode: z.number().nullable().optional(),
  payoutServiceFee: z.number().nullable().optional(),
  payoutServiceRate: z.number().nullable().optional(),
  collectionServiceFee: z.number().nullable().optional(),
  collectionServiceRate: z.number().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  mobile: z.string().nullable().optional(),
  bankServiceFree: z.number().nullable().optional(),
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
