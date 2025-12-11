import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AccountManage } from '@/features/system/account-manage'

const accountManageSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  createTimeBegin: z.string().optional().nullable(),
  createTimeEnd: z.string().optional().nullable(),
})

export const Route = createFileRoute('/_authenticated/system/account-manage')({
  component: AccountManage,
  validateSearch: accountManageSearchSchema,
})
