"use client";

import React, { useState, useEffect } from 'react';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser, onAuthStateChange } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        // User is signed in, redirect to main app
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAuthSuccess = () => {
            router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to landing page */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-primary">Afya Bora</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp 
              ? 'Join thousands of users improving their health' 
              : 'Continue your health journey with us'
            }
          </p>
        </div>

        {/* Auth Forms */}
        {isSignUp ? (
          <SignUpForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignIn={() => setIsSignUp(false)}
          />
        ) : (
          <SignInForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignUp={() => setIsSignUp(true)}
          />
        )}

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AuthPage;
