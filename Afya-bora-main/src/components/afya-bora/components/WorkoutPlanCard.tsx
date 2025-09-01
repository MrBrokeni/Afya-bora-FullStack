import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PersonStanding, Dumbbell, Users } from 'lucide-react';
import type { WorkoutPlan } from '@/types/afya-bora';
import { ExerciseDisplay } from './ExerciseDisplay';

const workoutIcons: Record<WorkoutPlan['type'], React.ElementType> = {
  'No Equipment': PersonStanding,
  'Minimal Equipment': Dumbbell,
  'Full Gym': Users, 
};

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
}

export function WorkoutPlanCard({ plan }: WorkoutPlanCardProps) {
  const Icon = workoutIcons[plan.type] || Dumbbell;

  return (
    <Card className="min-w-[320px] max-w-[380px] overflow-hidden shadow-md flex flex-col">
      <div className="relative w-full h-48">
        <Image 
          src={plan.imageUrl || "https://placehold.co/400x250.png"} 
          alt={plan.title} 
          layout="fill" 
          objectFit="cover" 
          data-ai-hint={plan.dataAiHint || "fitness workout"} 
          className="bg-muted"
        />
        <Badge variant="secondary" className="absolute top-2 right-2 flex items-center">
          <Icon className="h-3 w-3 mr-1"/>{plan.type}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{plan.title}</CardTitle>
        <CardDescription className="text-xs h-10 overflow-hidden">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs space-y-1 flex-grow">
        <ScrollArea className="h-32 pr-2">
          {plan.exercises.map((exercise, index) => (
            <ExerciseDisplay key={index} exercise={exercise} />
          ))}
        </ScrollArea>
        <p className="mt-2 pt-1 border-t"><strong>Rest:</strong> {plan.restIntervals}</p>
        <p><strong>Progression:</strong> {plan.progressionCues}</p>
      </CardContent>
    </Card>
  );
}
