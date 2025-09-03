"use client";

import React from 'react';
import ProgressSidebar from '@/components/afya-bora/ProgressSidebar';
import { StepRenderer } from '@/components/afya-bora/StepRenderer';
import { LoadingStates } from '@/components/afya-bora/LoadingStates';
import { MobileHeader } from '@/components/afya-bora/MobileHeader';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAfyaBora } from '@/lib/hooks/use-afya-bora';

export default function AfyaBoraPage() {
  const {
    currentStepId,
    userData,
    dietPlan,
    globalErrorMessage,
    isLoadingDietPlan,
    isSidebarOpen,
    isBootstrapping,
    updateUserData,
    navigateToStep,
    navigateToNextStep,
    navigateToPrevStep,
    setDietPlan,
    setGlobalErrorMessage,
    setIsLoadingDietPlan,
    setIsSidebarOpen,
  } = useAfyaBora();

  const isMobile = useIsMobile();
  
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
          <MobileHeader
            currentStepId={currentStepId}
            navigateToStep={navigateToStep}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <div className="w-full max-w-4xl">
          <LoadingStates
            isLoadingDietPlan={isLoadingDietPlan}
            isBootstrapping={isBootstrapping}
            currentStepId={currentStepId}
          />
          {!isLoadingDietPlan && !isBootstrapping && (
            <StepRenderer
              currentStepId={currentStepId}
              userData={userData}
              dietPlan={dietPlan}
              updateUserData={updateUserData}
              navigateToNextStep={navigateToNextStep}
              navigateToPrevStep={navigateToPrevStep}
              navigateToStep={navigateToStep}
              setDietPlan={setDietPlan}
              setGlobalErrorMessage={setGlobalErrorMessage}
              globalErrorMessage={globalErrorMessage}
              setIsLoadingDietPlan={setIsLoadingDietPlan}
              isLoadingDietPlan={isLoadingDietPlan}
            />
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
