import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Dumbbell, Info } from 'lucide-react';
import type { WorkoutPlan } from '@/types/afya-bora';
import { WorkoutPlanCard } from './WorkoutPlanCard';

interface WorkoutPlansSectionProps {
  workoutPlans: WorkoutPlan[];
}

export function WorkoutPlansSection({ workoutPlans }: WorkoutPlansSectionProps) {
  const scrollWorkouts = (direction: 'left' | 'right') => {
    const container = document.getElementById('workout-plans-scroll-area');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <h3 className="text-xl font-semibold mb-1 text-foreground flex items-center">
        <Dumbbell className="mr-2 h-5 w-5 text-accent" />Home Workout Plans
      </h3>
      {workoutPlans.length === 0 && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Coming Soon!</AlertTitle>
          <AlertDescription>Home workout plans will be available here shortly.</AlertDescription>
        </Alert>
      )}
      {workoutPlans.length > 0 && (
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 hidden sm:flex" 
            onClick={() => scrollWorkouts('left')}
          >
            <ChevronLeft />
          </Button>
          <ScrollArea id="workout-plans-scroll-area" className="w-full whitespace-nowrap rounded-md">
            <div className="flex space-x-4 p-1 pb-4">
              {workoutPlans.map(plan => (
                <WorkoutPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 hidden sm:flex" 
            onClick={() => scrollWorkouts('right')}
          >
            <ChevronRight />
          </Button>
        </div>
      )}
    </section>
  );
}
