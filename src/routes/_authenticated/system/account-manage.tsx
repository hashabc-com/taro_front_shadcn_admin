import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { AccountManage } from '@/features/system/account-manage'

const accountManageSearchSchema = createBaseSearchSchema({
  createTimeBegin: z.string().optional().nullable(),
  createTimeEnd: z.string().optional().nullable(),
})

export const Route = createFileRoute('/_authenticated/system/account-manage')({
  component: AccountManage,
  validateSearch: accountManageSearchSchema,
})
