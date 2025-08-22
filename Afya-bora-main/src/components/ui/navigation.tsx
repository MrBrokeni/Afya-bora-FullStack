"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/ui/language-switcher';

interface NavigationProps {
  showBackButton?: boolean;
  showAuthButtons?: boolean;
  showNavLinks?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  showBackButton = false, 
  showAuthButtons = true, 
  showNavLinks = true 
}) => {
  const { t, isSwahili } = useLanguage();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-green-100 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Always clickable to landing page */}
          <Link href="/landing" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
            <Heart className="h-8 w-8 text-primary transition-transform hover:scale-110" />
            <span className="text-xl font-bold text-primary">Afya Bora</span>
          </Link>

          {/* Navigation Links - Only show on landing page */}
          {showNavLinks && (
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors duration-200">
                {t('nav.features')}
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors duration-200">
                {t('nav.testimonials')}
              </a>
              <Link href="/about" className="text-gray-600 hover:text-primary transition-colors duration-200">
                {t('nav.about')}
              </Link>
            </div>
          )}

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            {showBackButton && (
              <Link href="/landing">
                <Button variant="outline" className="transition-all duration-200 hover:scale-105">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isSwahili ? "Rudi Nyumbani" : "Back Home"}
                </Button>
              </Link>
            )}

            {showAuthButtons && (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="hidden sm:flex transition-all duration-200 hover:scale-105">
                    {t('nav.signIn')}
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105">
                    {t('nav.getStarted')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
