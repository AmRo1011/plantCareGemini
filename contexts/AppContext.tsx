
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface AppContextType {
  language: Language;
  direction: Direction;
  switchLanguage: (lang: Language) => void;
  // FIX: Updated type to allow for an optional second argument for replacements.
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

export const AppContext = createContext<AppContextType>({
  language: 'en',
  direction: 'ltr',
  switchLanguage: () => {},
  // FIX: Updated default `t` function to match the new type signature.
  t: (key: string) => key,
});

const translations = {
  en: {
    appName: 'PlantCare',
    tagline: 'AI-Powered Plant Care & Identification',
    identify: 'Identify Plant',
    chat: 'Ask Expert',
    uploadHeader: 'Upload a Plant Photo',
    uploadSubheader: 'Take or select a clear photo of your plant (leaf, flower, or full plant).',
    choosePhoto: 'Choose Photo',
    analyzing: 'Analyzing your plant...',
    tryAgain: 'Try Again',
    error: 'An error occurred. Please try again.',
    limitReachedHeader: 'Free Limit Reached',
    limitReachedSubheader: 'You have used your 3 free identifications. Please register for unlimited access.',
    resultHeader: 'Identification Result',
    commonName: 'Common Name',
    scientificName: 'Scientific Name',
    confidence: 'Confidence',
    careGuide: 'Basic Care Guide',
    watering: 'Watering',
    sunlight: 'Sunlight',
    soil: 'Soil',
    askAboutThisPlant: 'Ask an Expert about this Plant',
    chatHeader: 'PlantCare Assistant',
    chatSubheader: 'Your AI plant expert',
    chatPlaceholder: 'Ask about watering, pests, or anything else...',
    chatInitial: 'Hello! How can I help you with your plant today?',
    chatWithContext: 'Hello! Ask me anything about your {plantName}.',
    footerText: '© 2025 PlantCare. All rights reserved.',
    selectLanguage: 'Language',
  },
  ar: {
    appName: 'عناية النبات',
    tagline: 'العناية بالنباتات والتعرف عليها بالذكاء الاصطناعي',
    identify: 'تحديد النبات',
    chat: 'اسأل خبير',
    uploadHeader: 'تحميل صورة نبات',
    uploadSubheader: 'التقط أو اختر صورة واضحة لنباتك (ورقة، زهرة، أو النبتة كاملة).',
    choosePhoto: 'اختر صورة',
    analyzing: 'جاري تحليل نبتتك...',
    tryAgain: 'حاول مرة أخرى',
    error: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
    limitReachedHeader: 'لقد وصلت إلى الحد المجاني',
    limitReachedSubheader: 'لقد استخدمت محاولاتك الثلاث المجانية للتعرف على النباتات. يرجى التسجيل للحصول على وصول غير محدود.',
    resultHeader: 'نتيجة التعريف',
    commonName: 'الاسم الشائع',
    scientificName: 'الاسم العلمي',
    confidence: 'نسبة الثقة',
    careGuide: 'دليل العناية الأساسي',
    watering: 'الري',
    sunlight: 'ضوء الشمس',
    soil: 'التربة',
    askAboutThisPlant: 'اسأل خبيرًا عن هذا النبات',
    chatHeader: 'مساعد عناية النبات',
    chatSubheader: 'خبير نباتاتك الذكي',
    chatPlaceholder: 'اسأل عن الري، الآفات، أو أي شيء آخر...',
    chatInitial: 'مرحباً! كيف يمكنني مساعدتك بخصوص نبتتك اليوم؟',
    chatWithContext: 'مرحباً! اسألني أي شيء عن {plantName} الخاصة بك.',
    footerText: '© 2025 عناية النبات. جميع الحقوق محفوظة.',
    selectLanguage: 'اللغة',
  },
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  const switchLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string }) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{${rKey}}`, replacements[rKey]);
      });
    }
    return translation;
  }, [language]);
  

  return (
    <AppContext.Provider value={{ language, direction, switchLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};
