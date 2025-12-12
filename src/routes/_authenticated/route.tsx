import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    // 检查是否已登录
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('_token') : null
    
    if (!token) {
      // 未登录，重定向到登录页，并保存当前路径用于登录后跳转
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }

    // 检查权限
    const { hasPermission } = useAuthStore.getState()
    const currentPath = location.pathname
    
    // /settings/ 路径不参与鉴权，其他路径需要检查权限
    if (!currentPath.startsWith('/settings/') && !hasPermission(currentPath)) {
      console.warn(`无权限访问: ${currentPath}，重定向到有权限的第一个页面`)
      
      // 获取用户有权限的第一个页面
      const { permissions } = useAuthStore.getState()
      const firstAllowedUrl = permissions?.menu?.[0]?.url || '/settings/appearance'
      
      throw redirect({
        to: firstAllowedUrl,
      })
    }
  },
  component: AuthenticatedLayout,
})
