import { z } from 'zod'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

// 订单数据结构
export const settlementListSchema = z.object({
  companyName: z.string(),
  paymentCompany: z.string(),
  dealTime: z.string(),
  billCount: z.number(),
  amount: z.number(),
  serviceAmount: z.number(),
  totalAmount: z.number(),
  finalAmount: z.number(),
  rechargeAmount: z.number(),
})

export type ISettlementListType = z.infer<typeof settlementListSchema>

// export const statuses = [
//   {
//     label: '审核未通过',
//     value: '0' as const,
//     icon: CheckCircle,
//   },
//   {
//     label: '审核通过',
//     value: '1' as const,
//     icon: Clock,
//   },
//   {
//     label: '审核中',
//     value: '2' as const,
//     icon: XCircle,
//   },
// ]

export const statuses = {
  0: {
    icon: XCircle,
    color: 'red',
    label: 'fund.settlement.reviewNotApproved',
  },
  1: {
    icon: CheckCircle,
    color: 'green',
    label: 'fund.settlement.reviewApproved',
  },
  2: {
    icon: Clock,
    color: 'blue',
    label: 'fund.settlement.reviewing',
  },
}

export const types = [
  {
    label: '入账',
    value: '1' as const,
  },
  {
    label: '充值',
    value: '2' as const,
  },
  {
    label: '提现',
    value: '5' as const,
  },
  {
    label: '付款',
    value: '6' as const,
  },
]

// API 响应数据结构
export const settlementListResponseSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  orderColumn: z.string().nullable(),
  totalRecord: z.number(),
  listRecord: z.array(settlementListSchema),
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

export type SettlementListResponse = z.infer<
  typeof settlementListResponseSchema
>
