import React from 'react';
import Step1PrescriptionRefactored from './steps/Step1PrescriptionRefactored';
import Step3DietPlan from './steps/Step3DietPlan';
import Step4Marketplace from './steps/Step4Marketplace';
import Step5GymsWorkouts from './steps/Step5GymsWorkouts';
import Step6Summary from './steps/Step6Summary';
import type { UserData, DietPlan, StepId } from '@/types/afya-bora';

interface StepRendererProps {
  currentStepId: StepId;
  userData: UserData;
  dietPlan: DietPlan | null;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
  navigateToStep: (stepId: StepId) => void;
  setDietPlan: (plan: DietPlan | null) => void;
  setGlobalErrorMessage: (message: string | null) => void;
  globalErrorMessage: string | null;
  setIsLoadingDietPlan: (loading: boolean) => void;
  isLoadingDietPlan: boolean;
}

export function StepRenderer({
  currentStepId,
  userData,
  dietPlan,
  updateUserData,
  navigateToNextStep,
  navigateToPrevStep,
  navigateToStep,
  setDietPlan,
  setGlobalErrorMessage,
  globalErrorMessage,
  setIsLoadingDietPlan,
  isLoadingDietPlan,
}: StepRendererProps) {
  const renderStepContent = () => {
    switch (currentStepId) {
      case 'prescription_patient_data':
        return (
          <Step1PrescriptionRefactored
            userData={userData}
            updateUserData={updateUserData}
            navigateToNextStep={navigateToNextStep}
            setDietPlan={setDietPlan}
            setGlobalErrorMessage={setGlobalErrorMessage}
            globalErrorMessage={globalErrorMessage}
            setIsLoadingDietPlan={setIsLoadingDietPlan}
          />
        );
      case 'diet_plan':
        return (
          <Step3DietPlan
            userData={userData}
            dietPlan={dietPlan}
            setDietPlan={setDietPlan}
            navigateToNextStep={navigateToNextStep}
            navigateToPrevStep={navigateToPrevStep}
            setErrorMessage={setGlobalErrorMessage}
            isLoading={isLoadingDietPlan}
            setIsLoading={setIsLoadingDietPlan}
          />
        );
      case 'marketplace':
        return (
          <Step4Marketplace
            userData={userData}
            dietPlan={dietPlan}
            navigateToNextStep={navigateToNextStep}
            navigateToPrevStep={navigateToPrevStep}
          />
        );
      case 'gym_workouts':
        return (
          <Step5GymsWorkouts
            userData={userData}
            updateUserData={updateUserData}
            navigateToNextStep={navigateToNextStep}
            navigateToPrevStep={navigateToPrevStep}
          />
        );
      case 'summary':
        return (
          <Step6Summary
            userData={userData}
            dietPlan={dietPlan}
            navigateToPrevStep={navigateToPrevStep}
            navigateToStep={navigateToStep}
            updateUserData={updateUserData}
          />
        );
      default:
        return <p>Unknown step.</p>;
    }
  };

  return <div className="animate-in fade-in duration-500">{renderStepContent()}</div>;
}
