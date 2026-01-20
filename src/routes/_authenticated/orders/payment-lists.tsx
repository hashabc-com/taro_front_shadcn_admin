import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { PaymentLists } from '@/features/orders/payment-lists'

const paymentListsSearchSchema = createBaseSearchSchema({
  refNo: z.string().optional(),
  transId: z.string().optional(),
  mobile: z.string().optional(),
  status: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IPaymentListsSearch = z.infer<typeof paymentListsSearchSchema>

export const Route = createFileRoute('/_authenticated/orders/payment-lists')({
  component: PaymentLists,
  validateSearch: paymentListsSearchSchema,
})
