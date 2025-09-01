import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck } from 'lucide-react';

interface HealthInformationFormProps {
  foodAllergies: string;
  chronicConditions: string;
  age: string;
  weight: string;
  weightUnit: 'kg' | 'lbs';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | undefined;
  onFoodAllergiesChange: (value: string) => void;
  onChronicConditionsChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onWeightUnitChange: (value: 'kg' | 'lbs') => void;
  onActivityLevelChange: (value: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active') => void;
  formErrors: Record<string, string>;
  disabled: boolean;
}

export function HealthInformationForm({
  foodAllergies,
  chronicConditions,
  age,
  weight,
  weightUnit,
  activityLevel,
  onFoodAllergiesChange,
  onChronicConditionsChange,
  onAgeChange,
  onWeightChange,
  onWeightUnitChange,
  onActivityLevelChange,
  formErrors,
  disabled,
}: HealthInformationFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-semibold text-primary flex items-center">
          <UserCheck className="mr-2 h-5 w-5" /> 
          2. Your Health Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Help us personalize your plan by providing some health details.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor="food-allergies" className="text-sm">Food Allergies or Intolerances</Label>
          <Textarea
            id="food-allergies"
            placeholder="e.g., gluten, nuts, shellfish, lactose. Enter 'none' if no allergies."
            value={foodAllergies}
            onChange={(e) => onFoodAllergiesChange(e.target.value)}
            rows={2}
            className="w-full text-sm"
            disabled={disabled}
          />
          {formErrors.foodAllergies && <p className="text-xs text-destructive">{formErrors.foodAllergies}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="chronic-conditions" className="text-sm">Chronic Conditions or Diseases</Label>
          <Textarea
            id="chronic-conditions"
            placeholder="e.g., type 2 diabetes, hypertension, kidney disease. Enter 'none' if no conditions."
            value={chronicConditions}
            onChange={(e) => onChronicConditionsChange(e.target.value)}
            rows={2}
            className="w-full text-sm"
            disabled={disabled}
          />
          {formErrors.chronicConditions && <p className="text-xs text-destructive">{formErrors.chronicConditions}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-sm">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 35"
              value={age}
              onChange={(e) => onAgeChange(e.target.value)}
              className="w-full text-sm"
              disabled={disabled}
            />
            {formErrors.age && <p className="text-xs text-destructive">{formErrors.age}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weight" className="text-sm">Current Weight</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
                className="w-full text-sm"
                disabled={disabled}
              />
              <RadioGroup 
                defaultValue={weightUnit} 
                onValueChange={(value: 'kg' | 'lbs') => onWeightUnitChange(value)} 
                className="flex" 
                disabled={disabled}
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="kg" id="kg" />
                  <Label htmlFor="kg" className="text-xs">kg</Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="lbs" id="lbs" />
                  <Label htmlFor="lbs" className="text-xs">lbs</Label>
                </div>
              </RadioGroup>
            </div>
            {formErrors.weight && <p className="text-xs text-destructive">{formErrors.weight}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="activity-level" className="text-sm">Typical Daily Activity Level</Label>
          <Select 
            value={activityLevel} 
            onValueChange={(value: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active') => onActivityLevelChange(value)} 
            disabled={disabled}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (desk job, little to no exercise)</SelectItem>
              <SelectItem value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
              <SelectItem value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
              <SelectItem value="very_active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.activityLevel && <p className="text-xs text-destructive">{formErrors.activityLevel}</p>}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground pt-4">
        <p>Your data is encrypted and kept confidential. Prescription images are processed by AI and not stored long-term beyond operational needs.</p>
      </div>
    </div>
  );
}
