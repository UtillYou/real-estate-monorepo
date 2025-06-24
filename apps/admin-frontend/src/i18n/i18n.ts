import i18n, { InitOptions, TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

// The translations
const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
} as const;

// Type for the translation resources
type Resources = typeof resources;
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resources['en'];
    returnNull: false;
  }
}

// Configure i18next
const i18nConfig: InitOptions = {
  resources,
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },
  react: {
    useSuspense: true,
    bindI18n: 'languageChanged',
    bindI18nStore: '',
  },
  saveMissing: true,
  saveMissingTo: 'all',
  missingKeyHandler: (lngs: readonly string[], ns: string, key: string) => {
    console.warn(`Missing translation: ${key} for language ${lngs.join(', ')}`);
  },
};

// Initialize i18n
const initI18n = async () => {
  try {
    console.log('Initializing i18n...');
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init(i18nConfig);
    
    console.log('i18n initialized with language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    
    // Log when language changes
    i18n.on('languageChanged', (lng) => {
      console.log('Language changed to:', lng);
      console.log('Current resources:', i18n.getResourceBundle(lng, 'translation'));
    });
    
  } catch (err) {
    console.error('Failed to initialize i18n:', err);
  }
};

// Initialize i18n
initI18n();

export default i18n;
