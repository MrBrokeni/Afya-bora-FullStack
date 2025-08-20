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
        'hidden md:flex flex-col w-64 bg-card text-card-foreground p-4 space-y-6 transition-all duration-300 ease-in-out fixed h-full z-30 shadow-lg',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-[calc(100%-3.5rem)]'
      )}
    >
      <div className="flex items-center justify-between">
        {isSidebarOpen && (
          <h1 className="text-2xl font-headline font-bold text-primary">Afya Bora</h1>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={cn(!isSidebarOpen && "ml-auto")}>
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {isSidebarOpen ? (
         <nav className="flex-grow">
          <ul className="space-y-2">
            {STEPS.map((step, index) => {
              const Icon = iconMap[step.icon];
              return (
                <li key={step.id}>
                  <Button
                    variant={currentStep === step.id ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start py-3 text-base',
                       currentStep === step.id ? 'font-semibold text-primary bg-primary/10' : 'text-foreground/80 hover:bg-muted/50'
                    )}
                    onClick={() => navigateToStep(step.id)}
                    title={step.title}
                  >
                    {Icon && <Icon className="mr-3 h-5 w-5 flex-shrink-0" />}
                    <span className={cn(isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 hidden')}>{step.title}</span>
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
        <div className="mt-auto text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Afya Bora. All rights reserved.</p>
          <p className="mt-1">Your health, our priority.</p>
        </div>
      )}
    </aside>
  );
};

// Need to import Tooltip components if not already globally available
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default ProgressSidebar;
