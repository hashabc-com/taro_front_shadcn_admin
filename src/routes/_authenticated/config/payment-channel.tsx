import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PaymentChannelConfig } from '@/features/config/payment-channel'

const paymentChannelSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10)
})

export const Route = createFileRoute('/_authenticated/config/payment-channel')({
  component: PaymentChannelConfig,
  validateSearch: paymentChannelSearchSchema,
})
