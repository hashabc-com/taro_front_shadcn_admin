import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { PaymentChannelConfig } from '@/features/config/payment-channel'

const paymentChannelSearchSchema = createBaseSearchSchema({})

export const Route = createFileRoute('/_authenticated/config/payment-channel')({
  component: PaymentChannelConfig,
  validateSearch: paymentChannelSearchSchema,
})
