import { useState, useCallback } from 'react';
import type { UserData } from '@/types/afya-bora';

export interface PrescriptionFormState {
  files: File[];
  foodAllergies: string;
  chronicConditions: string;
  age: string;
  weight: string;
  weightUnit: 'kg' | 'lbs';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | undefined;
  initialWeight: string;
  initialWeightUnit: 'kg' | 'lbs';
  initialFBS: string;
  initialPPBS: string;
  initialSystolic: string;
  initialDiastolic: string;
  formErrors: Record<string, string>;
}

export interface PrescriptionFormActions {
  setFiles: (files: File[]) => void;
  setFoodAllergies: (value: string) => void;
  setChronicConditions: (value: string) => void;
  setAge: (value: string) => void;
  setWeight: (value: string) => void;
  setWeightUnit: (value: 'kg' | 'lbs') => void;
  setActivityLevel: (value: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active') => void;
  setInitialWeight: (value: string) => void;
  setInitialWeightUnit: (value: 'kg' | 'lbs') => void;
  setInitialFBS: (value: string) => void;
  setInitialPPBS: (value: string) => void;
  setInitialSystolic: (value: string) => void;
  setInitialDiastolic: (value: string) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  updateUserDataFromForm: (updateUserData: (data: Partial<UserData>) => void) => void;
}

export function usePrescriptionForm(userData: UserData): PrescriptionFormState & PrescriptionFormActions {
  const [files, setFiles] = useState<File[]>(userData.prescriptionFiles || []);
  const [foodAllergies, setFoodAllergies] = useState(userData.foodAllergies || '');
  const [chronicConditions, setChronicConditions] = useState(userData.chronicConditions || '');
  const [age, setAge] = useState<string>(userData.age?.toString() || '');
  const [weight, setWeight] = useState<string>(userData.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(userData.weightUnit || 'kg');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | undefined>(userData.activityLevel);
  
  // Health tracking data
  const [initialWeight, setInitialWeight] = useState<string>(userData.initialWeight?.toString() || '');
  const [initialWeightUnit, setInitialWeightUnit] = useState<'kg' | 'lbs'>(userData.initialWeightUnit || 'kg');
  const [initialFBS, setInitialFBS] = useState<string>(userData.initialBloodSugar?.fbs?.toString() || '');
  const [initialPPBS, setInitialPPBS] = useState<string>(userData.initialBloodSugar?.ppbs?.toString() || '');
  const [initialSystolic, setInitialSystolic] = useState<string>(userData.initialBloodPressure?.systolic?.toString() || '');
  const [initialDiastolic, setInitialDiastolic] = useState<string>(userData.initialBloodPressure?.diastolic?.toString() || '');
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const updateUserDataFromForm = useCallback((updateUserData: (data: Partial<UserData>) => void) => {
    updateUserData({
      prescriptionFiles: files,
      foodAllergies: foodAllergies.trim() || "none",
      chronicConditions: chronicConditions.trim() || "none",
      age: age ? parseInt(age) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      weightUnit: weightUnit,
      activityLevel: activityLevel,
      // Health tracking data
      initialWeight: initialWeight ? parseFloat(initialWeight) : undefined,
      initialWeightUnit: initialWeightUnit,
      initialBloodSugar: {
        fbs: initialFBS ? parseFloat(initialFBS) : undefined,
        ppbs: initialPPBS ? parseFloat(initialPPBS) : undefined,
      },
      initialBloodPressure: {
        systolic: initialSystolic ? parseInt(initialSystolic) : undefined,
        diastolic: initialDiastolic ? parseInt(initialDiastolic) : undefined,
      },
    });
  }, [
    files, foodAllergies, chronicConditions, age, weight, weightUnit, activityLevel,
    initialWeight, initialWeightUnit, initialFBS, initialPPBS, initialSystolic, initialDiastolic
  ]);

  return {
    // State
    files,
    foodAllergies,
    chronicConditions,
    age,
    weight,
    weightUnit,
    activityLevel,
    initialWeight,
    initialWeightUnit,
    initialFBS,
    initialPPBS,
    initialSystolic,
    initialDiastolic,
    formErrors,
    // Actions
    setFiles,
    setFoodAllergies,
    setChronicConditions,
    setAge,
    setWeight,
    setWeightUnit,
    setActivityLevel,
    setInitialWeight,
    setInitialWeightUnit,
    setInitialFBS,
    setInitialPPBS,
    setInitialSystolic,
    setInitialDiastolic,
    setFormErrors,
    updateUserDataFromForm,
  };
}
