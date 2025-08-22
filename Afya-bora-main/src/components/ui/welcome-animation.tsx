"use client";

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeAnimationProps {
  userName: string;
  onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ userName, onComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 500);
    const timer2 = setTimeout(() => setAnimationStage(2), 1500);
    const timer3 = setTimeout(() => setAnimationStage(3), 2500);
    const timer4 = setTimeout(() => {
      setShowAnimation(false);
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (!showAnimation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="relative">
        {/* Background sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse",
                "animate-in fade-in duration-1000"
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Main welcome content */}
        <div className="relative z-10 text-center">
          {/* Heart icon with pulse animation */}
          <div className={cn(
            "mb-6 transition-all duration-1000 ease-out",
            animationStage >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}>
            <div className="relative">
              <Heart className="h-16 w-16 text-primary mx-auto animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
              <Sparkles className="h-4 w-4 text-blue-400 absolute -bottom-1 -left-1 animate-ping" />
            </div>
          </div>

          {/* Welcome text */}
          <div className={cn(
            "transition-all duration-1000 ease-out",
            animationStage >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Welcome back,
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {userName}!
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Ready to continue your health journey?
            </p>
          </div>

          {/* Success indicator */}
          <div className={cn(
            "mt-8 transition-all duration-1000 ease-out",
            animationStage >= 3 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Dashboard loaded successfully</span>
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-primary/30 rounded-full",
                "animate-in slide-in-from-bottom-4 duration-2000"
              )}
              style={{
                left: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
