// utils/table-schemas.ts
import { z } from 'zod'

export const createPaginationSchema = () => {
  return z.object({
    pageNum: z.number().optional().default(1),
    pageSize: z
      .number()
      .optional()
      .default(10)
      //   .refine(
      //     (value) => [10, 20, 30, 40, 50].includes(value ?? 10),
      //     { message: '每页条数只能是 10, 20, 30, 40, 50' }
      //   )
      .transform((value) => {
        const allowedSizes = [10, 20, 30, 40, 50]
        return allowedSizes.includes(value ?? 10) ? value : 10
      }),
  })
}

// 创建扩展的基础schema
export const createBaseSearchSchema = <T extends z.ZodRawShape>(
  additionalSchema: T
) => {
  return createPaginationSchema().extend(additionalSchema)
}
