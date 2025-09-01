import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { UserData, Gym, WorkoutPlan } from '@/types/afya-bora';

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

export interface GymsWorkoutsState {
  locationPermission: 'prompt' | 'granted' | 'denied';
  manualLocation: string;
  gyms: Gym[];
  showGyms: boolean;
}

export interface GymsWorkoutsActions {
  requestLocation: () => void;
  setManualLocation: (location: string) => void;
  handleManualLocationSearch: () => void;
  getWorkoutPlans: () => WorkoutPlan[];
  getGyms: () => Gym[];
}

export function useGymsWorkouts(
  userData: UserData,
  updateUserData: (data: Partial<UserData>) => void
): GymsWorkoutsState & GymsWorkoutsActions {
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [manualLocation, setManualLocation] = useState(userData.locationCity || '');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [showGyms, setShowGyms] = useState(false);
  const { toast } = useToast();

  const requestLocation = useCallback(() => {
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
  }, [updateUserData, toast]);

  const handleManualLocationSearch = useCallback(() => {
    if (!manualLocation.trim()) {
      toast({ title: "Missing Information", description: "Please enter a city name.", variant: "destructive"});
      return;
    }
    updateUserData({ locationCity: manualLocation.trim() });
    setGyms(mockGyms); // Simulate finding gyms based on city
    setShowGyms(true);
    toast({ title: "Location Set", description: `Showing gyms for ${manualLocation.trim()}.` });
  }, [manualLocation, updateUserData, toast]);

  const getWorkoutPlans = useCallback(() => {
    return mockWorkoutPlans;
  }, []);

  const getGyms = useCallback(() => {
    return mockGyms;
  }, []);

  return {
    // State
    locationPermission,
    manualLocation,
    gyms,
    showGyms,
    // Actions
    requestLocation,
    setManualLocation,
    handleManualLocationSearch,
    getWorkoutPlans,
    getGyms,
  };
}
