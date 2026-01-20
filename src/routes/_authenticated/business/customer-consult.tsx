import { type z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { createBaseSearchSchema } from '@/lib/table-schemas'
import { CustomerConsultPage } from '@/features/business/customer-consult'

const searchSchema = createBaseSearchSchema({})

export type ICustomerConsultSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute(
  '/_authenticated/business/customer-consult'
)({
  component: CustomerConsultPage,
  validateSearch: searchSchema,
})
