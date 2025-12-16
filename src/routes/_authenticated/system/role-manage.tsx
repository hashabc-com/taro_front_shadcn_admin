import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RoleManagePage } from '@/features/system/role-manage'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const roleManageSearchSchema = createBaseSearchSchema({
  role: z.string().optional(),
  createTimeBegin: z.string().optional(),
  createTimeEnd: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/system/role-manage')({
  component: RoleManagePage,
  validateSearch: roleManageSearchSchema,
})
