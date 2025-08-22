"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Zap, Target, Mail, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/ui/navigation';
import Footer from '@/components/ui/footer';

const CareersPage = () => {
  const { isSwahili } = useLanguage();

  const positions: any[] = []; // No current positions

  const benefits = [
    {
      icon: Users,
      title: isSwahili ? "Timu Makini" : "Great Team",
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
      <Navigation showNavLinks={false} showAuthButtons={false} showBackButton={true} />

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
           
           <div className="text-center">
             <Card className="max-w-2xl mx-auto border-0 shadow-lg">
               <CardContent className="p-12">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Mail className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                   {isSwahili ? "Hakuna Nafasi Zilizopo Sasa Hivi" : "No Current Openings"}
                 </h3>
                 <p className="text-gray-600 mb-6 text-lg">
                   {isSwahili 
                     ? "Kwa sasa hatuna nafasi za kazi zilizopo. Tafadhali rudi tena baada ya muda kujua nafasi mpya."
                     : "We currently don't have any open positions. Please check back frequently for new opportunities."
                   }
                 </p>
                 <div className="bg-blue-50 p-4 rounded-lg">
                   <p className="text-blue-800 text-sm">
                     {isSwahili 
                       ? "💡 : Unaweza kutuma barua pepe kwa info@afyabora.co.tz yenye CV na Cover Letter na tunaweza kukuwasiliana wakati nafasi ikitokea."
                       : "💡 Tip: You can email us at info@afyabora.co.tz with your CV and Cover Letter and we'll contact you when positions become available."
                     }
                   </p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>

             {/* Contact */}
       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary">
         <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
             {isSwahili ? "Wasiliana Nasi" : "Get In Touch"}
           </h2>
           <p className="text-xl text-green-100 mb-8">
             {isSwahili 
               ? "Una maswali au Maoni? Wasiliana nasi."
               : "Have questions or want to share your experience? Get in touch with us."
             }
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
             <div className="text-center">
               <div className="text-2xl mb-2">📧</div>
               <p className="font-semibold">Email</p>
               <p className="text-green-100">info@afyabora.co.tz</p>
             </div>
             <div className="text-center">
               <div className="text-2xl mb-2">📞</div>
               <p className="font-semibold">Phone</p>
               <p className="text-green-100">+255 718 393 277</p>
             </div>
             <div className="text-center">
               <div className="text-2xl mb-2">📍</div>
               <p className="font-semibold">Location</p>
               <p className="text-green-100">Mwanga Tower, Dar es Salaam, Tanzania</p>
             </div>
           </div>
         </div>
       </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CareersPage;
