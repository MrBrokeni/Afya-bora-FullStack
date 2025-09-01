import React from 'react';
import type { Meal } from '@/types/afya-bora';

interface MealDisplayProps {
  mealName: string;
  meal?: Meal;
}

export function MealDisplay({ mealName, meal }: MealDisplayProps) {
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
}
