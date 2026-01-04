/**
 * 权限检查工具函数
 */

type IMenuItem = {
  name: string
  url: string
}

type IPermissions = {
  menu: IMenuItem[]
  user?: {
    roleId: number
    account: string
  }
}

/**
 * 检查用户是否有访问指定路由的权限
 * @param route 要检查的路由路径
 * @param permissions 用户的权限信息
 * @returns 是否有权限访问
 */
export function hasRoutePermission(
  route: string,
  permissions?: IPermissions | null
): boolean {
  // 如果没有权限信息，默认没有权限
  if (!permissions || !permissions.menu || permissions.menu.length === 0) {
    return false
  }

  // 标准化路由（移除末尾的斜杠，但保留根路径 '/'）
  const normalizedRoute = route === '/' ? '/' : route.replace(/\/$/, '')

  // 检查是否有匹配的菜单项
  const hasPermission = permissions.menu.some((menuItem) => {
    // 标准化菜单 URL
    const normalizedMenuUrl = menuItem.url === '/' ? '/' : menuItem.url.replace(/\/$/, '')

    // 1. 完全匹配
    if (normalizedMenuUrl === normalizedRoute) {
      return true
    }

    // 2. 前缀匹配（父级权限）
    // 例如：拥有 "/order" 权限，可以访问 "/orders/receive-lists"
    // 或者：拥有 "/merchant" 权限，可以访问 "/merchant/info-lists"
    if (normalizedRoute.startsWith(normalizedMenuUrl + '/') || 
        normalizedRoute.startsWith(normalizedMenuUrl.replace(/s$/, '') + 's/')) {
      return true
    }

    return false
  })

  return hasPermission
}

/**
 * 获取第一个有权限的路由
 * @param permissions 用户的权限信息
 * @returns 第一个有权限的路由路径，如果没有则返回 null
 */
export function getFirstAuthorizedRoute(
  permissions?: IPermissions | null
): string | null {
  if (!permissions || !permissions.menu || permissions.menu.length === 0) {
    return null
  }

  // 优先返回首页
  const homePage = permissions.menu.find(item => item.url === '/')
  if (homePage) {
    return '/'
  }

  // 过滤掉可能是父级分组的路由（通常是单层路径如 /order, /merchant）
  // 优先返回有子路径的页面（包含多个 / 的路径）
  const childRoutes = permissions.menu.filter(item => {
    const url = item.url === '/' ? '/' : item.url.replace(/\/$/, '')
    // 排除根路径，找包含至少两个 / 的路径（子页面）
    return url !== '/' && url.split('/').length > 2
  })

  if (childRoutes.length > 0) {
    return childRoutes[0].url
  }

  // 如果没有子路由，返回第一个非根路径的菜单项
  const nonRootRoute = permissions.menu.find(item => item.url !== '/')
  if (nonRootRoute) {
    return nonRootRoute.url
  }

  // 最后返回第一个菜单项
  return permissions.menu[0]?.url || null
}

/**
 * 获取所有有权限的路由列表
 * @param permissions 用户的权限信息
 * @returns 所有有权限的路由路径数组
 */
export function getAllAuthorizedRoutes(
  permissions?: IPermissions | null
): string[] {
  if (!permissions || !permissions.menu || permissions.menu.length === 0) {
    return []
  }

  return permissions.menu.map((menuItem) => menuItem.url)
}
