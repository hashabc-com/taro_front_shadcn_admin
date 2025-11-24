import {
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'

// 交易状态
export const statuses = [
  {
    label: '成功',
    value: '0' as const,
    icon: CheckCircle,
  },
  {
    label: '待处理',
    value: '1' as const,
    icon: Clock,
  },
  {
    label: '失败',
    value: '2' as const,
    icon: XCircle,
  },
]
