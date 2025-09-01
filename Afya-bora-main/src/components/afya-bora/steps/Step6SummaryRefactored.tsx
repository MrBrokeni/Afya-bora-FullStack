"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, UserCircle, Apple, BarChart3, HeartPulse } from 'lucide-react';
import type { UserData, DietPlan, StepId } from '@/types/afya-bora';

// Custom hooks
import { useSummarySharing } from '@/lib/hooks/use-summary-sharing';
import { useSummaryCharts } from '@/lib/hooks/use-summary-charts';

// Components
import { OverviewTab } from '../components/OverviewTab';
import { DietTab } from '../components/DietTab';
import { StatisticsTab } from '../components/StatisticsTab';
import { ActionsTab } from '../components/ActionsTab';
import { SummaryActions } from '../components/SummaryActions';

interface Step6SummaryRefactoredProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  navigateToPrevStep: () => void;
  navigateToStep: (stepId: StepId) => void;
  updateUserData: (data: Partial<UserData>) => void;
}

const Step6SummaryRefactored: React.FC<Step6SummaryRefactoredProps> = ({
  userData,
  dietPlan,
  navigateToPrevStep,
  navigateToStep,
  updateUserData,
}) => {
  // Custom hooks
  const summarySharing = useSummarySharing();
  const chartData = useSummaryCharts(userData);

  // Handle share report
  const handleShareReport = () => {
    summarySharing.shareReport(userData, dietPlan);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <ClipboardCheck className="mr-2 h-7 w-7 text-primary" />
          My Health Summary
        </CardTitle>
        <CardDescription>
          Review your health information, diet plan, and statistics. Share your progress!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              <UserCircle className="mr-1 h-4 w-4 sm:mr-2"/>Overview
            </TabsTrigger>
            <TabsTrigger value="diet" className="text-xs sm:text-sm">
              <Apple className="mr-1 h-4 w-4 sm:mr-2"/>Diet
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-xs sm:text-sm">
              <BarChart3 className="mr-1 h-4 w-4 sm:mr-2"/>Statistics
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs sm:text-sm">
              <HeartPulse className="mr-1 h-4 w-4 sm:mr-2"/>Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab userData={userData} />
          </TabsContent>

          <TabsContent value="diet">
            <DietTab 
              userData={userData} 
              dietPlan={dietPlan} 
              navigateToStep={navigateToStep} 
            />
          </TabsContent>

          <TabsContent value="stats">
            <StatisticsTab chartData={chartData} />
          </TabsContent>

          <TabsContent value="actions">
            <ActionsTab
              userData={userData}
              navigateToStep={navigateToStep}
              updateUserData={updateUserData}
              onShareReport={handleShareReport}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <SummaryActions onNavigatePrev={navigateToPrevStep} />
    </Card>
  );
};

export default Step6SummaryRefactored;
