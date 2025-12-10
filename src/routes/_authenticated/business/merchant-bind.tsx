import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MerchantBindPage } from '@/features/business/merchant-bind'

const searchSchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  userName: z.string().optional(),
})

export type IMerchantBindSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/business/merchant-bind')({
  component: MerchantBindPage,
  validateSearch: searchSchema,
})
