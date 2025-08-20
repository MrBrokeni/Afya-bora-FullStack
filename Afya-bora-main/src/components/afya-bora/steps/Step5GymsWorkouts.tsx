"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bike, MapPin, Dumbbell, PersonStanding, ExternalLink, AlertCircle, Info, Search, ChevronLeft, ChevronRight, PlayCircle, Users } from 'lucide-react';
import type { UserData, Gym, WorkoutPlan, WorkoutExercise } from '@/types/afya-bora';
import { useToast } from '@/hooks/use-toast';

// Mock Data
const mockGyms: Gym[] = [
  { id: 'g1', name: 'Afya Fit Gym', address: 'Mbezi Beach, Dar es Salaam', distance: '3.2 km away', contact: '0712 345 678', pricing: '100,000 TZS/month', mapLink: 'https://maps.google.com/?q=Afya+Fit+Gym+Dar+es+Salaam', imageUrl: 'https://placehold.co/400x250.png', dataAiHint: 'gym equipment' },
  { id: 'g2', name: 'Powerhouse Fitness Center', address: ' Masaki, Dar es Salaam', distance: '5.1 km away', contact: '0755 987 654', pricing: '150,000 TZS/month, Day pass 10,000 TZS', mapLink: 'https://maps.google.com/?q=Powerhouse+Fitness+Center+Dar+es+Salaam', imageUrl: 'https://placehold.co/400x250.png', dataAiHint: 'fitness class' },
  { id: 'g3', name: 'BodyShape Gym', address: 'Kijitonyama, Dar es Salaam', distance: '8.5 km away', contact: '0688 123 789', pricing: '80,000 TZS/month', mapLink: 'https://maps.google.com/?q=BodyShape+Gym+Dar+es+Salaam', imageUrl: 'https://placehold.co/400x250.png', dataAiHint: 'gym interior' },
];

const mockWorkoutPlans: WorkoutPlan[] = [
  { 
    id: 'w1', type: 'No Equipment', title: "Bodyweight Basics", description: "Start your fitness journey with these effective bodyweight exercises.",
    exercises: [
      { name: 'Squats', setsReps: '3x12', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Push-ups (knees or toes)', setsReps: '3x10', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Glute Bridges', setsReps: '3x15', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Plank', setsReps: '3x30 seconds', videoUrl: 'https://placehold.co/100x60.png' },
    ],
    restIntervals: 'Rest 45-60 sec between sets', progressionCues: 'If it feels easy, try to increase reps or hold plank longer.',
    imageUrl: 'https://placehold.co/400x250.png', dataAiHint: 'home workout'
  },
  {
    id: 'w2', type: 'Minimal Equipment', title: "Band & Dumbbell Blast", description: "Utilize simple equipment for a full-body workout.",
    exercises: [
      { name: 'Resistance Band Rows', setsReps: '3x12', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Dumbbell Shoulder Press', setsReps: '3x10', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Band-Assisted Lunges', setsReps: '3x15 per leg', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Dumbbell Bicep Curls', setsReps: '3x12', videoUrl: 'https://placehold.co/100x60.png' },
    ],
    restIntervals: 'Rest 60 sec between sets', progressionCues: 'Increase weight or band resistance when you can complete all sets easily.',
    imageUrl: 'https://placehold.co/400x250.png', dataAiHint: 'resistance band'
  },
  {
    id: 'w3', type: 'Full Gym', title: "Gym Power Routine", description: "Maximize your gym sessions with this comprehensive plan.",
    exercises: [
      { name: 'Leg Press', setsReps: '3x12', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Lat Pulldown', setsReps: '3x10', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Bench Press or Dumbbell Chest Press', setsReps: '3x10', videoUrl: 'https://placehold.co/100x60.png' },
      { name: 'Leg Raises (Hanging or Lying)', setsReps: '3x15', videoUrl: 'https://placehold.co/100x60.png' },
    ],
    restIntervals: 'Rest 60-90 sec between sets', progressionCues: 'Aim to progressively overload by increasing weight or reps each week.',
    imageUrl: 'https://placehold.co/400x250.png', dataAiHint: 'weightlifting gym'
  },
];

const workoutIcons: Record<WorkoutPlan['type'], React.ElementType> = {
  'No Equipment': PersonStanding,
  'Minimal Equipment': Dumbbell,
  'Full Gym': Users, 
};


interface Step5GymsWorkoutsProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
}

const Step5GymsWorkouts: React.FC<Step5GymsWorkoutsProps> = ({
  userData,
  updateUserData,
  navigateToNextStep,
  navigateToPrevStep,
}) => {
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [manualLocation, setManualLocation] = useState(userData.locationCity || '');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showGyms, setShowGyms] = useState(false);
  const { toast } = useToast();

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          updateUserData({ locationCoordinates: { lat: position.coords.latitude, lng: position.coords.longitude } });
          setGyms(mockGyms); // Simulate finding gyms
          setShowGyms(true);
          toast({ title: "Location Acquired", description: "Showing gyms near you." });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission('denied');
          setShowGyms(false);
          toast({ title: "Location Denied", description: "Please enter your city manually or check browser permissions.", variant: "destructive" });
        }
      );
    } else {
      setLocationPermission('denied'); // Geolocation not supported
      setShowGyms(false);
      toast({ title: "Geolocation Not Supported", description: "Please enter your city manually.", variant: "destructive" });
    }
  };

  const handleManualLocationSearch = () => {
    if (!manualLocation.trim()) {
      toast({ title: "Missing Information", description: "Please enter a city name.", variant: "destructive"});
      return;
    }
    updateUserData({ locationCity: manualLocation.trim() });
    setGyms(mockGyms); // Simulate finding gyms based on city
    setShowGyms(true);
    toast({ title: "Location Set", description: `Showing gyms for ${manualLocation.trim()}.` });
  };

  const renderExercise = (exercise: WorkoutExercise) => (
    <div key={exercise.name} className="flex items-start space-x-2 p-2 border-b text-xs">
      {exercise.videoUrl && (
        <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <Image 
            src={exercise.videoUrl} 
            alt={`Video for ${exercise.name}`} 
            width={80} 
            height={48} 
            className="rounded object-cover bg-muted"
            data-ai-hint="exercise tutorial"
          />
        </a>
      )}
      <div>
        <p className="font-semibold">{exercise.name}</p>
        <p className="text-muted-foreground">{exercise.setsReps}</p>
      </div>
    </div>
  );
  
  const scrollWorkouts = (direction: 'left' | 'right') => {
    const container = document.getElementById('workout-plans-scroll-area');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
        {/* Gyms Section */}
        <section>
          <h3 className="text-xl font-semibold mb-3 text-foreground flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-accent" />Find Nearby Gyms
          </h3>
          {locationPermission === 'prompt' && (
            <Button onClick={requestLocation} className="text-sm">
              Use My Current Location
            </Button>
          )}
          {locationPermission === 'denied' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Location access denied or unavailable. Enter your city:</p>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="e.g., Dar es Salaam"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  className="w-full sm:w-auto text-sm"
                />
                <Button onClick={handleManualLocationSearch} className="text-sm"><Search className="mr-1 h-4 w-4"/> Search</Button>
              </div>
            </div>
          )}
          {showGyms && gyms.length > 0 && (
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
              <div className="flex space-x-4 p-1 pb-4">
                {gyms.map(gym => (
                  <Card key={gym.id} className="min-w-[300px] max-w-[350px] overflow-hidden shadow-md">
                    <div className="relative w-full h-40">
                     <Image src={gym.imageUrl || "https://placehold.co/400x250.png"} alt={gym.name} layout="fill" objectFit="cover" data-ai-hint={gym.dataAiHint || "gym facility"} className="bg-muted"/>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">{gym.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <p><MapPin className="inline h-3 w-3 mr-1 text-muted-foreground"/>{gym.address} ({gym.distance})</p>
                      <p>Contact: {gym.contact}</p>
                      <p>Pricing: {gym.pricing}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild className="w-full text-xs">
                        <a href={gym.mapLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3"/> Get Directions
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
          {showGyms && gyms.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Gyms Found</AlertTitle>
              <AlertDescription>No gyms found for your location. Check out our home workout plans below!</AlertDescription>
            </Alert>
          )}
        </section>

        {/* Home Workout Plans Section */}
        <section>
          <h3 className="text-xl font-semibold mb-1 text-foreground flex items-center">
            <Dumbbell className="mr-2 h-5 w-5 text-accent" />Home Workout Plans
          </h3>
          {mockWorkoutPlans.length === 0 && (
             <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Coming Soon!</AlertTitle>
                <AlertDescription>Home workout plans will be available here shortly.</AlertDescription>
            </Alert>
          )}
          {mockWorkoutPlans.length > 0 && (
            <div className="relative">
                <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 hidden sm:flex" onClick={() => scrollWorkouts('left')}><ChevronLeft /></Button>
                <ScrollArea id="workout-plans-scroll-area" className="w-full whitespace-nowrap rounded-md">
                <div className="flex space-x-4 p-1 pb-4">
                    {mockWorkoutPlans.map(plan => {
                    const Icon = workoutIcons[plan.type] || Dumbbell;
                    return (
                        <Card key={plan.id} className="min-w-[320px] max-w-[380px] overflow-hidden shadow-md flex flex-col">
                        <div className="relative w-full h-48">
                            <Image src={plan.imageUrl || "https://placehold.co/400x250.png"} alt={plan.title} layout="fill" objectFit="cover" data-ai-hint={plan.dataAiHint || "fitness workout"} className="bg-muted"/>
                            <Badge variant="secondary" className="absolute top-2 right-2 flex items-center"><Icon className="h-3 w-3 mr-1"/>{plan.type}</Badge>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-md">{plan.title}</CardTitle>
                            <CardDescription className="text-xs h-10 overflow-hidden">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs space-y-1 flex-grow">
                            <ScrollArea className="h-32 pr-2"> {/* Scroll for exercises */}
                            {plan.exercises.map(renderExercise)}
                            </ScrollArea>
                            <p className="mt-2 pt-1 border-t"><strong>Rest:</strong> {plan.restIntervals}</p>
                            <p><strong>Progression:</strong> {plan.progressionCues}</p>
                        </CardContent>
                        </Card>
                    );
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-75 hover:opacity-100 hidden sm:flex" onClick={() => scrollWorkouts('right')}><ChevronRight /></Button>
            </div>
            )}
        </section>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
        <Button variant="outline" onClick={navigateToPrevStep} className="w-full sm:w-auto text-base py-3">
          Back to Marketplace
        </Button>
        <Button onClick={navigateToNextStep} className="w-full sm:w-auto text-base py-3" size="lg">
          View Health Summary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Step5GymsWorkouts;

      