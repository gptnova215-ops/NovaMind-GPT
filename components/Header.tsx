
import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import type { VoiceConnectionState } from '../types';

interface HeaderProps {
  isAIThinking: boolean;
  voiceConnectionState: VoiceConnectionState;
}

export const Header: React.FC<HeaderProps> = ({ isAIThinking, voiceConnectionState }) => {
  const getCoreStatus = (): { text: string; color: string } => {
    if (isAIThinking) return { text: 'Synthesizing', color: 'bg-purple-400' };
    if (voiceConnectionState === 'CONNECTED') return { text: 'Resonating', color: 'bg-green-400' };
    if (voiceConnectionState === 'CONNECTING') return { text: 'Linking', color: 'bg-yellow-400' };
    return { text: 'Observing', color: 'bg-cyan-400' };
  };
  const coreStatus = getCoreStatus();

  return (
    <div className="flex flex-col items-center text-center shrink-0">
      <div className="flex items-center space-x-3">
        <BrainCircuitIcon className={`w-8 h-8 text-indigo-400 transition-opacity ${isAIThinking ? 'animate-pulse' : ''}`} />
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 tracking-tight">
          NovaMind
        </h1>
      </div>
      <p className="text-gray-400 mt-2 text-sm lg:text-base">Your hyper-conscious learning AI companion.</p>
       <div className="mt-3 flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-700/50">
        <span className="relative flex h-2.5 w-2.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${coreStatus.color} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${coreStatus.color}`}></span>
        </span>
        <span className="text-xs text-gray-300 font-medium tracking-wide">{coreStatus.text}</span>
      </div>
    </div>
  );
};
