"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ProgressSidebar from '@/components/afya-bora/ProgressSidebar';
import Step1Prescription from '@/components/afya-bora/steps/Step1Prescription';
import Step3DietPlan from '@/components/afya-bora/steps/Step3DietPlan';
import Step4Marketplace from '@/components/afya-bora/steps/Step4Marketplace';
import Step5GymsWorkouts from '@/components/afya-bora/steps/Step5GymsWorkouts';
import Step6Summary from '@/components/afya-bora/steps/Step6Summary';
import type { UserData, DietPlan, StepId } from '@/types/afya-bora';
import { STEPS } from '@/types/afya-bora';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { getGeneratedDietPlan } from '@/app/actions';
import type { GenerateDietPlanInput } from '@/types/afya-bora';

export default function AfyaBoraPage() {
  const [currentStepId, setCurrentStepId] = useState<StepId>(STEPS[0].id);
  const [userData, setUserData] = useState<UserData>({
    weightUnit: 'kg', // Default value
  });
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [globalErrorMessage, setGlobalErrorMessage] = useState<string | null>(null);
  const [isLoadingDietPlan, setIsLoadingDietPlan] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); 

  const isMobile = useIsMobile();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    // Load saved profile for authenticated user on first mount
    (async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const saved = await getUserProfile(currentUser.uid);
          if (saved) {
            setUserData(prev => ({ ...prev, ...saved }));
            // If profile looks complete, auto-generate first, THEN navigate to diet plan
            const hasPrescription = typeof saved.prescriptionText === 'string' && saved.prescriptionText.trim().length >= 10;
            const hasAge = typeof saved.age === 'number' && saved.age > 0;
            const hasWeight = typeof saved.weight === 'number' && saved.weight > 0;
            const hasActivity = typeof saved.activityLevel === 'string' && saved.activityLevel.length > 0;
            if (hasPrescription && hasAge && hasWeight && hasActivity) {
              setIsLoadingDietPlan(true);
              try {
                const weightInKg = saved.weightUnit === 'lbs' ? (saved.weight as number) * 0.453592 : (saved.weight as number);
                const input: GenerateDietPlanInput = {
                  prescriptionText: saved.prescriptionText as string,
                  foodAllergies: saved.foodAllergies || 'none',
                  chronicConditions: saved.chronicConditions || 'none',
                  age: saved.age as number,
                  weightKg: weightInKg,
                  activityLevel: saved.activityLevel as any,
                };
                const result = await getGeneratedDietPlan(input);
                if ('error' in result) {
                  setGlobalErrorMessage(`Failed to generate diet plan: ${result.error}`);
                  setIsLoadingDietPlan(false);
                } else {
                  setDietPlan(result);
                  setIsLoadingDietPlan(false);
                  setCurrentStepId('diet_plan');
                }
              } catch (err) {
                console.error('Auto-generate failed', err);
                setGlobalErrorMessage('Failed to generate diet plan. Please try again.');
                setIsLoadingDietPlan(false);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to bootstrap profile', e);
      } finally {
        setIsBootstrapping(false);
      }
    })();
    if (isMobile) {
      setIsSidebarOpen(false); 
    } else {
      setIsSidebarOpen(true); 
    }
  }, [isMobile]);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, []);

  const navigateToStep = useCallback((stepId: StepId) => {
    setGlobalErrorMessage(null); 
    setCurrentStepId(stepId);
    if (isMobile) setIsSidebarOpen(false); 
    window.scrollTo(0, 0); 
  }, [isMobile]);

  const navigateToNextStep = useCallback(() => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStepId);
    if (currentIndex < STEPS.length - 1) {
      navigateToStep(STEPS[currentIndex + 1].id);
    }
  }, [currentStepId, navigateToStep]);

  const navigateToPrevStep = useCallback(() => {
    const currentIndex = STEPS.findIndex(step => step.id === currentStepId);
    if (currentIndex > 0) {
      navigateToStep(STEPS[currentIndex - 1].id);
    }
  }, [currentStepId, navigateToStep]);

  const renderStepContent = () => {
    switch (currentStepId) {
      case 'prescription_patient_data':
        return <Step1Prescription 
                  userData={userData} 
                  updateUserData={updateUserData} 
                  navigateToNextStep={navigateToNextStep} 
                  setDietPlan={setDietPlan}
                  setGlobalErrorMessage={setGlobalErrorMessage} 
                  globalErrorMessage={globalErrorMessage}
                  setIsLoadingDietPlan={setIsLoadingDietPlan} 
                />;
      case 'diet_plan':
        return <Step3DietPlan 
                  userData={userData} 
                  dietPlan={dietPlan} 
                  setDietPlan={setDietPlan} 
                  navigateToNextStep={navigateToNextStep} 
                  navigateToPrevStep={navigateToPrevStep} 
                  setErrorMessage={setGlobalErrorMessage} 
                  isLoading={isLoadingDietPlan} 
                  setIsLoading={setIsLoadingDietPlan} 
                />;
      case 'marketplace':
        return <Step4Marketplace 
                  userData={userData} 
                  dietPlan={dietPlan} 
                  navigateToNextStep={navigateToNextStep} 
                  navigateToPrevStep={navigateToPrevStep} 
                />;
      case 'gym_workouts':
        return <Step5GymsWorkouts 
                  userData={userData} 
                  updateUserData={updateUserData} 
                  navigateToNextStep={navigateToNextStep} 
                  navigateToPrevStep={navigateToPrevStep} 
                />;
      case 'summary':
        return <Step6Summary 
                  userData={userData} 
                  dietPlan={dietPlan} 
                  navigateToPrevStep={navigateToPrevStep} 
                  navigateToStep={navigateToStep} 
                  updateUserData={updateUserData}
                />;
      default:
        return <p>Unknown step.</p>;
    }
  };
  
  const mainContentMarginClass = isMobile 
    ? (isSidebarOpen ? "pt-32" : "pt-16") 
    : (isSidebarOpen ? "md:ml-64" : "md:ml-14"); 

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <ProgressSidebar 
        currentStep={currentStepId} 
        navigateToStep={navigateToStep} 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className={cn(
        "flex-1 flex flex-col items-center p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ease-in-out",
        mainContentMarginClass
        )}
      >
        {isMobile && !isSidebarOpen && (
             <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md p-3 shadow-lg md:hidden flex items-center justify-between border-b border-green-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-primary">Afya Bora</h1>
                </div>
                <ProgressSidebar 
                    currentStep={currentStepId} 
                    navigateToStep={navigateToStep} 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
            </div>
        )}
        <div className="w-full max-w-4xl">
          {isLoadingDietPlan && currentStepId === 'prescription_patient_data' && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating your personalized diet plan...</h3>
              <p className="text-gray-600 text-center max-w-md">
                Our AI is analyzing your prescription and creating a customized nutrition plan just for you.
              </p>
              <div className="mt-6 flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
          {!isLoadingDietPlan && !isBootstrapping && (
            <div className="animate-in fade-in duration-500">
              {renderStepContent()}
            </div>
          )}
          {!isLoadingDietPlan && isBootstrapping && (
            <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading your profile...</h3>
              <p className="text-gray-600">Retrieving your saved health data and preferences.</p>
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
