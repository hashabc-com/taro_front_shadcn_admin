import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { CustomerConsultPage } from '@/features/business/customer-consult'

const searchSchema = createBaseSearchSchema({
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
})

export type ICustomerConsultSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute(
  '/_authenticated/business/customer-consult'
)({
  component: CustomerConsultPage,
  validateSearch: searchSchema,
})
