"use client";

import type React from 'react';
import { cn } from '@/lib/utils';
import { STEPS, type StepId } from '@/types/afya-bora';
import { Button } from '@/components/ui/button';
import {
  FileText,
  User,
  Salad,
  ShoppingCart,
  Bike,
  ClipboardCheck,
  Icon as LucideIcon,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile'; // Assuming this hook exists

interface IconMap {
  [key: string]: LucideIcon;
}

const iconMap: IconMap = {
  FileText,
  User,
  Salad,
  ShoppingCart,
  Bike,
  ClipboardCheck,
};

interface ProgressSidebarProps {
  currentStep: StepId;
  navigateToStep: (stepId: StepId) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  currentStep,
  navigateToStep,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md p-2 shadow-md md:hidden">
        <div className="flex items-center justify-between">
           <h1 className="text-lg font-headline font-bold text-primary">Afya Bora</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        {isSidebarOpen && (
          <nav className="mt-2">
            <ul className="space-y-1">
              {STEPS.map((step, index) => {
                const Icon = iconMap[step.icon];
                return (
                  <li key={step.id}>
                    <Button
                      variant={currentStep === step.id ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start text-sm',
                        currentStep === step.id ? 'font-semibold text-primary' : 'text-foreground/80'
                      )}
                      onClick={() => {
                        navigateToStep(step.id);
                        setIsSidebarOpen(false); // Close sidebar on navigation
                      }}
                    >
                      {Icon && <Icon className="mr-2 h-4 w-4" />}
                      {step.title}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-64 bg-white/90 backdrop-blur-md text-card-foreground p-6 space-y-8 transition-all duration-300 ease-in-out fixed h-full z-30 shadow-xl border-r border-green-100/50',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-[calc(100%-3.5rem)]'
      )}
    >
      <div className="flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Afya Bora</h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className={cn(
            "hover:bg-green-50 transition-all duration-200",
            !isSidebarOpen && "ml-auto"
          )}
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {isSidebarOpen ? (
         <nav className="flex-grow">
          <ul className="space-y-3">
            {STEPS.map((step, index) => {
              const Icon = iconMap[step.icon];
              const isActive = currentStep === step.id;
              const isCompleted = STEPS.findIndex(s => s.id === currentStep) > STEPS.findIndex(s => s.id === step.id);
              
              return (
                <li key={step.id}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start py-4 px-4 text-base rounded-xl transition-all duration-200 group relative overflow-hidden',
                      isActive 
                        ? 'font-semibold text-primary bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm' 
                        : 'text-gray-700 hover:bg-green-50 hover:text-primary hover:shadow-sm',
                      isCompleted && !isActive && 'text-green-600 bg-green-50/50'
                    )}
                    onClick={() => navigateToStep(step.id)}
                    title={step.title}
                  >
                    <div className="flex items-center w-full">
                      <div className={cn(
                        "relative mr-3",
                        isActive && "animate-pulse"
                      )}>
                        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                        {isCompleted && !isActive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <span className="flex-1 text-left">{step.title}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : (
        <nav className="flex-grow mt-8">
          <ul className="space-y-3">
             {STEPS.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <li key={step.id}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={currentStep === step.id ? 'secondary' : 'ghost'}
                          size="icon"
                          className={cn(
                            'w-10 h-10',
                            currentStep === step.id ? 'text-primary bg-primary/10' : 'text-foreground/70 hover:bg-muted/50'
                          )}
                          onClick={() => navigateToStep(step.id)}
                        >
                          {Icon && <Icon className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-foreground text-background">
                        <p>{step.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {isSidebarOpen && (
        <div className="mt-auto p-4 bg-green-50/50 rounded-xl border border-green-100/50">
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Health Journey</span>
          </div>
          <p className="text-xs text-gray-600 mb-1">
            &copy; {new Date().getFullYear()} Afya Bora
          </p>
          <p className="text-xs text-gray-500">
            Your health, our priority.
          </p>
        </div>
      )}
    </aside>
  );
};

// Need to import Tooltip components if not already globally available
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default ProgressSidebar;
