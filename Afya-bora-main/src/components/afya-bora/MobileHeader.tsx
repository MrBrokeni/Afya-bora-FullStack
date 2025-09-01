import React from 'react';
import { Heart } from 'lucide-react';
import ProgressSidebar from './ProgressSidebar';
import type { StepId } from '@/types/afya-bora';

interface MobileHeaderProps {
  currentStepId: StepId;
  navigateToStep: (stepId: StepId) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function MobileHeader({
  currentStepId,
  navigateToStep,
  isSidebarOpen,
  setIsSidebarOpen,
}: MobileHeaderProps) {
  return (
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
  );
}
