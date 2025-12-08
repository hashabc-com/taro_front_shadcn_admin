import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PaymentSummary } from '@/features/orders/payment-summary-lists'

const paymentSummarySearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})
export type IOrderSummarySearch = z.infer<typeof paymentSummarySearchSchema>

export const Route = createFileRoute('/_authenticated/orders/payment-summary-lists')({
  component: PaymentSummary,
  validateSearch: paymentSummarySearchSchema,
})
