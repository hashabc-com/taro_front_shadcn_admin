import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { MerchantInfoPage } from '@/features/merchant/info-lists'

const searchSchema = z.object({
  pageNum: z.number().default(1),
  pageSize: z.number().default(10),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IMerchantInfoSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/merchant/info-lists')({
  component: MerchantInfoPage,
  validateSearch: searchSchema,
})
