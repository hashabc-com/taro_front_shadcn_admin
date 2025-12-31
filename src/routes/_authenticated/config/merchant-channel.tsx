import { createFileRoute } from '@tanstack/react-router'
import { PaymentChannelConfig } from '@/features/config/merchant-channel'
import { createBaseSearchSchema } from '@/lib/table-schemas'


const merchantChannelSearchSchema = createBaseSearchSchema({})


export const Route = createFileRoute('/_authenticated/config/merchant-channel')({
  component: PaymentChannelConfig,
  validateSearch: merchantChannelSearchSchema,
})
