import { createFileRoute } from '@tanstack/react-router'
import { type z } from 'zod'
import { CustomerConsultPage } from '@/features/business/customer-consult'
import { createBaseSearchSchema } from '@/lib/table-schemas'

const searchSchema = createBaseSearchSchema({})

export type ICustomerConsultSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute(
  '/_authenticated/business/customer-consult'
)({
  component: CustomerConsultPage,
  validateSearch: searchSchema,
})
