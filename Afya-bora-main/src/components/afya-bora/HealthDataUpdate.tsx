"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Target, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { UserData } from '@/types/afya-bora';
import { saveUserProfile } from '@/lib/firestore';
import { getOrCreateUserId } from '@/lib/user';

interface HealthDataUpdateProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
}

const HealthDataUpdate: React.FC<HealthDataUpdateProps> = ({ userData, updateUserData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(userData.weightUnit || 'kg');
  const [fbs, setFbs] = useState('');
  const [ppbs, setPpbs] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    const userId = getOrCreateUserId();
    const today = new Date().toISOString().split('T')[0];

    try {
      const newData: Partial<UserData> = {};

      // Update weight if provided
      if (weight) {
        const weightNum = parseFloat(weight);
        newData.dailyWeightEntries = [
          ...(userData.dailyWeightEntries || []),
          { date: today, weight: weightNum, unit: weightUnit }
        ];
      }

      // Update blood sugar if provided
      if (fbs || ppbs) {
        newData.bloodSugarReadings = [
          ...(userData.bloodSugarReadings || []),
          { 
            date: today, 
            fbs: fbs ? parseFloat(fbs) : undefined,
            ppbs: ppbs ? parseFloat(ppbs) : undefined
          }
        ];
      }

      // Update blood pressure if provided
      if (systolic || diastolic) {
        newData.bloodPressureReadings = [
          ...(userData.bloodPressureReadings || []),
          { 
            date: today, 
            systolic: systolic ? parseInt(systolic) : undefined,
            diastolic: diastolic ? parseInt(diastolic) : undefined
          }
        ];
      }

      // Save to database
      await saveUserProfile(userId, newData);
      
      // Update local state
      updateUserData(newData);

      toast({
        title: "Health Data Updated",
        description: "Your weekly health measurements have been recorded successfully.",
      });

      setIsOpen(false);
      // Reset form
      setWeight('');
      setFbs('');
      setPpbs('');
      setSystolic('');
      setDiastolic('');
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save your health data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = weight || fbs || ppbs || systolic || diastolic;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-sm">
          <Target className="mr-2 h-4 w-4" /> Update Weekly Measurements
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Health Update
          </DialogTitle>
          <DialogDescription>
            Record your current health measurements for this week. Leave fields empty if you don't have the data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="update-weight">Weight</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="update-weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                className="px-3 py-2 border border-input rounded-md text-sm"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="update-fbs">Fasting Blood Sugar (mg/dL)</Label>
              <Input
                id="update-fbs"
                type="number"
                step="0.1"
                placeholder="e.g., 90"
                value={fbs}
                onChange={(e) => setFbs(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-ppbs">Postprandial Blood Sugar (mg/dL)</Label>
              <Input
                id="update-ppbs"
                type="number"
                step="0.1"
                placeholder="e.g., 130"
                value={ppbs}
                onChange={(e) => setPpbs(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="update-systolic">Systolic BP (mmHg)</Label>
              <Input
                id="update-systolic"
                type="number"
                placeholder="e.g., 120"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-diastolic">Diastolic BP (mmHg)</Label>
              <Input
                id="update-diastolic"
                type="number"
                placeholder="e.g., 80"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
              />
            </div>
          </div>

          {!hasData && (
            <Alert>
              <AlertDescription>
                Please enter at least one measurement to update your health data.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !hasData}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Measurements'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HealthDataUpdate;
