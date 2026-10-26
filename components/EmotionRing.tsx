
import React from 'react';
// FIX: Replaced non-existent 'Aura' type with 'EmotionState' to align with the application's data model.
import type { EmotionState } from '../types';
// FIX: Replaced non-existent 'AURA_HUES' constant with 'EMOTION_CONFIG' to use available constants.
import { EMOTION_CONFIG } from '../constants';

interface EmotionRingProps {
  // FIX: Changed prop to 'emotion: EmotionState' for consistency.
  emotion: EmotionState | null;
}

export const EmotionRing: React.FC<EmotionRingProps> = ({ emotion }) => {
  // FIX: Derived display properties from the emotion object using EMOTION_CONFIG.
  const emotionConfig = emotion ? EMOTION_CONFIG[emotion.label] : null;
  const color = emotionConfig?.color || 'gray-600';
  const gradientFrom = emotionConfig?.gradientFrom || 'from-gray-700';
  const gradientTo = emotionConfig?.gradientTo || 'to-gray-600';
  const name = emotion ? emotion.label : 'Initializing';

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={`absolute w-full h-full rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} transition-all duration-1000 ease-in-out animate-pulse opacity-20 blur-xl`}
        key={`${name}-blur`}
      />
      <div className="absolute w-full h-full rounded-full animate-spin-slow">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 rounded-full bg-white/20 shadow-lg`} />
      </div>
      <div
        className={`w-[calc(100%+20px)] h-[calc(100%+20px)] rounded-full border-4 border-transparent transition-all duration-1000 ease-in-out`}
        style={{
          // FIX: Use derived color and check for emotion object existence.
          borderColor: emotion ? `var(--tw-color-${color})` : '#4b5563',
          boxShadow: emotion ? `0 0 20px var(--tw-color-${color})` : 'none',
        }}
        key={`${name}-ring`}
      >
      </div>
      <div className={`absolute bottom-0 mb-[-3rem] lg:mb-[-3.5rem] bg-gray-800/50 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium transition-opacity duration-500 ${emotion ? 'opacity-100' : 'opacity-0'}`}>
        <span className={`text-${color} transition-colors duration-1000`}>
          {emotion ? name : 'Initializing'}
        </span>
      </div>
    </div>
  );
};
