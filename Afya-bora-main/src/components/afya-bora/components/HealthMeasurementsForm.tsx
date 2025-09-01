import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Target } from 'lucide-react';

interface HealthMeasurementsFormProps {
  initialWeight: string;
  initialWeightUnit: 'kg' | 'lbs';
  initialFBS: string;
  initialPPBS: string;
  initialSystolic: string;
  initialDiastolic: string;
  onInitialWeightChange: (value: string) => void;
  onInitialWeightUnitChange: (value: 'kg' | 'lbs') => void;
  onInitialFBSChange: (value: string) => void;
  onInitialPPBSChange: (value: string) => void;
  onInitialSystolicChange: (value: string) => void;
  onInitialDiastolicChange: (value: string) => void;
  disabled: boolean;
}

export function HealthMeasurementsForm({
  initialWeight,
  initialWeightUnit,
  initialFBS,
  initialPPBS,
  initialSystolic,
  initialDiastolic,
  onInitialWeightChange,
  onInitialWeightUnitChange,
  onInitialFBSChange,
  onInitialPPBSChange,
  onInitialSystolicChange,
  onInitialDiastolicChange,
  disabled,
}: HealthMeasurementsFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-semibold text-primary flex items-center">
          <Target className="mr-2 h-5 w-5" /> 
          3. Initial Health Measurements
        </h2>
        <p className="text-sm text-muted-foreground">
          Record your current health metrics. You'll be prompted weekly to update these for tracking progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="initial-weight" className="text-sm">Initial Weight</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="initial-weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                value={initialWeight}
                onChange={(e) => onInitialWeightChange(e.target.value)}
                className="w-full text-sm"
                disabled={disabled}
              />
              <RadioGroup 
                defaultValue={initialWeightUnit} 
                onValueChange={(value: 'kg' | 'lbs') => onInitialWeightUnitChange(value)} 
                className="flex" 
                disabled={disabled}
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="kg" id="initial-kg" />
                  <Label htmlFor="initial-kg" className="text-xs">kg</Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="lbs" id="initial-lbs" />
                  <Label htmlFor="initial-lbs" className="text-xs">lbs</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="current-weight" className="text-sm">Current Weight (for diet plan)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="current-weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                value={initialWeight}
                onChange={(e) => onInitialWeightChange(e.target.value)}
                className="w-full text-sm"
                disabled={disabled}
              />
              <RadioGroup 
                defaultValue={initialWeightUnit} 
                onValueChange={(value: 'kg' | 'lbs') => onInitialWeightUnitChange(value)} 
                className="flex" 
                disabled={disabled}
              >
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="kg" id="current-kg" />
                  <Label htmlFor="current-kg" className="text-xs">kg</Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="lbs" id="current-lbs" />
                  <Label htmlFor="current-lbs" className="text-xs">lbs</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fbs" className="text-sm">Fasting Blood Sugar (mg/dL)</Label>
            <Input
              id="fbs"
              type="number"
              step="0.1"
              placeholder="e.g., 90"
              value={initialFBS}
              onChange={(e) => onInitialFBSChange(e.target.value)}
              className="w-full text-sm"
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ppbs" className="text-sm">Postprandial Blood Sugar (mg/dL)</Label>
            <Input
              id="ppbs"
              type="number"
              step="0.1"
              placeholder="e.g., 130"
              value={initialPPBS}
              onChange={(e) => onInitialPPBSChange(e.target.value)}
              className="w-full text-sm"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="systolic" className="text-sm">Systolic Blood Pressure (mmHg)</Label>
            <Input
              id="systolic"
              type="number"
              placeholder="e.g., 120"
              value={initialSystolic}
              onChange={(e) => onInitialSystolicChange(e.target.value)}
              className="w-full text-sm"
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="diastolic" className="text-sm">Diastolic Blood Pressure (mmHg)</Label>
            <Input
              id="diastolic"
              type="number"
              placeholder="e.g., 80"
              value={initialDiastolic}
              onChange={(e) => onInitialDiastolicChange(e.target.value)}
              className="w-full text-sm"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground pt-4">
        <p>These measurements will be used to track your health progress over time. You can update them weekly in the Summary section.</p>
      </div>
    </div>
  );
}
