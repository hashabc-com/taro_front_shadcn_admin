import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PaymentLists } from '@/features/orders/payment-lists'

const paymentListsSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
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

