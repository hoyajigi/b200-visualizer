import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale, UiStrings } from './types'
import { ko } from './ko'
import { en } from './en'

const STRINGS: Record<Locale, UiStrings> = { ko, en }

interface I18nContextValue {
  readonly locale: Locale
  readonly t: UiStrings
  readonly setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'ko',
  t: ko,
  setLocale: () => {},
})

export function I18nProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale')
      if (saved === 'en' || saved === 'ko') return saved
      return navigator.language.startsWith('ko') ? 'ko' : 'en'
    }
    return 'ko'
  })

  const handleSetLocale = (l: Locale) => {
    setLocale(l)
    localStorage.setItem('locale', l)
  }

  return (
    <I18nContext.Provider value={{ locale, t: STRINGS[locale], setLocale: handleSetLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
