import { useMemo } from 'react';
import type { UserData } from '@/types/afya-bora';

export interface ChartData {
  weightData: Array<{ date: string; weight: number }>;
  bloodSugarData: Array<{ date: string; fbs: number; ppbs: number }>;
  bloodPressureData: Array<{ date: string; systolic: number; diastolic: number }>;
}

export function useSummaryCharts(userData: UserData): ChartData {
  return useMemo(() => {
    const weightData = [];
    const bloodSugarData = [];
    const bloodPressureData = [];
    
    // Add initial data if available
    if (userData.initialWeight) {
      weightData.push({ 
        date: 'Initial', 
        weight: userData.initialWeight 
      });
    }
    
    if (userData.initialBloodSugar?.fbs || userData.initialBloodSugar?.ppbs) {
      bloodSugarData.push({ 
        date: 'Initial', 
        fbs: userData.initialBloodSugar.fbs || 0, 
        ppbs: userData.initialBloodSugar.ppbs || 0
      });
    }
    
    if (userData.initialBloodPressure?.systolic || userData.initialBloodPressure?.diastolic) {
      bloodPressureData.push({ 
        date: 'Initial', 
        systolic: userData.initialBloodPressure.systolic || 0, 
        diastolic: userData.initialBloodPressure.diastolic || 0
      });
    }
    
    // Add weekly tracking data if available
    if (userData.dailyWeightEntries && userData.dailyWeightEntries.length > 0) {
      userData.dailyWeightEntries.forEach((entry, index) => {
        weightData.push({ 
          date: `Week ${index + 1}`, 
          weight: entry.weight 
        });
      });
    }
    
    if (userData.bloodSugarReadings && userData.bloodSugarReadings.length > 0) {
      userData.bloodSugarReadings.forEach((reading, index) => {
        bloodSugarData.push({ 
          date: `Week ${index + 1}`, 
          fbs: reading.fbs || 0, 
          ppbs: reading.ppbs || 0
        });
      });
    }
    
    if (userData.bloodPressureReadings && userData.bloodPressureReadings.length > 0) {
      userData.bloodPressureReadings.forEach((reading, index) => {
        bloodPressureData.push({ 
          date: `Week ${index + 1}`, 
          systolic: reading.systolic || 0, 
          diastolic: reading.diastolic || 0
        });
      });
    }
    
    // If no data available, return empty arrays
    return {
      weightData: weightData.length > 0 ? weightData : [
        { date: 'No Data', weight: 0 }
      ],
      bloodSugarData: bloodSugarData.length > 0 ? bloodSugarData : [
        { date: 'No Data', fbs: 0, ppbs: 0 }
      ],
      bloodPressureData: bloodPressureData.length > 0 ? bloodPressureData : [
        { date: 'No Data', systolic: 0, diastolic: 0 }
      ]
    };
  }, [userData]);
}
