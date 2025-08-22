"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: 'en' | 'sw') => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{t('language.current')}</span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleLanguageChange('en')}
            className={cn(
              "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors",
              language === 'en' && "bg-primary/10 text-primary font-medium"
            )}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇺🇸</span>
              <span>English</span>
            </div>
          </button>
          <button
            onClick={() => handleLanguageChange('sw')}
            className={cn(
              "w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors",
              language === 'sw' && "bg-primary/10 text-primary font-medium"
            )}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇹🇿</span>
              <span>Kiswahili</span>
            </div>
          </button>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
