import { z } from 'zod'

export const schema = z.object({

  companyName: z.string(),
  paymentCompany: z.string(),
  dealTime: z.string(),
  billCount: z.number(),
  successBillCount: z.number(),
  successRate: z.string(),
  // amount: z.number(),
  // serviceAmount: z.number(),
  // totalAmount: z.number(),
})

export type IRowType = z.infer<typeof schema>

// // API 响应数据结构
// export const orderSummaryResponseSchema = z.object({
//   pageNum: z.number(),
//   pageSize: z.number(),
//   orderColumn: z.string().nullable(),
//   totalRecord: z.number(),
//   listRecord: z.array(orderSummarySchema),
//   orderTotal: z.string().nullable(),
//   amountTotal: z.string().nullable(),
//   amountServiceTotal: z.string().nullable(),
//   totalAmountTotal: z.string().nullable(),
//   successRate: z.string().nullable(),
//   successOrder: z.number().nullable(),
//   allOrder: z.number().nullable(),
//   amountTotalUSD: z.number().nullable(),
//   amountServiceTotalUSD: z.number().nullable(),
//   totalAmountTotalUSD: z.number().nullable(),
// })

// export type OrderListResponse = z.infer<typeof orderSummaryResponseSchema>
