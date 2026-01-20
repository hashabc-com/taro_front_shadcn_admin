import { type IExportManagementSearch } from '@/routes/_authenticated/export-management'
import http from '@/lib/http'

export interface IExportRecord {
  id: number
  fileName: string
  exportType: 'PAYMENT' | 'LENDING' | 'TRAN'
  status: 0 | 1 | 2 // 0:生成中 1:可下载 2:生成失败
  fileId: string
  createTime: string
}

export interface IExportListParams {
  page: number
  pageSize: number
}

export interface IExportListResponse {
  list: IExportRecord[]
  total: number
}

export const getExportList = (params: IExportManagementSearch) =>
  http.get('/admin/exportRecord/list', { params })

export const downloadExportFile = (fileId: string) =>
  http.get(
    `/admin/collection/downloadExportData?fileId=${fileId}`,
    {},
    {
      autoAddCountry: false,
      responseType: 'blob',
    }
  )
