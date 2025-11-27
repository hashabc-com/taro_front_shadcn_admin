import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { z } from 'zod'

// 订单数据结构
export const paymentListsSchema = z.object({
  id: z.number().optional(),
  createTime: z.string().optional(),
  companyName: z.string().optional(),
  paymentCompany: z.string().optional(),
  dealTime: z.string().optional(),
  billCount: z.number().optional(),
  amount: z.string().optional(),
  serviceAmount: z.string().optional(),
  totalAmount: z.string().optional(),
  status: z.enum(['0', '1', '2']).optional(),
  transactionReferenceNo: z.string().optional(),
  certificateId: z.string().optional().nullable(),
  pickupCenter: z.string().optional(),
  transactionid: z.string().optional(),
  updateTime: z.string().optional(),
  accountNumber: z.string().optional(),
  address: z.string().optional(),
})

export type IPaymentListsType = z.infer<typeof paymentListsSchema>

// API 响应数据结构
export const paymentListsResponseSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  orderColumn: z.string().nullable(),
  totalRecord: z.number(),
  listRecord: z.array(paymentListsSchema),
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

export const statuses = [
  {
    label: '付款成功',
    value: '0' as const,
    icon: CheckCircle,
  },
  {
    label: '待付款',
    value: '1' as const,
    icon: Clock,
  },
  {
    label: '付款失败',
    value: '2' as const,
    icon: XCircle,
  },
]

export type PaymentListsResponse = z.infer<typeof paymentListsResponseSchema>