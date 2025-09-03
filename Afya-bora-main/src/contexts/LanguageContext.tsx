"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isSwahili: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.testimonials': 'Testimonials',
    'nav.about': 'About',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    
    // Hero Section
    'hero.badge': 'Trusted by 10,000+ users across Tanzania',
    'hero.title': 'Your Personal',
    'hero.subtitle': 'Health Companion',
    'hero.description': 'Transform your health journey with AI-powered prescription analysis, personalized nutrition plans, and comprehensive health tracking. Designed specifically for the Tanzanian healthcare landscape.',
    'hero.cta': 'Start Your Health Journey',
    'hero.demo': 'Watch Demo',
    
    // Stats
    'stats.users': 'Active Users',
    'stats.satisfaction': 'Satisfaction Rate',
    'stats.vendors': 'Local Vendors',
    'stats.support': 'AI Support',
    
    // Features
    'features.title': 'Everything You Need for Better Health',
    'features.subtitle': 'From prescription analysis to meal planning, we\'ve got every aspect of your health journey covered.',
    'features.ai.title': 'AI-Powered Prescription Analysis',
    'features.ai.description': 'Our advanced AI extracts and understands your medical prescriptions to create personalized diet plans.',
    'features.nutrition.title': 'Personalized Nutrition Plans',
    'features.nutrition.description': 'Get 7-day meal plans tailored to your health conditions, allergies, and preferences.',
    'features.tracking.title': 'Health Tracking & Analytics',
    'features.tracking.description': 'Monitor your weight, blood sugar, and blood pressure with interactive charts and insights.',
    'features.marketplace.title': 'Local Marketplace Integration',
    'features.marketplace.description': 'Connect with local vendors for fresh, healthy ingredients and meal delivery.',
    'features.fitness.title': 'Fitness & Workout Plans',
    'features.fitness.description': 'Access gym recommendations and personalized workout routines for your fitness goals.',
    'features.security.title': 'Secure & Private',
    'features.security.description': 'Your health data is encrypted and protected with enterprise-grade security.',
    
    // How It Works
    'how.title': 'How Afya Bora Works',
    'how.subtitle': 'Get started in just 3 simple steps',
    'how.step1.title': 'Upload Your Prescription',
    'how.step1.description': 'Take a photo or upload your doctor\'s prescription. Our AI will extract and analyze the medical information.',
    'how.step2.title': 'Get Personalized Plan',
    'how.step2.description': 'Receive a customized 7-day meal plan, shopping list, and fitness recommendations based on your health profile.',
    'how.step3.title': 'Track & Improve',
    'how.step3.description': 'Monitor your progress with health tracking tools and get insights to improve your overall wellness.',
    
    // Testimonials
    'testimonials.title': 'What Our Users Say',
    'testimonials.subtitle': 'Real stories from real people who transformed their health with Afya Bora',
    
    // CTA
    'cta.title': 'Ready to Transform Your Health?',
    'cta.subtitle': 'Join thousands of users who have already improved their health with Afya Bora',
    'cta.button': 'Get Started Today',
    
    // Footer
    'footer.description': 'Your personal health companion powered by AI and designed for Tanzania.',
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.copyright': '© 2025 Afya Bora. All rights reserved.',
    
    // Language Switcher
    'language.switch': 'Switch to Swahili',
    'language.current': 'English',
  },
  sw: {
    // Navigation
    'nav.features': 'Vipengele',
    'nav.testimonials': 'Shuhuda',
    'nav.about': 'Kuhusu',
    'nav.signIn': 'Ingia',
    'nav.getStarted': 'Anza',
    
    // Hero Section
    'hero.badge': 'Inaaminika na watumiaji 10,000+ kote Tanzania',
    'hero.title': 'Msaidizi Wako',
    'hero.subtitle': 'Binafsi wa Afya',
    'hero.description': 'Badilisha safari yako ya afya kwa uchambuzi wa dawa unaoendeshwa na AI, mipango ya lishe ya kibinafsi, na ufuatiliaji kamili wa afya. Imetengenezwa haswa kwa mazingira ya afya ya Tanzania.',
    'hero.cta': 'Anza Safari Yako ya Afya',
    'hero.demo': 'Tazama Onyesho',
    
    // Stats
    'stats.users': 'Watumiaji Waliohai',
    'stats.satisfaction': 'Kiwango cha Kuridhika',
    'stats.vendors': 'Wauzaji wa Kienyeji',
    'stats.support': 'Msaada wa AI',
    
    // Features
    'features.title': 'Kila Kitu Unachohitaji kwa Afya Bora',
    'features.subtitle': 'Kutoka uchambuzi wa dawa hadi kupanga chakula, tunayo kila kipengele cha safari yako ya afya.',
    'features.ai.title': 'Uchambuzi wa Dawa Unaendeshwa na AI',
    'features.ai.description': 'AI yetu ya juu inatoa na kuelewa dawa zako za matibabu kuunda mipango ya lishe ya kibinafsi.',
    'features.nutrition.title': 'Mipango ya Lishe ya Kibinafsi',
    'features.nutrition.description': 'Pata mipango ya chakula ya siku 7 iliyotengenezwa kwa hali zako za afya, mzio, na mapendeleo.',
    'features.tracking.title': 'Ufuatiliaji wa Afya na Uchambuzi',
    'features.tracking.description': 'Fuatilia uzito wako, sukari ya damu, na shinikizo la damu na chati za kujumuishwa na ufahamu.',
    'features.marketplace.title': 'Muunganisho wa Soko la Kienyeji',
    'features.marketplace.description': 'Unganisha na wauzaji wa kienyeji kwa vifaa safi, vya afya na uwasilishaji wa chakula.',
    'features.fitness.title': 'Mipango ya Mazoezi na Ujuzi',
    'features.fitness.description': 'Pata mapendekezo ya gym na mazoezi binafsi kwa malengo yako.',
    'features.security.title': 'Salama na Faragha',
    'features.security.description': 'Taarifa zako za afya zimesimbwa na kulindwa kwa usalama wa daraja la Juu.',
    
    // How It Works
    'how.title': 'Jinsi Afya Bora Inavyofanya Kazi',
    'how.subtitle': 'Anza kwa hatua 3 tu rahisi',
    'how.step1.title': 'Pakia Dawa Yako',
    'how.step1.description': 'Piga picha au pakia dawa ya daktari wako. AI yetu itatoa na kuchambua maelezo ya matibabu.',
    'how.step2.title': 'Pata Mpango wa Kibinafsi',
    'how.step2.description': 'Pokea Ratiba yako binafsi ya chakula kwa siku 7, orodha ya ununuzi, na mapendekezo ya mazoezi kulingana na wasifu wako wa afya.',
    'how.step3.title': 'Fuatilia na Boresha',
    'how.step3.description': 'Fuatilia maendeleo yako na zana za ufuatiliaji wa afya na upate ufahamu wa kuboresha ustawi wako kwa ujumla.',
    
    // Testimonials
    'testimonials.title': 'Watumiaji Wetu Wasemaje',
    'testimonials.subtitle': 'Hadithi za kweli kutoka kwa watu wa kweli walioibadilisha afya yao na Afya Bora',
    
    // CTA
    'cta.title': 'Tayari Kubadilisha Afya Yako?',
    'cta.subtitle': 'Jiunge na watumiaji Wengi ambao tayari wameboresha afya yao na Afya Bora',
    'cta.button': 'Anza Leo',
    
    // Footer
    'footer.description': 'Msaidizi wako binafsi wa afya Anayetumia Teknolojia ya AI na kutengenezwa Nchini Tanzania.',
    'footer.product': 'Bidhaa',
    'footer.company': 'Kampuni',
    'footer.support': 'Msaada',
    'footer.copyright': '© 2025 Afya Bora. Haki zote zimehifadhiwa.',
    
    // Language Switcher
    'language.switch': 'Badilisha kwa Kiingereza',
    'language.current': 'Kiswahili',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('afyaBoraLanguage') as Language;
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'sw')) {
      setLanguageState(savedLanguage);
    } else {
      // Detect location and set language accordingly
      detectLocationAndSetLanguage();
    }
    
    setIsLoaded(true);
  }, []);

  const detectLocationAndSetLanguage = async () => {
    try {
      // Try to get location from IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code === 'TZ') {
        setLanguageState('sw');
        localStorage.setItem('afyaBoraLanguage', 'sw');
      } else {
        setLanguageState('en');
        localStorage.setItem('afyaBoraLanguage', 'en');
      }
    } catch (error) {
      // Fallback to English if location detection fails
      console.log('Location detection failed, defaulting to English');
      setLanguageState('en');
      localStorage.setItem('afyaBoraLanguage', 'en');
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('afyaBoraLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isSwahili: language === 'sw',
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
