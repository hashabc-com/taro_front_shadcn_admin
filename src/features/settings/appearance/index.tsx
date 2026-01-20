import { useLanguage } from '@/context/language-provider'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  const { t } = useLanguage()

  return (
    <ContentSection
      title={t('settings.appearance.title')}
      desc={t('settings.appearance.subtitle')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
