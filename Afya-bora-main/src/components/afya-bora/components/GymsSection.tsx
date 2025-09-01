import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import type { Gym } from '@/types/afya-bora';
import { GymCard } from './GymCard';

interface GymsSectionProps {
  showGyms: boolean;
  gyms: Gym[];
}

export function GymsSection({ showGyms, gyms }: GymsSectionProps) {
  if (!showGyms) return null;

  return (
    <>
      {gyms.length > 0 ? (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex space-x-4 p-1 pb-4">
            {gyms.map(gym => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Gyms Found</AlertTitle>
          <AlertDescription>No gyms found for your location. Check out our home workout plans below!</AlertDescription>
        </Alert>
      )}
    </>
  );
}
