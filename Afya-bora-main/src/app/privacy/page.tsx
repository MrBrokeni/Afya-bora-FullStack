"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/ui/language-switcher';

const PrivacyPage = () => {
  const { isSwahili } = useLanguage();

  const sections = [
    {
      icon: Shield,
      title: isSwahili ? "Usalama wa Data" : "Data Security",
      content: isSwahili 
        ? "Tunatumia usalama wa daraja la biashara kuhakikisha kwamba data yako ya afya iko salama. Data yako imesimbwa na inahifadhiwa kwa njia salama."
        : "We use enterprise-grade security to ensure your health data is safe. Your data is encrypted and stored securely."
    },
    {
      icon: Lock,
      title: isSwahili ? "Faragha" : "Privacy",
      content: isSwahili
        ? "Hatushiriki data yako na mtu yeyote bila idhini yako. Data yako ni yako na una udhibiti kamili juu yake."
        : "We do not share your data with anyone without your consent. Your data is yours and you have complete control over it."
    },
    {
      icon: Eye,
      title: isSwahili ? "Ufahamu wa Data" : "Data Transparency",
      content: isSwahili
        ? "Unaweza kuona data yako yote na kujua jinsi tunavyotumia. Tunatoa ripoti za uwazi kuhusu matumizi ya data."
        : "You can view all your data and know how we use it. We provide transparent reports about data usage."
    },
    {
      icon: Database,
      title: isSwahili ? "Uhifadhi wa Data" : "Data Storage",
      content: isSwahili
        ? "Data yako inahifadhiwa kwenye seva salama na inaweza kufikwa tu na wewe na timu yetu ya usalama."
        : "Your data is stored on secure servers and can only be accessed by you and our security team."
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
              {isSwahili ? "Sera ya Faragha" : "Privacy Policy"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-top-4 duration-700 delay-200">
              {isSwahili 
                ? "Faragha yako ni muhimu sana kwetu. Soma jinsi tunavyolinda data yako ya afya."
                : "Your privacy is very important to us. Read how we protect your health data."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {isSwahili ? "Una Swali?" : "Have Questions?"}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {isSwahili 
              ? "Wasiliana nasi kama una maswali kuhusu faragha au usalama wa data yako."
              : "Contact us if you have questions about your data privacy or security."
            }
          </p>
          <Link href="/contact">
            <Button size="lg" className="text-lg px-8 py-4 transition-all duration-200 hover:scale-105">
              {isSwahili ? "Wasiliana Nasi" : "Contact Us"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
