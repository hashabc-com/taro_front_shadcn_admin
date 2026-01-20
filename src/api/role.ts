import http from '@/lib/http'

export interface IRouteType {
  id?: number
  name?: string
  type?: string
  url?: string
  parentId?: number
  parentIds?: string
  permission?: string
  available?: boolean
}

// 获取角色列表(分页)
export const getRoleList = (params: {
  pageNum: number
  pageSize: number
  role?: string | null
  createTimeBegin?: string | null
  createTimeEnd?: string | null
}) => http.get('/admin/rolemanage/v1/selectallpage', params)

// 获取所有角色(下拉框)
export const getAllRoles = () => http.get('/admin/rolemanage/v1/selectroles')

// 获取资源列表(权限列表)
export const getResourceList = () =>
  http.get<{ resourceList: IRouteType[] }>(
    '/admin/rolemanage/v1/selectresourcelist'
  )

// 新增角色
export const createRole = (data: {
  role: string
  description: string
  resourceIds: string
  createTime: string
}) => http.post('/admin/rolemanage/v1/insertrole', data)

// 更新角色
export const updateRole = (data: {
  id: number
  role: string
  description: string
  resourceIds: string
}) => http.post('/admin/rolemanage/v1/updaterolebyid', data)

// 删除角色
export const deleteRole = (data: FormData) =>
  http.post('/admin/rolemanage/v1/deleterole', data)
