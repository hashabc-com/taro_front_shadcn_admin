import { z } from 'zod'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

// 订单数据结构
export const orderSchema = z.object({
  id: z.number(),
  merchantId: z.string(),
  paymentCompany: z.string().optional().nullable(),
  referenceno: z.string().optional().nullable(),
  amount: z.number().or(z.string()),
  realAmount: z.number().or(z.string()).optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  remark: z.string().optional().nullable(),
  transId: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  localPaymentDate: z.string().optional().nullable(),
  paymentDate: z.string().optional().nullable(),
  serviceAmount: z.number().or(z.string()).optional().nullable(),
  taxRate: z.string().optional().nullable(),
  createTime: z.string().optional().nullable(),
  updateTime: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  taxRateAmount: z.string().optional().nullable(),
  pickupCenter: z.string().optional().nullable(),
  amountTwo: z.string().optional().nullable(),
  serviceAmountTwo: z.string().optional().nullable(),
  notificationURL: z.string().optional().nullable(),
  tripartiteOrder: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  amountUSD: z.number().optional().nullable(),
  serviceAmountUSD: z.number().optional().nullable(),
  localTime: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
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
