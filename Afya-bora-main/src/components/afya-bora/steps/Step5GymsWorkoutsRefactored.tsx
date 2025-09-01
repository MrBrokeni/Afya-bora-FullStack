"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike } from 'lucide-react';
import type { UserData } from '@/types/afya-bora';

// Custom hooks
import { useGymsWorkouts } from '@/lib/hooks/use-gyms-workouts';

// Components
import { LocationSearch } from '../components/LocationSearch';
import { GymsSection } from '../components/GymsSection';
import { WorkoutPlansSection } from '../components/WorkoutPlansSection';
import { GymsWorkoutsActions } from '../components/GymsWorkoutsActions';

interface Step5GymsWorkoutsRefactoredProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
}

const Step5GymsWorkoutsRefactored: React.FC<Step5GymsWorkoutsRefactoredProps> = ({
  userData,
  updateUserData,
  navigateToNextStep,
  navigateToPrevStep,
}) => {
  // Custom hooks
  const gymsWorkouts = useGymsWorkouts(userData, updateUserData);

  // Get workout plans
  const workoutPlans = gymsWorkouts.getWorkoutPlans();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Bike className="mr-2 h-7 w-7 text-primary" />
          Near Me: Gyms & Workouts
        </CardTitle>
        <CardDescription>
          Find local gyms or choose a home workout plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Location Search Section */}
        <LocationSearch
          locationPermission={gymsWorkouts.locationPermission}
          manualLocation={gymsWorkouts.manualLocation}
          onRequestLocation={gymsWorkouts.requestLocation}
          onManualLocationChange={gymsWorkouts.setManualLocation}
          onManualLocationSearch={gymsWorkouts.handleManualLocationSearch}
        />

        {/* Gyms Section */}
        <GymsSection
          showGyms={gymsWorkouts.showGyms}
          gyms={gymsWorkouts.gyms}
        />

        {/* Workout Plans Section */}
        <WorkoutPlansSection workoutPlans={workoutPlans} />
      </CardContent>
      
      <GymsWorkoutsActions
        onNavigatePrev={navigateToPrevStep}
        onNavigateNext={navigateToNextStep}
      />
    </Card>
  );
};

export default Step5GymsWorkoutsRefactored;
