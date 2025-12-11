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
} from 'lucide-react'
import { type SidebarData } from '../types'
import { getTranslation, type Language } from '@/lib/i18n'

export const getSidebarData = (language: Language): SidebarData => {
  const t = (key: string) => getTranslation(language, key)

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
  navGroups: [
    {
      title: t('sidebar.general'),
      items: [
        {
          title: t('sidebar.home'),
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: '订单管理',
          icon: ClipboardList,
          items: [
            {
              title: '收款订单明细',
              url: '/orders/receive-lists',
            },
            {
              title: '收款汇总',
              url: '/orders/receive-summary-lists',
            },
            {
              title: '付款订单明细',
              url: '/orders/payment-lists',
            },
            {
              title: '付款汇总',
              url: '/orders/payment-summary-lists',
            },
            {
              title: '代收成功率',
              url: '/orders/collection-success-rate',
            },
          ],
        },
        {
          title: '资金管理',
          icon: Calculator,
          items: [
            {
              title: '结算记录',
              url: '/fund/settlement-lists',
            },
            {
              title: '申请审批',
              url: '/fund/recharge-withdraw',
            },
            {
              title: '账户结算',
              url: '/fund/account-settlement',
            },
            {
              title: '商户每日汇总',
              url: '/fund/merchant-daily-summary',
            },
            {
              title: '国家每日汇总',
              url: '/fund/country-daily-summary',
            },
          ],
        },
        {
          title: '商户管理',
          icon: Users,
          items: [
            {
              title: '商户信息',
              url: '/merchant/info-lists',
            },
          ],
        },
        {
          title: '商务管理',
          icon: Briefcase,
          items: [
            {
              title: '商务绑定列表',
              url: '/business/merchant-bind',
            },
            {
              title: '商务日汇总',
              url: '/business/daily-summary',
            },
            {
              title: '商务月汇总',
              url: '/business/monthly-summary',
            },
          ],
        },
        {
          title: '配置管理',
          icon: Settings,
          items: [
            {
              title: '支付渠道配置',
              url: '/config/payment-channel',
            },
            {
              title: '风控规则配置',
              url: '/config/risk-control-rule',
            },
          ],
        },
        {
          title: '日志管理',
          icon: FileText,
          items: [
            {
              title: '消息记录表',
              url: '/logs/message-record',
            },
            {
              title: '风控规则记录',
              url: '/logs/risk-control',
            },
          ],
        },
        {
          title: '系统管理',
          icon: Settings,
          items: [
            {
              title: '角色管理',
              url: '/system/role-manage',
            },
            {
              title: '账户管理',
              url: '/system/account-manage',
            },
          ],
        },
      ],
    },
    {
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
    },
  ],
}


}
