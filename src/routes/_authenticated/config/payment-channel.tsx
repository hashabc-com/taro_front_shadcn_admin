import { createFileRoute } from '@tanstack/react-router'
import { PaymentChannelConfig } from '@/features/config/payment-channel'
import { createBaseSearchSchema } from '@/lib/table-schemas'


const paymentChannelSearchSchema = createBaseSearchSchema({})


export const Route = createFileRoute('/_authenticated/config/payment-channel')({
  component: PaymentChannelConfig,
  validateSearch: paymentChannelSearchSchema,
})
