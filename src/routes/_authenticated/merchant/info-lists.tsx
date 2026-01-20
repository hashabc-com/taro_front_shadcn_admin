import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { MerchantInfoPage } from '@/features/merchant/info-lists'

const searchSchema = createBaseSearchSchema({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IMerchantInfoSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/merchant/info-lists')({
  component: MerchantInfoPage,
  validateSearch: searchSchema,
})
