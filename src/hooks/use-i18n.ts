import { useLanguage } from '@/context/language-provider'

/**
 * useI18n hook - alias for useLanguage
 * Provides internationalization translation function
 */
export function useI18n() {
  return useLanguage()
}
