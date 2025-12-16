import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RechargeWithdrawPage } from '@/features/fund/recharge-withdraw'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const searchSchema = createBaseSearchSchema({
  status: z.string().optional(),
  type: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export type IRechargeWithdrawSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/fund/recharge-withdraw')({
  component: RechargeWithdrawPage,
  validateSearch: searchSchema,
})
