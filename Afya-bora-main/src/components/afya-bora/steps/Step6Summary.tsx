"use client";

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, UserCircle, Apple, ShoppingBag, HeartPulse, BarChart3, Share2, Edit3, Download, AlertCircle, Info } from 'lucide-react';
import type { UserData, DietPlan, WorkoutPlan, StepId } from '@/types/afya-bora'; // Assuming WorkoutPlan type is defined
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getOrCreateUserId } from '@/lib/user';
import { deleteUserData } from '@/lib/firestore';
import HealthDataUpdate from '../HealthDataUpdate';
// Shadcn charts: Bar, Line, Pie
import { BarChart, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';


interface Step6SummaryProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  // selectedWorkoutPlan?: WorkoutPlan | null; // Add this if workout selection is implemented
  navigateToPrevStep: () => void;
  navigateToStep: (stepId: StepId) => void; // For "Update My Info"
  updateUserData: (data: Partial<UserData>) => void;
}

// Helper function to generate chart data from user data
const generateChartData = (userData: UserData) => {
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
      fbs: userData.initialBloodSugar.fbs, 
      ppbs: userData.initialBloodSugar.ppbs 
    });
  }
  
  if (userData.initialBloodPressure?.systolic || userData.initialBloodPressure?.diastolic) {
    bloodPressureData.push({ 
      date: 'Initial', 
      systolic: userData.initialBloodPressure.systolic, 
      diastolic: userData.initialBloodPressure.diastolic 
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
        fbs: reading.fbs, 
        ppbs: reading.ppbs 
      });
    });
  }
  
  if (userData.bloodPressureReadings && userData.bloodPressureReadings.length > 0) {
    userData.bloodPressureReadings.forEach((reading, index) => {
      bloodPressureData.push({ 
        date: `Week ${index + 1}`, 
        systolic: reading.systolic, 
        diastolic: reading.diastolic 
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
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const Step6Summary: React.FC<Step6SummaryProps> = ({
  userData,
  dietPlan,
  navigateToPrevStep,
  navigateToStep,
  updateUserData,
}) => {
  const { toast } = useToast();
  const userId = getOrCreateUserId();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Generate chart data from user data
  const chartData = generateChartData(userData);
  
  const handleShareReport = async () => {
    let reportText = `Afya Bora Health Summary:\n\n`;
    reportText += `== Personal Profile ==\n`;
    reportText += `Age: ${userData.age || 'N/A'} years\n`;
    reportText += `Weight: ${userData.weight || 'N/A'} ${userData.weightUnit || ''}\n`;
    reportText += `Allergies: ${userData.foodAllergies || 'None'}\n`;
    reportText += `Conditions: ${userData.chronicConditions || 'None'}\n\n`;

    if (dietPlan) {
      reportText += `== Diet Plan Summary ==\n`;
      reportText += `(Full 7-day plan details available in app)\n`;
      reportText += `Shopping List Items: ${dietPlan.shoppingList?.map(i => i.item).join(', ') || 'N/A'}\n\n`;
    } else {
      reportText += `== Diet Plan Summary ==\nNo diet plan generated.\n\n`;
    }
    
    // reportText += `== Workout Plan ==\n`;
    // reportText += `${selectedWorkoutPlan ? selectedWorkoutPlan.title : 'No workout plan selected.'}\n\n`;

    // Placeholder for PDF export. For now, share text.
    toast({ title: "Share Report", description: "PDF export is a premium feature (simulated). Sharing text summary instead."});

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Afya Bora Health Report', text: reportText });
      } catch (error) {
        toast({ title: "Sharing Failed", variant: "destructive" });
      }
    } else {
      navigator.clipboard.writeText(reportText)
        .then(() => toast({ title: "Report Copied", description: "Health report summary copied to clipboard." }))
        .catch(() => toast({ title: "Copy Failed", variant: "destructive" }));
    }
  };

  const SummarySection: React.FC<{title: string; icon: React.ElementType; children: React.ReactNode}> = ({title, icon: Icon, children}) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
        <Icon className="mr-2 h-5 w-5" /> {title}
      </h3>
      <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md space-y-1">
        {children}
      </div>
    </div>
  );


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
            <TabsTrigger value="overview" className="text-xs sm:text-sm"><UserCircle className="mr-1 h-4 w-4 sm:mr-2"/>Overview</TabsTrigger>
            <TabsTrigger value="diet" className="text-xs sm:text-sm"><Apple className="mr-1 h-4 w-4 sm:mr-2"/>Diet</TabsTrigger>
            {/* <TabsTrigger value="fitness"><Bike className="mr-2"/>Fitness</TabsTrigger> */}
            <TabsTrigger value="stats" className="text-xs sm:text-sm"><BarChart3 className="mr-1 h-4 w-4 sm:mr-2"/>Statistics</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs sm:text-sm"><HeartPulse className="mr-1 h-4 w-4 sm:mr-2"/>Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SummarySection title="Personal Profile" icon={UserCircle}>
              <p><strong>Age:</strong> {userData.age || 'N/A'} years</p>
              <p><strong>Weight:</strong> {userData.weight || 'N/A'} {userData.weightUnit || ''}</p>
              <p><strong>Activity Level:</strong> {userData.activityLevel?.replace('_', ' ') || 'N/A'}</p>
              <p><strong>Food Allergies:</strong> {userData.foodAllergies || 'None specified'}</p>
              <p><strong>Chronic Conditions:</strong> {userData.chronicConditions || 'None specified'}</p>
              <p><strong>Prescription:</strong> {userData.prescriptionText ? 'View in Diet Plan section' : 'Not provided'}</p>
            </SummarySection>
          </TabsContent>

          <TabsContent value="diet">
            {dietPlan ? (
              <>
                <SummarySection title="Diet Plan" icon={Apple}>
                  <p>Your 7-day personalized diet plan is available. Key highlights:</p>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Focuses on: Local Tanzanian produce.</li>
                    <li>Respects: Doctor's prescription and your inputs.</li>
                    <li>Includes: Portion sizes and preparation tips.</li>
                  </ul>
                  <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigateToStep('diet_plan')}>
                    View Full Diet Plan
                  </Button>
                </SummarySection>
                <SummarySection title="Shopping List" icon={ShoppingBag}>
                  <p>Key items for this week:</p>
                  <ul className="list-disc list-inside ml-4 mt-1 max-h-20 overflow-y-auto">
                    {dietPlan.shoppingList?.slice(0, 5).map(item => <li key={item.item}>{item.item}</li>)}
                    {dietPlan.shoppingList?.length > 5 && <li>...and more</li>}
                  </ul>
                   <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigateToStep('marketplace')}>
                    Go to Marketplace
                  </Button>
                </SummarySection>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Diet Plan Available</AlertTitle>
                <AlertDescription>
                  A diet plan has not been generated yet. Please complete the previous steps.
                  <Button variant="link" className="block p-0 h-auto text-primary mt-1" onClick={() => navigateToStep('prescription_patient_data')}>
                    Go to Patient Data
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          {/* Fitness tab can be added here similarly if selectedWorkoutPlan is available */}

          <TabsContent value="stats">
            <SummarySection title="Health Statistics" icon={BarChart3}>
              <p className="mb-2 text-muted-foreground">Track your health trends. (Note: Charts use sample data for now. Feature to input data coming soon!)</p>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold mb-1">Weekly Weight Trend (kg)</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData.weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10}/>
                      <YAxis fontSize={10} domain={['dataMin - 2', 'dataMax + 2']}/>
                      <ChartTooltip contentStyle={{fontSize: '10px', padding: '2px 5px'}}/>
                      <Legend wrapperStyle={{fontSize: '10px'}}/>
                      <Line type="monotone" dataKey="weight" stroke={COLORS[0]} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-1">Blood Sugar Readings (mg/dL)</h4>
                   <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData.bloodSugarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10}/>
                      <YAxis fontSize={10}/>
                      <ChartTooltip contentStyle={{fontSize: '10px', padding: '2px 5px'}}/>
                      <Legend wrapperStyle={{fontSize: '10px'}}/>
                      <Bar dataKey="fbs" fill={COLORS[1]} name="Fasting" />
                      <Bar dataKey="ppbs" fill={COLORS[2]} name="Postprandial" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                 <div>
                  <h4 className="text-md font-semibold mb-1">Blood Pressure Trend (mmHg)</h4>
                   <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData.bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={10}/>
                      <YAxis fontSize={10} domain={['dataMin - 10', 'dataMax + 10']}/>
                      <ChartTooltip contentStyle={{fontSize: '10px', padding: '2px 5px'}}/>
                      <Legend wrapperStyle={{fontSize: '10px'}}/>
                      <Line type="monotone" dataKey="systolic" stroke={COLORS[3]} name="Systolic" />
                      <Line type="monotone" dataKey="diastolic" stroke={COLORS[0]} name="Diastolic" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Alert variant="default" className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Health Tracking Active</AlertTitle>
                <AlertDescription>Charts now display your actual health data. Update your measurements weekly in the "Update My Info" section to track your progress.</AlertDescription>
              </Alert>
            </SummarySection>
          </TabsContent>

          <TabsContent value="actions">
             <SummarySection title="Actions" icon={HeartPulse}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button onClick={handleShareReport} variant="outline" className="w-full text-sm">
                        <Share2 className="mr-2 h-4 w-4" /> Share Report
                    </Button>
                    <Button onClick={() => navigateToStep('prescription_patient_data')} variant="outline" className="w-full text-sm">
                        <Edit3 className="mr-2 h-4 w-4" /> Update My Info
                    </Button>
                     <Button onClick={() => navigateToStep('prescription_patient_data')} variant="outline" className="w-full text-sm">
                        <Edit3 className="mr-2 h-4 w-4" /> Update Prescription
                    </Button>
                    <HealthDataUpdate userData={userData} updateUserData={updateUserData} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full text-sm" disabled={isDeleting}>
                          {isDeleting ? 'Deleting...' : 'Delete My Account'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete account and data?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove your profile, OCR history, diet plans and orders from our database. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              setIsDeleting(true);
                              try {
                                await deleteUserData(userId);
                                window.localStorage.removeItem('afyaBoraUserId');
                                toast({ title: 'Account Deleted', description: 'Your data has been removed.' });
                                // Reload to reset all client state
                                window.location.href = '/';
                              } catch (e) {
                                console.error(e);
                                toast({ title: 'Delete Failed', description: 'Could not delete your data. Please try again.', variant: 'destructive' });
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                          >
                            Confirm Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
             </SummarySection>
              <div className="text-xs text-muted-foreground mt-4">
                <p>Afya Bora is committed to your privacy. All data is handled securely. You can manage your data preferences at any time.</p>
              </div>
          </TabsContent>

        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-start gap-4 pt-6">
        <Button variant="outline" onClick={navigateToPrevStep} className="w-full sm:w-auto text-base py-3">
          Back to Gyms & Workouts
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Step6Summary;
