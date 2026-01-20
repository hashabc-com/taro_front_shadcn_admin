import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ExportManagement } from '@/features/export-management'

const exportManagementSearchSchema = z.object({
  pageNum: z.number().optional().default(1),
  pageSize: z.number().optional().default(10),
})
export type IExportManagementSearch = z.infer<
  typeof exportManagementSearchSchema
>

export const Route = createFileRoute('/_authenticated/export-management')({
  component: ExportManagement,
  validateSearch: exportManagementSearchSchema,
})
