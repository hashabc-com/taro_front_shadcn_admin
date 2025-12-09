import { create } from 'zustand'
import { useCountryStore,useMerchantStore } from './index'
// import { router } from '@/main'

type IUserInfo = {
  id: number
  name: string
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  userInfo: IUserInfo | null
  login: (token: string,userInfo: IUserInfo) => void
  logout: () => void
}

const initialToken = typeof localStorage !== 'undefined' ? localStorage.getItem('_token') : null
const initialUserInfo = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('_userInfo') || 'null') : null

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  userInfo: initialUserInfo,
  login: (token: string,userInfo: IUserInfo) => {
    localStorage.setItem('_token', token)
    localStorage.setItem('_userInfo', JSON.stringify(userInfo))
    set({ token, isAuthenticated: true,userInfo })
  },
  logout: () => {
    // 清除当前 store 状态
    localStorage.removeItem('_token')
    localStorage.removeItem('_userInfo')
    set({ token: null, isAuthenticated: false,userInfo: null })
    
    // 重置其他 store
    useCountryStore.getState().clearSelectedCountry()
    useMerchantStore.getState().clearSelectedMerchant()

    // 跳转到登录页
    // router.navigate({ to: '/login' })
  },
}))
