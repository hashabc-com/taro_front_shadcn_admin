/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores'
import { toast as message } from 'sonner'

// 定义响应数据的通用结构
export interface ResponseData<T = any> {
  code: number | string
  message: string
  data?: T
  result?: T
}

// 请求配置
export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示加载提示
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否自动添加 country 参数
  autoAddCountry?: boolean
  // 是否自动添加 merchantId 参数
  autoAddMerchantId?: boolean
}

class Request {
  private instance: AxiosInstance
  private baseConfig: RequestConfig = {
    baseURL: import.meta.env.VITE_TRAOPAY_API_URL || '',
    timeout: 100000,
    showLoading: true,
    showError: true,
    autoAddCountry: true,
    autoAddMerchantId: true,
  }

  constructor(config?: RequestConfig) {
    this.instance = axios.create({ ...this.baseConfig, ...config })
    this.setupInterceptors()
  }

  // 通用添加参数方法
  private addParamToConfig(
    config: InternalAxiosRequestConfig,
    paramName: string,
    paramValue: string | number
  ): void {
    if (config.method === 'get' || config.method === 'GET') {
      config.params = {
        ...config.params,
        [paramName]: paramValue,
      }
    } else if (config.method === 'post' || config.method === 'POST') {
      // 对于 POST 请求，添加到 data 中
      if (config.data instanceof FormData) {
        config.data.append(paramName, String(paramValue))
      } else {
        config.data = {
          ...config.data,
          [paramName]: paramValue,
        }
      }
    }
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 在这里可以添加 token 等认证信息
        const token = localStorage.getItem('_token')
        if (token) {
          config.headers.Token = `${token}`
        }

        // 自动添加 country 和 merchantId 参数（排除登录接口）
        const isLoginPage = window.location.pathname.includes('/sign-in')
        const requestConfig = config as RequestConfig

        if (!isLoginPage) {
          // 添加 country 参数
          if (requestConfig.autoAddCountry !== false) {
            const countryStorage = localStorage.getItem('country-storage')
            if (countryStorage) {
              try {
                const { state } = JSON.parse(countryStorage)
                if (state?.selectedCountry?.code) {
                  this.addParamToConfig(
                    config,
                    'country',
                    state.selectedCountry.code
                  )
                }
              } catch (error) {
                console.error('解析国家信息失败:', error)
              }
            }
          }

          // 添加 merchantId 参数
          if (requestConfig.autoAddMerchantId !== false) {
            const merchantStorage = localStorage.getItem('merchant-storage')
            if (merchantStorage) {
              try {
                const { state } = JSON.parse(merchantStorage)
                if (state?.selectedMerchant?.appid) {
                  this.addParamToConfig(
                    config,
                    'merchantId',
                    state.selectedMerchant.appid
                  )
                }
              } catch (error) {
                console.log('error', error)
              }
            }
          }
        }

        // 显示加载提示
        if ((config as RequestConfig).showLoading) {
          // 这里可以添加加载状态管理
          // console.log('请求开始...')
        }

        return config
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('response=========', response)
        // 隐藏加载提示
        if ((response.config as RequestConfig).showLoading) {
          // console.log('请求结束')
        }
        if (response.data.code == 201) {
          message.error(response.data.message)
        }
        if (response.data.code == 401) {
          useAuthStore.getState().logout()
        }
        if(response.status == 403) {
          window.location.reload()
        }
        return response
        // return {...response,data:response.data.result}
      },
      (error: any) => {
        // 隐藏加载提示
        if (error.config?.showLoading) {
          // console.log('请求结束')
        }

        // 错误处理
        this.handleError(error, error.config)
        return Promise.reject(error)
      }
    )
  }

  // 错误处理
  private handleError(error: any, config?: RequestConfig): void {
    if (!config?.showError) return

    let msg = '请求失败'

    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 400:
          msg = '请求参数错误'
          break
        case 401:
          msg = '未授权，请重新登录'
          // 可以在这里跳转到登录页
          break
        case 403:
          msg = '拒绝访问'
          break
        case 404:
          msg = '请求地址不存在'
          break
        case 500:
          msg = '服务器内部错误'
          break
        default:
          msg =
            error.response.data?.message || `连接错误${error.response.status}`
      }
    } else if (error.request) {
      // 请求未收到响应
      msg = '网络连接异常，请检查网络'
    } else {
      // 其他错误
      msg = error.message
    }
    message.error(msg)
  }

  // 通用请求方法
  public async request<T = any>(
    config: RequestConfig
  ): Promise<ResponseData<T>> {
    const response = await this.instance.request<ResponseData<T>>(config)
    return response.data
  }

  // GET 请求
  public async get<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig
  ): Promise<ResponseData<T>> {
    // 如果是 blob 响应类型，直接返回 blob
    if (config?.responseType === 'blob') {
      const response = await this.instance.request({
        method: 'GET',
        url,
        params,
        ...config,
      })
      return response.data as unknown as ResponseData<T>
    }

    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    })
  }

  // POST 请求
  public async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ResponseData<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    })
  }

  // PUT 请求
  public async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ResponseData<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    })
  }

  // DELETE 请求
  public async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ResponseData<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    })
  }
}

// 创建默认实例
const http = new Request()

// 导出默认实例和类
export default http
export { Request }
