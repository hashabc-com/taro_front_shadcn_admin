import { useQuery } from '@tanstack/react-query'
import { getCountryList } from '@/api/common'

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountryList,
    staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    gcTime: 30 * 60 * 1000, // 30分钟 - 长期保留缓存
    // refetchOnMount: false, // 组件挂载时不重新请求（如果缓存存在）
    // refetchOnWindowFocus: false, // 窗口聚焦时不重新请求
  })
}