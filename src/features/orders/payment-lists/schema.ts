import { z } from 'zod'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

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
  address: z.string().optional().nullable(),
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

export const statuses = {
  0: {
    label: '付款成功',
    icon: CheckCircle,
    color: 'green',
    i18n: 'orders.paymentOrders.paymentSuccess',
  },
  1: {
    label: '待付款',
    icon: Clock,
    color: 'blue',
    i18n: 'orders.paymentOrders.pendingPayment',
  },
  2: {
    label: '付款失败',
    icon: XCircle,
    color: 'red',
    i18n: 'orders.paymentOrders.paymentFailed',
  },
}

export type PaymentListsResponse = z.infer<typeof paymentListsResponseSchema>
