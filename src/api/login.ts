import http from '@/lib/http'

export interface IVerifyCodeResponse {
  base64ImgStr: string
  key: string
}

export type ILoginType = 'confirm' | 'login'

export interface ILoginForm {
  username: string
  password: string
  validatecode: string
  validatekey: string
  gauthkey?: string
  type: ILoginType
}

export interface IUserInfo {
  account: string
  createTime: string
  disabledStatus: number
  email: string
  gauthKey: string
  id: number
  lastLoginTime: string
  mobile: string
  password: string
  roleIds: string
  salt: string
  updateTime: string
  userName: string
  userType: number
}

export interface ILoginResponse {
  code: string
  message: string
  result?: {
    TOKEN: string
    userInfo: IUserInfo
  }
}

// 登录
export const login = (data: ILoginForm) => 
  http.post('/admin/login/form', data)

// 获取图片验证码
export const getVerifyCode = () => http.post('/admin/googleVerify/v1/getPictureVerificationCode', {})

// 获取谷歌验证密钥
export const getKey = (data: Partial<IUserInfo>) => http.post('/admin/googleVerify/v1/getKey', data)

// 绑定谷歌验证密钥
export const bindKey = (data: Partial<IUserInfo>) => http.post('/admin/googleVerify/v1/bindKey', data)
