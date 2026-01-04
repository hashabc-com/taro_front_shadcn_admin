import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { hasRoutePermission, getFirstAuthorizedRoute } from '@/utils/permission'

// 定义不需要权限检查的白名单路由
const whitelistRoutes = [
  '/settings/appearance',
  '/settings/account',
  // 可以添加其他不需要权限检查的路由
]

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    // 检查是否已登录
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('_token') : null
    const permissionsStr = typeof localStorage !== 'undefined' ? localStorage.getItem('_permissions') : null
    
    if (!token) {
      // 构建完整的重定向路径（包括查询参数）
      const searchParams = location.search as Record<string, string>
      const searchString = new URLSearchParams(searchParams).toString()
      const redirectPath = location.pathname + (searchString ? `?${searchString}` : '')
      
      // 未登录，重定向到登录页，并保存当前路径用于登录后跳转
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: redirectPath,
        },
      })
    }

    // 已登录，检查权限
    const permissions = permissionsStr ? JSON.parse(permissionsStr) : null
    const currentPath = location.pathname

    // 检查是否在白名单中
    const isWhitelisted = whitelistRoutes.some(route => currentPath.startsWith(route))
    
    // 如果不在白名单中，需要检查权限
    if (!isWhitelisted) {
      const hasPermission = hasRoutePermission(currentPath, permissions)
      
      if (!hasPermission) {
        console.warn(`无权限访问: ${currentPath}，重定向到有权限的第一个页面`)
        
        // 用户没有权限访问当前路由
        // 获取第一个有权限的路由
        const firstAuthorizedRoute = getFirstAuthorizedRoute(permissions)
        
        if (firstAuthorizedRoute) {
          // 重定向到第一个有权限的路由
          throw redirect({
            to: firstAuthorizedRoute,
          })
        } else {
          // 没有任何有权限的路由，重定向到默认白名单路由
          throw redirect({
            to: '/settings/appearance',
          })
        }
      }
    }
  },
  component: AuthenticatedLayout,
})
