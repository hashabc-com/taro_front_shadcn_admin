import { useAuthStore } from '@/stores'

/**
 * 权限检查 Hook
 * 用于检查当前用户是否有访问某个路由的权限
 */
export function usePermission() {
  const { hasPermission, permissions } = useAuthStore()

  /**
   * 检查是否有权限访问指定URL
   * @param url 要检查的路由URL
   * @returns 是否有权限
   */
  const checkPermission = (url: string): boolean => {
    return hasPermission(url)
  }

  /**
   * 获取所有允许的路由
   * @returns 允许访问的路由列表
   */
  const getAllowedRoutes = (): string[] => {
    if (!permissions || !permissions.menu) return ['/']
    return permissions.menu.map(item => item.url)
  }

  return {
    checkPermission,
    getAllowedRoutes,
    hasAnyPermission: !!permissions,
  }
}
