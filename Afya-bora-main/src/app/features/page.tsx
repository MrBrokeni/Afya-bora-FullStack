"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowLeft, Brain, Apple, Target, Users, Zap, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/ui/language-switcher';

const FeaturesPage = () => {
  const { t, isSwahili } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('features.ai.title'),
      description: t('features.ai.description'),
      benefits: isSwahili 
        ? ["Uchambuzi wa haraka", "Usahihi wa juu", "Uelewa wa dawa"]
        : ["Fast analysis", "High accuracy", "Prescription understanding"]
    },
    {
      icon: Apple,
      title: t('features.nutrition.title'),
      description: t('features.nutrition.description'),
      benefits: isSwahili
        ? ["Mipango ya kibinafsi", "Orodha ya ununuzi", "Mapendekezo ya chakula"]
        : ["Personalized plans", "Shopping lists", "Food recommendations"]
    },
    {
      icon: Target,
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      benefits: isSwahili
        ? ["Ufuatiliaji wa uzito", "Sukari ya damu", "Shinikizo la damu"]
        : ["Weight tracking", "Blood sugar", "Blood pressure"]
    },
    {
      icon: Users,
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description'),
      benefits: isSwahili
        ? ["Wauzaji wa kienyeji", "Uwasilishaji wa haraka", "Bei nafuu"]
        : ["Local vendors", "Fast delivery", "Affordable prices"]
    },
    {
      icon: Zap,
      title: t('features.fitness.title'),
      description: t('features.fitness.description'),
      benefits: isSwahili
        ? ["Mapendekezo ya gym", "Mazoezi ya kibinafsi", "Ufuatiliaji wa malengo"]
        : ["Gym recommendations", "Personal workouts", "Goal tracking"]
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
      benefits: isSwahili
        ? ["Usalama wa data", "Faragha kamili", "Ufahamu wa matumizi"]
        : ["Data security", "Complete privacy", "Usage transparency"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-green-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary transition-transform hover:scale-110" />
              <span className="text-xl font-bold text-primary">Afya Bora</span>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link href="/landing">
                <Button variant="outline" className="transition-all duration-200 hover:scale-105">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {isSwahili ? "Rudi Nyumbani" : "Back Home"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-in slide-in-from-top-4 duration-700">
              {t('features.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-top-4 duration-700 delay-200">
              {t('features.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {isSwahili ? "Tayari Kuanza?" : "Ready to Start?"}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {isSwahili 
              ? "Jiunge na Afya Bora na uanze safari yako ya afya bora"
              : "Join Afya Bora and start your journey to better health"
            }
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 transition-all duration-200 hover:scale-105">
              {isSwahili ? "Anza Leo" : "Get Started Today"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
