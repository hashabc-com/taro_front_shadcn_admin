import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { DailySummaryPage } from '@/features/business/daily-summary'

const searchSchema = createBaseSearchSchema({
  // 你的其他搜索参数
  status: z.string().optional(),
  channel: z.string().optional(),
  businessName: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

// const searchSchema = z.object({
//   pageNum: z.number().default(1),
//   pageSize: z
//     .number()
//     .default(10)
//     .transform((value) => {
//       // 确保返回预设的值
//       const allowedSizes = [10, 20, 30, 40, 50]
//       return allowedSizes.includes(value ?? 10) ? value : 10
//     }),

// })

export type IDailySummarySearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/_authenticated/business/daily-summary')({
  component: DailySummaryPage,
  validateSearch: searchSchema,
})
