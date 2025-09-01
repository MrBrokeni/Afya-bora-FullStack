import React from 'react';
import Image from 'next/image';
import type { WorkoutExercise } from '@/types/afya-bora';

interface ExerciseDisplayProps {
  exercise: WorkoutExercise;
}

export function ExerciseDisplay({ exercise }: ExerciseDisplayProps) {
  return (
    <div className="flex items-start space-x-2 p-2 border-b text-xs">
      {exercise.videoUrl && (
        <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <Image 
            src={exercise.videoUrl} 
            alt={`Video for ${exercise.name}`} 
            width={80} 
            height={48} 
            className="rounded object-cover bg-muted"
            data-ai-hint="exercise tutorial"
          />
        </a>
      )}
      <div>
        <p className="font-semibold">{exercise.name}</p>
        <p className="text-muted-foreground">{exercise.setsReps}</p>
      </div>
    </div>
  );
}
