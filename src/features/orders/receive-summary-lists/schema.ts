import { z } from 'zod'

// 订单数据结构
export const orderSummarySchema = z.object({
  companyName: z.string(),
  paymentCompany: z.string(),
  dealTime: z.string(),
  billCount: z.number(),
  amount: z.number(),
  serviceAmount: z.number(),
  totalAmount: z.number(),
})

//   id: z.number(),
//   merchantId: z.string(),
//   paymentCompany: z.string(),
//   referenceno: z.string(),
//   amount: z.number().or(z.string()),
//   expiryDate: z.string().nullable(),
//   remark: z.string().nullable(),
//   transId: z.string(),
//   status: z.string(),
//   paymentDate: z.string().nullable(),
//   serviceAmount: z.number().or(z.string()),
//   taxRate: z.string(),
//   createTime: z.string(),
//   updateTime: z.string(),
//   companyName: z.string(),
//   taxRateAmount: z.string(),
//   pickupCenter: z.string(),
//   amountTwo: z.string(),
//   serviceAmountTwo: z.string(),
//   notificationURL: z.string().nullable(),
//   tripartiteOrder: z.string(),
//   country: z.string(),
//   amountUSD: z.number(),
//   serviceAmountUSD: z.number(),
// })

export type IOrderSummaryType = z.infer<typeof orderSummarySchema>

// API 响应数据结构
export const orderSummaryResponseSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  orderColumn: z.string().nullable(),
  totalRecord: z.number(),
  listRecord: z.array(orderSummarySchema),
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

export type OrderListResponse = z.infer<typeof orderSummaryResponseSchema>
