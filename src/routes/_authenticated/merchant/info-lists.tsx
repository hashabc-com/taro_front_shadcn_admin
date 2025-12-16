import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MerchantInfoPage } from '@/features/merchant/info-lists'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const searchSchema = createBaseSearchSchema({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IMerchantInfoSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/merchant/info-lists')({
  component: MerchantInfoPage,
  validateSearch: searchSchema,
})
