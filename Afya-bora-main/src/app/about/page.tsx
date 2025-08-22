"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Target, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/ui/navigation';
import Footer from '@/components/ui/footer';

const AboutPage = () => {
  const { t, isSwahili } = useLanguage();

  const stats = [
    { number: "10,000+", label: isSwahili ? "Watumiaji Hai" : "Active Users" },
    { number: "95%", label: isSwahili ? "Kiwango cha Kuridhika" : "Satisfaction Rate" },
    { number: "50+", label: isSwahili ? "Wauzaji wa Kienyeji" : "Local Vendors" },
    { number: "24/7", label: isSwahili ? "Msaada wa AI" : "AI Support" }
  ];

  const values = [
    {
      icon: Heart,
      title: isSwahili ? "Afya Kwanza" : "Health First",
      description: isSwahili 
        ? "Tunaamini kwamba afya ya kila mtu ni muhimu. Tunafanya kazi kwa bidii kuhakikisha kwamba kila mtu anaweza kupata huduma bora za afya."
        : "We believe that everyone's health matters. We work tirelessly to ensure that everyone can access quality healthcare."
    },
    {
      icon: Users,
      title: isSwahili ? "Jumuiya" : "Community",
      description: isSwahili
        ? "Tunaunda jumuiya ya watu ambao wanafanya kazi pamoja kwa afya bora. Tunashirikiana na wauzaji wa kienyeji, madaktari, na watumiaji."
        : "We build a community of people working together for better health. We collaborate with local vendors, doctors, and users."
    },
    {
      icon: Target,
      title: isSwahili ? "Ufanisi" : "Innovation",
      description: isSwahili
        ? "Tunatumia teknolojia ya juu ya AI kutoa suluhisho za afya za kisasa. Tunafanya kazi kwa bidii kuendeleza teknolojia yetu."
        : "We use cutting-edge AI technology to deliver modern health solutions. We continuously work to improve our technology."
    },
    {
      icon: Shield,
      title: isSwahili ? "Usalama" : "Security",
      description: isSwahili
        ? "Taarifa zako za afya ni muhimu sana kwetu. Tunatumia usalama wa hali ya juu kuhakikisha kwamba Taarifa zako ziko salama."
        : "Your health data is very important to us. We use enterprise-grade security to ensure your data is safe."
    }
  ];

  const team = [
    {
      name: isSwahili ? "Dk. Sarah Johnson" : "Dr. Sarah Johnson",
      role: isSwahili ? "Mkurugenzi wa Matibabu" : "Chief Medical Officer",
      bio: isSwahili
        ? "Daktari wa matibabu na mtaalamu wa lishe na uzoefu wa miaka 15 katika sekta ya afya."
        : "Medical doctor and nutrition expert with 15 years of experience in the healthcare sector."
    },
    {
      name: isSwahili ? "Daniel Eudes" : "Daniel Eudes",
      role: isSwahili ? "Mkurugenzi wa Teknolojia" : "Chief Technology Officer",
      bio: isSwahili
        ? "Mtaalamu wa AI na uzoefu wa miaka 5 katika maendeleo ya programu za afya."
        : "AI expert with 5 years of experience in healthcare software development."
    },
    {
      name: isSwahili ? "Sucrose TheMoneyHollic" : "Sucrose TheMoneyHollic",
      role: isSwahili ? "Mkurugenzi wa Biashara" : "Chief Business Officer",
      bio: isSwahili
        ? "Mtaalamu wa biashara na uzoefu wa miaka 8 katika sekta ya teknolojia ya afya."
        : "Business expert with 8 years of experience in health technology sector."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <Navigation showNavLinks={false} showAuthButtons={false} showBackButton={true} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-in slide-in-from-top-4 duration-700">
              {isSwahili ? "Kuhusu Afya Bora" : "About Afya Bora"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-in slide-in-from-top-4 duration-700 delay-200">
              {isSwahili 
                ? "Tunafanya kazi kwa bidii kuunda dunia ambapo kila mtu anaweza kupata huduma bora za afya. Kuanzia uchambuzi wa dawa hadi mipango ya lishe ya kibinafsi, tunatumia teknolojia ya juu ya AI kuhakikisha kwamba safari yako ya afya ni rahisi na ufanisi."
                : "We work tirelessly to create a world where everyone can access quality healthcare. From prescription analysis to personalized nutrition plans, we use cutting-edge AI technology to ensure your health journey is easy and effective."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-200">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isSwahili ? "Thamani Zetu" : "Our Values"}
            </h2>
            <p className="text-xl text-gray-600">
              {isSwahili 
                ? "Thamani hizi ndizo zinazotuongoza katika kila kitu tunachofanya"
                : "These values guide everything we do"
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {isSwahili ? "Timu Yetu" : "Our Team"}
            </h2>
            <p className="text-xl text-gray-600">
              {isSwahili 
                ? "Watu ambao wanafanya Afya Bora iwezekane"
                : "The people who make Afya Bora possible"
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg transform hover:scale-105 transition-transform duration-200">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {isSwahili ? "Jiunge Nasi" : "Join Us"}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {isSwahili 
              ? "Jiunge na safari yetu ya kubadilisha afya nchini Tanzania"
              : "Join us on our journey to transform healthcare in Tanzania"
            }
          </p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 transition-all duration-200 hover:scale-105">
              {isSwahili ? "Anza Leo" : "Get Started Today"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
