import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStatesProps {
  isLoadingDietPlan: boolean;
  isBootstrapping: boolean;
  currentStepId: string;
}

export function LoadingStates({ isLoadingDietPlan, isBootstrapping, currentStepId }: LoadingStatesProps) {
  if (isLoadingDietPlan && currentStepId === 'prescription_patient_data') {
    return (
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
    );
  }

  if (isBootstrapping) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading your profile...</h3>
        <p className="text-gray-600">Retrieving your saved health data and preferences.</p>
      </div>
    );
  }

  return null;
}
