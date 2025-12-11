import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RoleManagePage } from '@/features/system/role-manage'

const roleManageSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
  role: z.string().optional(),
  createTimeBegin: z.string().optional(),
  createTimeEnd: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/system/role-manage')({
  component: RoleManagePage,
  validateSearch: roleManageSearchSchema,
})
