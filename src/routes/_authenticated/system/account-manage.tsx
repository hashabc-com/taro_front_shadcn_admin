import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AccountManage } from '@/features/system/account-manage'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const accountManageSearchSchema = createBaseSearchSchema({
  createTimeBegin: z.string().optional().nullable(),
  createTimeEnd: z.string().optional().nullable(),
})

export const Route = createFileRoute('/_authenticated/system/account-manage')({
  component: AccountManage,
  validateSearch: accountManageSearchSchema,
})
