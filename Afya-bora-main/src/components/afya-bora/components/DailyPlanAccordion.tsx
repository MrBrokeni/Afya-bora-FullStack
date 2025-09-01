import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import type { DailyPlan } from '@/types/afya-bora';
import { MealDisplay } from './MealDisplay';

interface DailyPlanAccordionProps {
  weeklyPlan: DailyPlan[];
}

export function DailyPlanAccordion({ weeklyPlan }: DailyPlanAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {weeklyPlan.map((dailyPlan, index) => (
        <AccordionItem value={`day-${index}`} key={index} className="bg-background rounded-lg border">
          <AccordionTrigger className="px-4 py-3 text-base hover:no-underline">
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-primary" />
              {dailyPlan.day}
              {dailyPlan.totalCalories && (
                <Badge variant="outline" className="ml-3">{dailyPlan.totalCalories} kcal</Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-0 pb-3 space-y-2">
            <MealDisplay mealName="Morning (Kifungua Kinywa)" meal={dailyPlan.meals.morning} />
            <MealDisplay mealName="Mid-Morning Snack (Kitafunwa)" meal={dailyPlan.meals.midMorningSnack} />
            <MealDisplay mealName="Lunch (Chakula cha Mchana)" meal={dailyPlan.meals.lunch} />
            <MealDisplay mealName="Afternoon Snack (Kitafunwa)" meal={dailyPlan.meals.afternoonSnack} />
            <MealDisplay mealName="Dinner (Chakula cha Jioni)" meal={dailyPlan.meals.dinner} />
            {dailyPlan.meals.optionalBedtimeSnack && (
              <MealDisplay mealName="Optional Bedtime Snack" meal={dailyPlan.meals.optionalBedtimeSnack} />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
