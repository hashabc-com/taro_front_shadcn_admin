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
  pickupCenter: z.string().optional(),
  userName: z.string().optional(),
  accountNumber: z.string().optional(),
  refresh: z.union([z.string(), z.number()]).optional().nullable(),
})

export type IPaymentListsSearch = z.infer<typeof paymentListsSearchSchema>

export const Route = createFileRoute('/_authenticated/orders/payment-lists')({
  component: PaymentLists,
  validateSearch: paymentListsSearchSchema,
})
