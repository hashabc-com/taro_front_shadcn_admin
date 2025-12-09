import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { z } from 'zod'


export const rechargeWithdrawSchema = z.object({
  id: z.number(),
  merchantId: z.string(),
  companyName: z.string(),
  createTime: z.string().optional(),
  type: z.string().optional(),
  rechargeAmount: z.string(),
  withdrawalType: z.string().optional().nullable(),
  exchangeRate: z.string().or(z.number()).optional().nullable(),
  finalAmount: z.string(),
  withdrawalAddress: z.string().optional().nullable(),
  mediaId: z.string().optional().nullable(),
  local_url: z.string().optional(),
  remark: z.string().optional().nullable(),
  processStatus: z.number().optional().nullable(),
  country: z.string().optional(),
  paymentCompany: z.string().optional().nullable(),
  dealTime: z.string().optional(),
  billCount: z.number().optional(),
  amount: z.number().optional(),
  serviceAmount: z.string().optional(),
  totalAmount: z.string().optional(),
})

export type IRechargeWithdrawType = z.infer<typeof rechargeWithdrawSchema>


export const statuses = {
  0:{
    icon: XCircle,
    color: 'red',
    label:'fund.settlement.reviewNotApproved'
  },
  1:{
    icon: CheckCircle,
    color: 'green',
    label:'fund.settlement.reviewApproved'
  },
  2:{
    icon: Clock,
    color: 'blue',
    label:'fund.settlement.reviewing'
  },
}

export const types = [
  {
    label: "入账",
    value: "1" as const,
  },
  {
    label: "充值",
    value: "2" as const,
  },
  {
    label: "提现",
    value: "5" as const,
  },
  {
    label: "付款",
    value: "6" as const,
  },
];

// API 响应数据结构
// export const settlementListResponseSchema = z.object({
//   pageNum: z.number(),
//   pageSize: z.number(),
//   orderColumn: z.string().nullable(),
//   totalRecord: z.number(),
//   listRecord: z.array(settlementListSchema),
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

// export type SettlementListResponse = z.infer<typeof settlementListResponseSchema>
