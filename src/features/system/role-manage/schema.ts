import { z } from 'zod'

// 角色数据结构
export const roleSchema = z.object({
  id: z.number(),
  role: z.string(),
  description: z.string(),
  resourceIds: z.string(), // 以逗号分隔的资源ID字符串,如 "31,9,10"
  createTime: z.string(),
})

export type Role = z.infer<typeof roleSchema>

// 资源项数据结构(从后端接口获取)
export interface Resource {
  id: number // 资源ID
  name: string // 资源名称
}

// 树形节点数据结构(用于Tree组件)
export interface TreeNode {
  id?: number // 资源ID,用于提交表单
  key: string // URL路径,如 '/' 或 '/orders/receive-lists'
  title: string // 菜单标题
  children?: TreeNode[]
}

// API 响应数据结构
export const roleListResponseSchema = z.object({
  pageNum: z.number().optional(),
  pageSize: z.number().optional(),
  totalRecord: z.number().optional(),
  listRecord: z.array(roleSchema).optional(),
})

export type RoleListResponse = z.infer<typeof roleListResponseSchema>
