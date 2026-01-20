import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { MerchantRequestPage } from '@/features/logs/merchant-request'

const merchantRequestSearchSchema = createBaseSearchSchema({
  transactionId: z.string().optional(),
  country: z.string().optional(),
})

export type IMerchantRequestSearch = z.infer<typeof merchantRequestSearchSchema>

export const Route = createFileRoute('/_authenticated/logs/merchant-request')({
  component: MerchantRequestPage,
  validateSearch: merchantRequestSearchSchema,
})
