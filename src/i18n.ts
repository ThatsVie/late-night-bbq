import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en  from '../public/locales/en/translation.json'
import es from '../public/locales/es/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // disable cache and detection on server to avoid mismatch
      order: ['navigator'],
      caches: [],
    },

   resources: {
    en: {
      translation: en,
    },
     es: {
      tranlation: es,
    }
   }

  })

export default i18n
