import http from '@/lib/http'

export interface IAccountType {
  id?: number
  userName?: string
  account?: string
  password?: string
  mobile?: string
  roleIds?: number
  userType?: number
  disabledStatus?: number
  createTime?: string
  updateTime?: string
}

// 获取账户列表(分页)
export const getAccountList = (params: {
  pageNum: number
  pageSize: number
  searchType?: string | null
  searchContent?: string | null
  createTimeBegin?: string | null
  createTimeEnd?: string | null
}) => http.get('/admin/accountmanage/v1/selectlist', params)

// 根据ID查询账户
export const getAccountById = (params: { id: number }) =>
  http.get('/admin/accountmanage/v1/selectbyid', params)

// 新增账户
export const createAccount = (data: {
  userName: string
  account: string
  password: string
  mobile?: string
  roleIds: number
  userType: number
  disabledStatus: number
}) => http.post('/admin/accountmanage/v1/insertaccount', data)

// 更新账户信息
export const updateAccount = (data: {
  id: number
  userName: string
  account: string
  mobile?: string
  roleIds: number
  userType: number
  disabledStatus: number
}) => http.post('/admin/accountmanage/v1/updateAccount', data)

// 修改密码
export const updatePassword = (data: {
  id: number
  pwd: string
  rePwd: string
}) =>
  http.post('/admin/accountmanage/v1/updatepassword', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

// 修改启用状态
export const updateDisabledStatus = (data: {
  id: number
  disableStatus: number
}) =>
  http.post('/admin/accountmanage/v1/updatedisabledstatus', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

// 删除账户
export const deleteAccount = (data: { id: number }) =>
  http.post('/admin/accountmanage/v1/deleteaccount', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

// 获取账号权限
export const getAccountPermissions = () =>
  http.get('/admin/authority/v1/getUserAuthority')
