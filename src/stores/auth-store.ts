import { create } from 'zustand'
import { useCountryStore,useMerchantStore } from './index'
import { router } from '@/main'
import * as Sentry from "@sentry/react";

type IUserInfo = {
  id: number
  name: string
}

type IMenuItem = {
  name: string
  url: string
}

type IPermissions = {
  menu: IMenuItem[]
  user: {
    roleId: number
    account: string
  }
}

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  userInfo: IUserInfo | null
  permissions: IPermissions | null
  login: (token: string,userInfo: IUserInfo) => void
  logout: () => void
  setPermissions: (permissions: IPermissions) => void
  hasPermission: (url: string) => boolean
}

const initialToken = typeof localStorage !== 'undefined' ? localStorage.getItem('_token') : null
const initialUserInfo = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('_userInfo') || 'null') : null
const initialPermissions = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('_permissions') || 'null') : null

export const useAuthStore = create<AuthState>((set, get) => ({
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  userInfo: initialUserInfo,
  permissions: initialPermissions,
  login: (token: string,userInfo: IUserInfo) => {
    localStorage.setItem('_token', token)
    localStorage.setItem('_userInfo', JSON.stringify(userInfo))
    set({ token, isAuthenticated: true,userInfo })
    Sentry.setUser({id:userInfo.id,username:userInfo.name})
  },
  logout: () => {
    const redirect = `${router.history.location.href}`;
    if(redirect.startsWith('/sign-in')) return;
    // 清除当前 store 状态
    localStorage.removeItem('_token')
    localStorage.removeItem('_userInfo')
    localStorage.removeItem('_permissions')
    set({ token: null, isAuthenticated: false,userInfo: null, permissions: null })
    Sentry.setUser(null);
    // 重置其他 store
    useCountryStore.getState().clearSelectedCountry()
    useMerchantStore.getState().clearSelectedMerchant()

    // 跳转到登录页
    router.navigate({ to: '/sign-in', search: { redirect } })
  },
  setPermissions: (permissions: IPermissions) => {
    localStorage.setItem('_permissions', JSON.stringify(permissions))
    set({ permissions })
  },
  hasPermission: (url: string) => {
    const { permissions } = get()
    if (!permissions || !permissions.menu) return false
    
    // /settings/ 路径下的页面不参与鉴权，所有人都能访问
    if (url.startsWith('/settings/')) return true
    
    // 检查是否在权限列表中
    return permissions.menu.some(item => item.url === url)
  }
}))
