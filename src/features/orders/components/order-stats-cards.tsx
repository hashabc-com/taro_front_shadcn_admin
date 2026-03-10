import { useMemo } from 'react'
import { CheckCircle, Hash, Percent } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/language-provider'

export type OrderStats = {
  totalOrders: number
  successOrders: number
  successRate: string
}

type OrderStatsCardsProps = {
  stats: OrderStats
  isLoading?: boolean
}

type StatCardProps = {
  label: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  iconBg: string
  borderColor: string
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  borderColor,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-card flex items-center gap-3 rounded-lg border-l-[3px] px-3.5 py-2.5 shadow-sm',
        borderColor
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          iconBg
        )}
      >
        {icon}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-muted-foreground text-[11px] font-medium uppercase tracking-wider'>
          {label}
        </p>
        <p className='text-foreground text-lg font-bold leading-tight'>
          {value}
        </p>
      </div>
    </div>
  )
}

export function OrderStatsCards({ stats, isLoading }: OrderStatsCardsProps) {
  const { t } = useLanguage()

  const cards = useMemo(
    () => [
      {
        label: t('orders.stats.totalOrders'),
        value: isLoading ? '-' : stats.totalOrders.toLocaleString(),
        icon: <Hash className='h-4 w-4 text-blue-600' />,
        iconBg: 'bg-blue-100 dark:bg-blue-950',
        borderColor: 'border-l-blue-500',
      },
      {
        label: t('orders.stats.successOrders'),
        value: isLoading ? '-' : stats.successOrders.toLocaleString(),
        icon: <CheckCircle className='h-4 w-4 text-green-600' />,
        iconBg: 'bg-green-100 dark:bg-green-950',
        borderColor: 'border-l-green-500',
      },
      {
        label: t('orders.stats.successRate'),
        value: isLoading ? '-' : `${stats.successRate}%`,
        // subtitle: isLoading
        //   ? undefined
        //   : `${stats.successOrders} / ${stats.totalOrders}`,
        icon: <Percent className='h-4 w-4 text-amber-600' />,
        iconBg: 'bg-amber-100 dark:bg-amber-950',
        borderColor: 'border-l-amber-500',
      },
    ],
    [t, stats, isLoading]
  )

  return (
    <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}
