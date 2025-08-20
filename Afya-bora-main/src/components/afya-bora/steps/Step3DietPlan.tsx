"use client";

import type React from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Salad, AlertCircle, Loader2, Share2, Utensils, CalendarDays } from 'lucide-react';
import type { UserData, DietPlan, GenerateDietPlanInput, DailyPlan, Meal } from '@/types/afya-bora';
import { getGeneratedDietPlan } from '@/app/actions'; // Server action to call AI
import { useToast } from '@/hooks/use-toast';
import { getOrCreateUserId, ensureAnonymousAuth } from '@/lib/user';
import { saveDietPlan } from '@/lib/firestore';

interface Step3DietPlanProps {
  userData: UserData;
  dietPlan: DietPlan | null;
  setDietPlan: (plan: DietPlan | null) => void;
  navigateToNextStep: () => void;
  navigateToPrevStep: () => void;
  setErrorMessage: (message: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const Step3DietPlan: React.FC<Step3DietPlanProps> = ({
  userData,
  dietPlan,
  setDietPlan,
  navigateToNextStep,
  navigateToPrevStep,
  setErrorMessage,
  isLoading,
  setIsLoading,
}) => {
  const { toast } = useToast();
  const userId = getOrCreateUserId();

  useEffect(() => {
    ensureAnonymousAuth().catch(err => console.error('Anonymous auth failed', err));
  }, []);

  useEffect(() => {
    const generatePlan = async () => {
      if (!userData.age || !userData.weight || !userData.activityLevel) {
        // Data not ready, or user came directly to this step
        setErrorMessage("User data is incomplete. Please go back to the previous step.");
        setIsLoading(false);
        return;
      }
      if (dietPlan) { // Plan already generated
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      let weightInKg = userData.weight;
      if (userData.weightUnit === 'lbs') {
        weightInKg = userData.weight * 0.453592;
      }
      
      const input: GenerateDietPlanInput = {
        prescriptionText: userData.prescriptionText || "No prescription provided.",
        foodAllergies: userData.foodAllergies || "none",
        chronicConditions: userData.chronicConditions || "none",
        age: userData.age,
        weightKg: weightInKg,
        activityLevel: userData.activityLevel,
        // preferences and calorieTarget could be added later if form fields are created
      };

      const result = await getGeneratedDietPlan(input);

      if ('error' in result) {
        setErrorMessage(result.error);
        setDietPlan(null);
         toast({
          title: "Error Generating Plan",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setDietPlan(result);
        try {
          const planId = await saveDietPlan(userId, result);
          console.log('Saved diet plan with id', planId);
        } catch (e) {
          console.error('Failed to save diet plan:', e);
        }
        toast({
          title: "Diet Plan Generated!",
          description: "Your personalized diet plan is ready.",
        });
      }
      setIsLoading(false);
    };

    generatePlan();
  }, [userData, setIsLoading, setErrorMessage, setDietPlan, toast, dietPlan]);

  const handleShare = async () => {
    if (!dietPlan) return;
    const shareText = `My Afya Bora Diet Plan:\n\n${dietPlan.weeklyPlan.map(day => 
      `${day.day}:\n` +
      `  Morning: ${day.meals.morning.nameSw} (${day.meals.morning.nameEn})\n` +
      `  Lunch: ${day.meals.lunch.nameSw} (${day.meals.lunch.nameEn})\n` +
      `  Dinner: ${day.meals.dinner.nameSw} (${day.meals.dinner.nameEn})\n`
    ).join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Afya Bora Diet Plan',
          text: shareText,
        });
        toast({ title: "Plan Shared", description: "Diet plan shared successfully." });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({ title: "Sharing Failed", description: "Could not share the plan.", variant: "destructive" });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText)
        .then(() => toast({ title: "Plan Copied", description: "Diet plan copied to clipboard." }))
        .catch(() => toast({ title: "Copy Failed", description: "Could not copy plan to clipboard.", variant: "destructive" }));
    }
  };
  
  const renderMeal = (mealName: string, meal?: Meal) => {
    if (!meal) return <p className="text-sm text-muted-foreground">Not specified</p>;
    return (
      <div className="mb-3 pl-2 border-l-2 border-accent">
        <h4 className="font-semibold text-primary">{mealName}</h4>
        <p className="text-sm font-medium">{meal.nameSw} ({meal.nameEn})</p>
        <ul className="list-disc list-inside text-xs text-muted-foreground ml-2">
          {meal.ingredients.map((ing, i) => <li key={i}>{ing.name}: {ing.quantity}</li>)}
        </ul>
        {meal.preparation && <p className="text-xs mt-1 italic">Tip: {meal.preparation}</p>}
      </div>
    );
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] w-full max-w-3xl">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-xl font-semibold text-foreground">Generating your personalized diet plan...</p>
        <p className="text-muted-foreground">This might take a moment. Thank you for your patience.</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Salad className="mr-2 h-7 w-7 text-primary" />
          Your Personalized Diet Plan
        </CardTitle>
        <CardDescription>
          Here is your 7-day meal plan. Remember to consult your doctor for any major dietary changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!dietPlan && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Plan Generation Failed</AlertTitle>
            <AlertDescription>{dietPlan === null ? "Could not generate your diet plan. Please try again or check previous steps for errors." : "An error occurred."}</AlertDescription>
          </Alert>
        )}

        {dietPlan && (
          <ScrollArea className="h-[calc(100vh-400px)] pr-4"> {/* Adjust height as needed */}
            <Accordion type="single" collapsible className="w-full space-y-2">
              {dietPlan.weeklyPlan.map((dailyPlan, index) => (
                <AccordionItem value={`day-${index}`} key={index} className="bg-background rounded-lg border">
                  <AccordionTrigger className="px-4 py-3 text-base hover:no-underline">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                      {dailyPlan.day}
                      {dailyPlan.totalCalories && <Badge variant="outline" className="ml-3">{dailyPlan.totalCalories} kcal</Badge>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-0 pb-3 space-y-2">
                    {renderMeal("Morning (Kifungua Kinywa)", dailyPlan.meals.morning)}
                    {renderMeal("Mid-Morning Snack (Kitafunwa)", dailyPlan.meals.midMorningSnack)}
                    {renderMeal("Lunch (Chakula cha Mchana)", dailyPlan.meals.lunch)}
                    {renderMeal("Afternoon Snack (Kitafunwa)", dailyPlan.meals.afternoonSnack)}
                    {renderMeal("Dinner (Chakula cha Jioni)", dailyPlan.meals.dinner)}
                    {dailyPlan.meals.optionalBedtimeSnack && renderMeal("Optional Bedtime Snack", dailyPlan.meals.optionalBedtimeSnack)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {dietPlan.generalTipsSw && dietPlan.generalTipsSw.length > 0 && (
                <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary mb-2 flex items-center"><Utensils className="mr-2 h-5 w-5" />General Tips (Swahili)</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                        {dietPlan.generalTipsSw.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </div>
            )}
            
            {dietPlan.substitutions && dietPlan.substitutions.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary mb-2">Ingredient Substitutions</h3>
                    <ul className="space-y-1 text-sm text-foreground">
                        {dietPlan.substitutions.map((sub, i) => (
                            <li key={i}>
                                <strong>{sub.originalItemEn} ({sub.originalItemSw})</strong>: Try {sub.suggestionEn} ({sub.suggestionSw})
                                {sub.reason && <span className="text-xs italic"> ({sub.reason})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
        <Button variant="outline" onClick={navigateToPrevStep} className="w-full sm:w-auto text-base py-3">
          Back to Your Info
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {dietPlan && (
          <Button variant="outline" onClick={handleShare} className="w-full sm:w-auto text-base py-3">
            <Share2 className="mr-2 h-5 w-5" /> Share Plan
          </Button>
        )}
        <Button onClick={navigateToNextStep} disabled={!dietPlan} className="w-full sm:w-auto text-base py-3" size="lg">
          Go to Marketplace
        </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Step3DietPlan;
