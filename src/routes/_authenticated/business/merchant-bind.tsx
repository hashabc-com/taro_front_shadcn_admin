import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MerchantBindPage } from '@/features/business/merchant-bind'
import { createBaseSearchSchema } from '@/lib/table-schemas'


const searchSchema = createBaseSearchSchema({
  userName: z.string().optional()
})

export type IMerchantBindSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/business/merchant-bind')({
  component: MerchantBindPage,
  validateSearch: searchSchema,
})
