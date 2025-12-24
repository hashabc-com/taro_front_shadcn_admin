import { z } from 'zod'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

// 订单数据结构
export const orderSchema = z.object({
  id: z.number(),
  merchantId: z.string(),
  paymentCompany: z.string(),
  referenceno: z.string(),
  amount: z.number().or(z.string()),
  realAmount: z.number().or(z.string()).optional(),
  expiryDate: z.string().nullable(),
  remark: z.string().nullable(),
  transId: z.string(),
  status: z.string(),
  localPaymentDate: z.string().optional().nullable(),
  paymentDate: z.string().optional().nullable(),
  serviceAmount: z.number().or(z.string()),
  taxRate: z.string(),
  createTime: z.string(),
  updateTime: z.string(),
  companyName: z.string(),
  taxRateAmount: z.string(),
  pickupCenter: z.string(),
  amountTwo: z.string(),
  serviceAmountTwo: z.string(),
  notificationURL: z.string().nullable(),
  tripartiteOrder: z.string().optional().nullable(),
  country: z.string().nullable(),
  amountUSD: z.number().optional(),
  serviceAmountUSD: z.number().optional(),
  localTime: z.string().optional().nullable(),
})

export type Order = z.infer<typeof orderSchema>

export function getStatuses(t: (key: string) => string) {
  return [
    {
      label: t('orders.receiveOrders.paymentSuccess'),
      value: '0' as const,
      icon: CheckCircle,
    },
    {
      label: t('orders.receiveOrders.pendingPayment'),
      value: '1' as const,
      icon: Clock,
    },
    {
      label: t('orders.receiveOrders.paymentFailed'),
      value: '2' as const,
      icon: XCircle,
    },
  ]
}

// API 响应数据结构
export const orderListResponseSchema = z.object({
  pageNum: z.number(),
  pageSize: z.number(),
  orderColumn: z.string().nullable(),
  totalRecord: z.number(),
  listRecord: z.array(orderSchema),
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

export type OrderListResponse = z.infer<typeof orderListResponseSchema>
