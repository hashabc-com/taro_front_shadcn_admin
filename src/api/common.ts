import type { Country } from '@/stores/country-store'
import type { Merchant } from '@/stores/merchant-store'
import http, { type ResponseData } from '@/lib/http'

export interface IPaymentChannel {
  id: number
  dictType: string
  itemName: string
  itemValue: string
  sort: number
  status: boolean
  expression: string
  remark: string
  createTime: string
  children: Children[]
}

export interface Children {
  id: number
  dictType: string
  itemName: string
  itemValue: string
  sort: number
  status: boolean
  expression: string
  remark: string
  country: string
  createTime: string
}

export interface IProductDict {
  payinChannel: string[]
  payoutChannel: string[]
}

// 获取国家列表
export const getCountryList = () =>
  http.get<ResponseData<Country[]>>('/admin/home/v1/getCountryList')

// 获取商户列表
export const getMerchantList = () =>
  http.get<ResponseData<Merchant[]>>('/admin/user/v1/getAllUserList')

export const getMerchantListBySend = (country: string) =>
  http.get<ResponseData<Merchant[]>>(
    '/admin/user/v1/getAllUserList',
    { country },
    { autoAddCountry: false }
  )

// 获取支付渠道
export const getPaymentChannels = (type: 'withdraw_channel' | 'pay_channel') =>
  http.get(`/admin/interface/v1/channelDetails?type=${type}`)

// 获取产品类型字典
export const getProductDict = () =>
  http.get<IProductDict>(`/admin/user/v1/getChannelTypeList`)

// 获取图片
export const getImg = async (params: {
  mediaId: string
  type: boolean
}): Promise<string> => {
  try {
    const blob = (await http.get('/admin/pic/getMedia', params, {
      responseType: 'blob',
    })) as never
    return window.URL.createObjectURL(blob)
  } catch (error) {
    console.error('Get image failed:', error)
    return ''
  }
}

// 测试环境条件下发通知 / 收款订单
export const payOutNotify = (data: { transId: string; status: number }) =>
  http.get<ResponseData>('/admin/collection/payInNotify', data)

// 测试环境条件下发通知 / 付款订单
export const payInNotify = (data: { transId: string; status: number }) =>
  http.get<ResponseData>('/admin/disbursement/payOutNotify', data)

// 下载图片
export const downloadImg = async (
  params: { mediaId: string; type: boolean },
  filename: string
) => {
  try {
    const blob = (await http.get('/admin/pic/getMedia', params, {
      responseType: 'blob',
    })) as never
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.jpeg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

export const sendAnnouncement = (params: {
  country: string
  appidList?: string[] | undefined
  gauthKey: string
  content: string
}) =>
  http.post('/admin/accountmanage/v1/sendNotify', params, {
    autoAddCountry: false,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
