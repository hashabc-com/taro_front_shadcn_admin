import { z } from 'zod'

export const monthlySummarySchema = z.object({
  businessName: z.string(),
  localTime: z.string(),
  inBills: z.number(),
  inAmount: z.number(),
  inAmountService: z.number(),
  outBills: z.number(),
  outAmount: z.number(),
  outAmountService: z.number(),
})

export type IMonthlySummaryType = z.infer<typeof monthlySummarySchema>
