
import React, { useEffect, useState, CSSProperties } from 'react';
import type { EmotionState } from '../types';
import { EMOTION_CONFIG } from '../constants';

interface DynamicBackgroundProps {
  emotion: EmotionState | null;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ emotion }) => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState | null>(null);
  
  useEffect(() => {
    if (emotion) {
      setCurrentEmotion(emotion);
    }
  }, [emotion]);

  const emotionConfig = currentEmotion ? EMOTION_CONFIG[currentEmotion.label] : null;
  const fromColor = emotionConfig?.gradientFrom || 'from-gray-900';
  const toColor = emotionConfig?.gradientTo || 'to-black';

  // Base animation on stability
  const animationClass = currentEmotion && currentEmotion.stability < 40 ? 'animate-pulse-fast'
                       : currentEmotion && currentEmotion.stability < 80 ? 'animate-pulse-strong'
                       : 'animate-pulse';
  
  // Base opacity on intensity
  const intensityOpacity = currentEmotion ? 15 + (currentEmotion.intensity / 100) * 20 : 0; // Opacity from 15% to 35%
  
  // FIX: Cast style object to CSSProperties to allow for CSS custom properties like '--glow-opacity'.
  const style = {
    '--glow-opacity': `${intensityOpacity}%`,
    transition: 'opacity 3000ms ease-in-out, background 3000ms ease-in-out',
  } as CSSProperties;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-900">
      <div 
        style={style}
        className={`absolute -top-1/4 left-1/4 w-1/2 h-3/4 rounded-full bg-gradient-to-br ${fromColor} ${toColor} blur-3xl opacity-[var(--glow-opacity)] ${animationClass} transition-all duration-2000`}
      />
       <div 
        style={style}
        className={`absolute -bottom-1/4 right-1/4 w-1/2 h-3/4 rounded-full bg-gradient-to-tl ${fromColor} ${toColor} blur-3xl opacity-[var(--glow-opacity)] ${animationClass} [animation-delay:-1.5s] transition-all duration-2000`}
      />
      
      <div className="absolute inset-0 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>

      {/* Add custom keyframes for animations */}
      <style>{`
        @keyframes pulse-strong {
          50% { transform: scale(1.1); opacity: var(--glow-opacity); }
        }
        .animate-pulse-strong { animation: pulse-strong 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        @keyframes pulse-fast {
          50% { transform: scale(1.05); opacity: calc(var(--glow-opacity) * 0.8); }
        }
        .animate-pulse-fast { animation: pulse-fast 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};
