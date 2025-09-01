import React from 'react';
import { UserCircle } from 'lucide-react';
import type { UserData } from '@/types/afya-bora';
import { SummarySection } from './SummarySection';

interface OverviewTabProps {
  userData: UserData;
}

export function OverviewTab({ userData }: OverviewTabProps) {
  return (
    <SummarySection title="Personal Profile" icon={UserCircle}>
      <p><strong>Age:</strong> {userData.age || 'N/A'} years</p>
      <p><strong>Weight:</strong> {userData.weight || 'N/A'} {userData.weightUnit || ''}</p>
      <p><strong>Activity Level:</strong> {userData.activityLevel?.replace('_', ' ') || 'N/A'}</p>
      <p><strong>Food Allergies:</strong> {userData.foodAllergies || 'None specified'}</p>
      <p><strong>Chronic Conditions:</strong> {userData.chronicConditions || 'None specified'}</p>
      <p><strong>Prescription:</strong> {userData.prescriptionText ? 'View in Diet Plan section' : 'Not provided'}</p>
    </SummarySection>
  );
}
