import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { RoleManagePage } from '@/features/system/role-manage'

const roleManageSearchSchema = createBaseSearchSchema({
  role: z.string().optional(),
  createTimeBegin: z.string().optional(),
  createTimeEnd: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/system/role-manage')({
  component: RoleManagePage,
  validateSearch: roleManageSearchSchema,
})
