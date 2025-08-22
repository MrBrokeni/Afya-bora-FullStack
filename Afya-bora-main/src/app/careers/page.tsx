"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Users, Zap, Target, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/ui/language-switcher';

const CareersPage = () => {
  const { isSwahili } = useLanguage();

  const positions = [
    {
      title: isSwahili ? "Mtaalamu wa AI" : "AI Engineer",
      department: isSwahili ? "Teknolojia" : "Technology",
      location: isSwahili ? "Dar es Salaam" : "Dar es Salaam",
      type: isSwahili ? "Muda Kamili" : "Full-time",
      description: isSwahili
        ? "Tunatafuta mtaalamu wa AI mwenye uzoefu wa kusaidia kuunda na kuboresha teknolojia yetu ya uchambuzi wa dawa."
        : "We're looking for an experienced AI engineer to help build and improve our prescription analysis technology."
    },
    {
      title: isSwahili ? "Mtaalamu wa Afya" : "Health Specialist",
      department: isSwahili ? "Matibabu" : "Medical",
      location: isSwahili ? "Dar es Salaam" : "Dar es Salaam",
      type: isSwahili ? "Muda Kamili" : "Full-time",
      description: isSwahili
        ? "Tunatafuta mtaalamu wa afya mwenye uzoefu wa lishe na matibabu kusaidia kuunda mipango ya lishe ya kibinafsi."
        : "We're looking for a health specialist with experience in nutrition and medicine to help create personalized nutrition plans."
    },
    {
      title: isSwahili ? "Mtaalamu wa Biashara" : "Business Development",
      department: isSwahili ? "Biashara" : "Business",
      location: isSwahili ? "Dar es Salaam" : "Dar es Salaam",
      type: isSwahili ? "Muda Kamili" : "Full-time",
      description: isSwahili
        ? "Tunatafuta mtaalamu wa biashara kusaidia kuunda uhusiano na wauzaji wa kienyeji na kupanua biashara yetu."
        : "We're looking for a business development specialist to help build relationships with local vendors and expand our business."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: isSwahili ? "Timu ya Kujifurahisha" : "Great Team",
      description: isSwahili
        ? "Fanya kazi na timu ya watu wenye uzoefu na wenye nia ya kubadilisha afya nchini Tanzania."
        : "Work with a team of experienced people passionate about transforming healthcare in Tanzania."
    },
    {
      icon: Zap,
      title: isSwahili ? "Uzoefu wa Teknolojia" : "Tech Experience",
      description: isSwahili
        ? "Pata uzoefu wa teknolojia ya juu ya AI na programu za afya za kisasa."
        : "Gain experience with cutting-edge AI technology and modern healthcare software."
    },
    {
      icon: Target,
      title: isSwahili ? "Malengo ya Ukuaji" : "Growth Goals",
      description: isSwahili
        ? "Fanya kazi kwenye mradi unaoendelea kukua na una athari kubwa kwa jamii."
        : "Work on a growing project with significant impact on the community."
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
              {isSwahili ? "Kazi Zetu" : "Careers"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-top-4 duration-700 delay-200">
              {isSwahili 
                ? "Jiunge na timu yetu ya watu wenye nia ya kubadilisha afya nchini Tanzania. Tunatafuta watu wenye uzoefu na wenye nia ya kufanya tofauti."
                : "Join our team of people passionate about transforming healthcare in Tanzania. We're looking for experienced people who want to make a difference."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isSwahili ? "Kwa Nini Kufanya Kazi Nasi?" : "Why Work With Us?"}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isSwahili ? "Nafasi Zilizopo" : "Open Positions"}
            </h2>
            <p className="text-xl text-gray-600">
              {isSwahili 
                ? "Tazama nafasi zilizopo na uomba kazi inayokufaa"
                : "View open positions and apply for the job that fits you"
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {positions.map((position, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {position.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {position.type}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <Button className="w-full transition-all duration-200 hover:scale-105">
                    <Mail className="h-4 w-4 mr-2" />
                    {isSwahili ? "Omba Kazi" : "Apply Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {isSwahili ? "Huna Nafasi Unayotaka?" : "Don't See the Role You Want?"}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {isSwahili 
              ? "Wasiliana nasi na utujulishe kuhusu uzoefu wako. Tunaweza kuunda nafasi kwa ajili yako."
              : "Contact us and tell us about your experience. We might create a role for you."
            }
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 transition-all duration-200 hover:scale-105">
            <Mail className="h-5 w-5 mr-2" />
            {isSwahili ? "Wasiliana Nasi" : "Contact Us"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
