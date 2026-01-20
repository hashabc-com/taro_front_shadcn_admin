import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { PaymentSummary } from '@/features/orders/payment-summary-lists'

const paymentSummarySearchSchema = createBaseSearchSchema({
  channel: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IOrderSummarySearch = z.infer<typeof paymentSummarySearchSchema>

export const Route = createFileRoute(
  '/_authenticated/orders/payment-summary-lists'
)({
  component: PaymentSummary,
  validateSearch: paymentSummarySearchSchema,
})
