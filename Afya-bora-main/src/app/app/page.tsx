"use client";

import React, { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange, signOutUser } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AfyaBoraPage from './main-app';
import WelcomeAnimation from '@/components/ui/welcome-animation';

const AppPage = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        setIsLoading(false);
        // Show welcome animation if not shown before
        if (!hasShownWelcome) {
          setShowWelcome(true);
          setHasShownWelcome(true);
        }
      } else {
        // User is not authenticated, redirect to auth page
        router.push('/auth');
      }
    });

    return () => unsubscribe();
  }, [router, hasShownWelcome]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push('/');
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <div className="relative">
            <Heart className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
          <p className="text-gray-600 animate-pulse">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const getUserFirstName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Welcome Animation */}
      {showWelcome && (
        <WelcomeAnimation 
          userName={getUserFirstName()} 
          onComplete={handleWelcomeComplete} 
        />
      )}

      {/* Enhanced Header with premium UI */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100/50 px-4 py-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Heart className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold text-primary">Afya Bora</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-3 py-2 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{getUserFirstName()}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main app content */}
      <AfyaBoraPage />
    </div>
  );
};

export default AppPage;
