import { z } from 'zod'

export const merchantDailySummarySchema = z.object({
  companyName: z.string(),
  localTime: z.string().optional(),
  inAmount: z.string().or(z.number()),
  inAmountService: z.string().or(z.number()),
  outAmount: z.string().or(z.number()),
  outAmountService: z.string().or(z.number()),
  rechargeAmoubt: z.string().or(z.number()),
  withdrawAmount: z.string().or(z.number()),
  settlementAmount: z.string().or(z.number()),
  availableAmount: z.string().or(z.number()),
})

export type IMerchantDailySummaryType = z.infer<typeof merchantDailySummarySchema>
