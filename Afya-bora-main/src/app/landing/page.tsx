"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Brain, 
  Apple, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Smartphone,
  Globe,
  Award,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/ui/language-switcher';

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { t, isSwahili } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('features.ai.title'),
      description: t('features.ai.description')
    },
    {
      icon: Apple,
      title: t('features.nutrition.title'),
      description: t('features.nutrition.description')
    },
    {
      icon: Target,
      title: t('features.tracking.title'),
      description: t('features.tracking.description')
    },
    {
      icon: Users,
      title: t('features.marketplace.title'),
      description: t('features.marketplace.description')
    },
    {
      icon: Zap,
      title: t('features.fitness.title'),
      description: t('features.fitness.description')
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description')
    }
  ];

  const testimonials = [
    {
      name: isSwahili ? "Anna Maro" : "Anna Maro",
      role: isSwahili ? "Mgonjwa wa Kisukari" : "Diabetes Patient",
      content: isSwahili 
        ? "Afya Bora ilibadilisha safari yangu ya afya. AI ilielewa dawa yangu kikamilifu na kuunda mpango wa lishe ambao unafanya kazi kwangu."
        : "Afya Bora transformed my health journey. The AI understood my prescription perfectly and created a diet plan that actually works for me.",
      rating: 5
    },
    {
      name: isSwahili ? "Denzel Trainer" : "Denzel Trainer",
      role: isSwahili ? "Mpenzi wa Mazoezi" : "Fitness Enthusiast",
      content: isSwahili
        ? "Muunganisho wa lishe na ufuatiliaji wa mazoezi ni wa kushangaza. Sijawahi kujisikia vizuri zaidi!"
        : "The combination of nutrition and fitness tracking is incredible. I've never felt better!",
      rating: 5
    },
    {
      name: isSwahili ? "Dk. Amina H." : "Dr. Amina H.",
      role: isSwahili ? "Mtoa Huduma ya Afya" : "Healthcare Provider",
      content: isSwahili
        ? "Ninapendekeza Afya Bora kwa wagonjwa wangu. Ni mabadiliko ya mchezo kwa afya ya kibinafsi nchini Tanzania."
        : "I recommend Afya Bora to my patients. It's a game-changer for personalized healthcare in Tanzania.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: t('stats.users') },
    { number: "95%", label: t('stats.satisfaction') },
    { number: "50+", label: t('stats.vendors') },
    { number: "24/7", label: t('stats.support') }
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
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8 animate-in slide-in-from-top-4 duration-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('hero.badge')}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-in slide-in-from-top-4 duration-700 delay-200">
              {t('hero.title')}
              <span className="text-primary block animate-in slide-in-from-top-4 duration-700 delay-300">
                {t('hero.subtitle')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-top-4 duration-700 delay-400">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-in slide-in-from-top-4 duration-700 delay-500">
              <Link href="/auth">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {t('hero.cta')}
                  <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 transition-all duration-200 hover:scale-105">
                <Smartphone className="mr-2 h-5 w-5" />
                {t('hero.demo')}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-in slide-in-from-top-4 duration-700 delay-600">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-105 transition-transform duration-200">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('how.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('how.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('how.step1.title')}</h3>
              <p className="text-gray-600">{t('how.step1.description')}</p>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('how.step2.title')}</h3>
              <p className="text-gray-600">{t('how.step2.description')}</p>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('how.step3.title')}</h3>
              <p className="text-gray-600">{t('how.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('testimonials.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {t('cta.subtitle')}
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 transition-all duration-200 hover:scale-105">
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Afya Bora</span>
              </div>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">{t('nav.features')}</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
