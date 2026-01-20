import { createContext, useContext, useMemo, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { translations } from '@/lib/i18n'

type Language = 'zh' | 'en'

const DEFAULT_LANG: Language = 'zh'
const LANG_COOKIE_NAME = 'lang'
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

type LanguageContextType = {
  lang: Language
  setLang: (lang: Language) => void
  resetLang: () => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, _setLang] = useState<Language>(() => {
    // 1. 优先使用 cookie 中保存的语言设置
    const cookieLang = getCookie(LANG_COOKIE_NAME) as Language
    if (cookieLang) return cookieLang

    // 2. 检测浏览器语言
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('en')) return 'en'
    if (browserLang.startsWith('zh')) return 'zh'

    // 3. 默认语言
    return DEFAULT_LANG
  })

  const setLang = (l: Language) => {
    _setLang(l)
    setCookie(LANG_COOKIE_NAME, l, LANG_COOKIE_MAX_AGE)
  }

  const resetLang = () => {
    _setLang(DEFAULT_LANG)
    removeCookie(LANG_COOKIE_NAME)
  }

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const table = translations[lang] || {}
      const value = key.split('.').reduce(
        (acc: unknown, cur) => {
          if (acc && typeof acc === 'object' && cur in acc) {
            return (acc as Record<string, unknown>)[cur]
          }
          return undefined
        },
        table as Record<string, unknown>
      )
      return typeof value === 'string' ? value : (fallback ?? key)
    }
  }, [lang])

  return (
    <LanguageContext value={{ lang, setLang, resetLang, t }}>
      {children}
    </LanguageContext>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx)
    throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
