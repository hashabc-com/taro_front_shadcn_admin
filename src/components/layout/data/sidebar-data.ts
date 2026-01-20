import { useAuthStore } from '@/stores'
import {
  LayoutDashboard,
  HelpCircle,
  Settings,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  ClipboardList,
  Calculator,
  Briefcase,
  FileText,
  Download,
  MonitorCog,
  Send,
} from 'lucide-react'
import { getTranslation, type Language } from '@/lib/i18n'
import { type SidebarData, type NavItem } from '../types'

// 过滤菜单项，根据权限
const filterMenuItems = (
  items: NavItem[],
  hasPermission: (url: string) => boolean
): NavItem[] => {
  return items
    .map((item) => {
      // 如果有子菜单，递归过滤
      if (item.items && item.items.length > 0) {
        const filteredSubItems = filterMenuItems(
          item.items as NavItem[],
          hasPermission
        )
        // 只有当有可见的子菜单时才保留父菜单
        if (filteredSubItems.length > 0) {
          return { ...item, items: filteredSubItems }
        }
        return null
      }

      // 如果有URL，检查权限
      if (item.url) {
        return hasPermission(item.url) ? item : null
      }

      // 没有URL的项目（如系统设置）保留
      return item
    })
    .filter((item): item is NavItem => item !== null)
}
export const getSidebarData = (language: Language): SidebarData => {
  const t = (key: string) => getTranslation(language, key)
  const { hasPermission } = useAuthStore.getState()

  const allNavGroups = [
    {
      title: t('sidebar.general'),
      items: [
        {
          title: t('sidebar.home'),
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: t('sidebar.orderManagement'),
          icon: ClipboardList,
          items: [
            {
              title: t('sidebar.receiveOrders'),
              url: '/orders/receive-lists',
            },
            {
              title: t('sidebar.receiveSummary'),
              url: '/orders/receive-summary-lists',
            },
            {
              title: t('sidebar.paymentOrders'),
              url: '/orders/payment-lists',
            },
            {
              title: t('sidebar.paymentSummary'),
              url: '/orders/payment-summary-lists',
            },
            {
              title: t('sidebar.collectionSuccessRate'),
              url: '/orders/collection-success-rate',
            },
          ],
        },
        {
          title: t('sidebar.fundManagement'),
          icon: Calculator,
          items: [
            {
              title: t('sidebar.settlementRecords'),
              url: '/fund/settlement-lists',
            },
            {
              title: t('sidebar.rechargeWithdraw'),
              url: '/fund/recharge-withdraw',
            },
            {
              title: t('sidebar.accountSettlement'),
              url: '/fund/account-settlement',
            },
            {
              title: t('sidebar.merchantDailySummary'),
              url: '/fund/merchant-daily-summary',
            },
            {
              title: t('sidebar.countryDailySummary'),
              url: '/fund/country-daily-summary',
            },
          ],
        },
        {
          title: t('sidebar.merchantManagement'),
          icon: Users,
          items: [
            {
              title: t('sidebar.merchantInfo'),
              url: '/merchant/info-lists',
            },
          ],
        },
        {
          title: t('sidebar.businessManagement'),
          icon: Briefcase,
          items: [
            {
              title: t('sidebar.merchantBind'),
              url: '/business/merchant-bind',
            },
            {
              title: t('sidebar.businessDailySummary'),
              url: '/business/daily-summary',
            },
            {
              title: t('sidebar.businessMonthlySummary'),
              url: '/business/monthly-summary',
            },
            {
              title: t('sidebar.consultingService'),
              url: '/business/customer-consult',
            },
          ],
        },
        {
          title: t('sidebar.configManagement'),
          icon: Settings,
          items: [
            {
              title: t('sidebar.paymentChannel'),
              url: '/config/payment-channel',
            },
            {
              title: t('sidebar.routeStrategy'),
              url: '/config/route-strategy',
            },
            {
              title: t('sidebar.riskControlRule'),
              url: '/config/risk-control-rule',
            },
          ],
        },
        {
          title: t('sidebar.logManagement'),
          icon: FileText,
          items: [
            {
              title: t('sidebar.messageRecord'),
              url: '/logs/message-record',
            },
            {
              title: t('logs.merchantRequest.title'),
              url: '/logs/merchant-request',
            },
            {
              title: t('sidebar.riskControlLog'),
              url: '/logs/risk-control',
            },
          ],
        },
        {
          title: t('sidebar.systemManagement'),
          icon: MonitorCog,
          items: [
            {
              title: t('sidebar.roleManage'),
              url: '/system/role-manage',
            },
            {
              title: t('sidebar.accountManage'),
              url: '/system/account-manage',
            },
          ],
        },
        {
          title: t('sidebar.sendAnnouncement'),
          url: '/send-announcement',
          icon: Send,
        },
        {
          title: t('sidebar.exportManagement'),
          url: '/export-management',
          icon: Download,
        },
      ],
    },
  ]

  // 根据权限过滤菜单
  const filteredNavGroups = allNavGroups
    .map((group) => {
      const filteredItems = filterMenuItems(group.items, hasPermission)
      return filteredItems.length > 0
        ? { ...group, items: filteredItems }
        : null
    })
    .filter(Boolean) as typeof allNavGroups

  // Other 分组不参与鉴权，所有用户都可见
  const otherNavGroup = {
    title: t('sidebar.other'),
    items: [
      {
        title: t('sidebar.systemSettings'),
        icon: Settings,
        items: [
          {
            title: t('common.appearance'),
            url: '/settings/appearance',
          },
        ],
      },
      {
        title: t('sidebar.apiDocs'),
        url: 'https://docs.taropay.com/',
        icon: HelpCircle,
      },
    ],
  }

  return {
    user: {
      name: 'satnaing',
      email: 'satnaingdev@gmail.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name:
          (useAuthStore.getState().userInfo?.name as string) || 'Default Team',
        logo: Command,
        plan: '',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [...filteredNavGroups, otherNavGroup],
  }
}
