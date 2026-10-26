
import React from 'react';
import type { EmotionHistoryEntry, UserStateVector, VisualContext } from '../types';
import { EMOTION_CONFIG } from '../constants';
import { HeartbeatIcon } from './icons/HeartbeatIcon';
import { SignalIcon } from './icons/SignalIcon';

const VitalsCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; unit?: string; valueColor?: string }> = ({ icon, label, value, unit, valueColor = 'text-gray-100' }) => (
    <div className="bg-gray-800/50 p-2 rounded-lg flex items-center space-x-2">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-700/50 rounded-lg">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">{label}</p>
            <p className={`text-sm font-bold truncate ${valueColor}`}>
                {value}
                {unit && <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>}
            </p>
        </div>
    </div>
);

const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
    if (data.length < 2) return null;
    const width = 100;
    const height = 20;
    const max = Math.max(...data, 100);
    const min = 0;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d - min) / (max - min)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
            <polyline points={points} fill="none" stroke="rgba(167, 139, 250, 0.7)" strokeWidth="1" />
        </svg>
    );
};


interface HealthTabProps {
  isOpen: boolean;
  onClose: () => void;
  visualContext: VisualContext | null;
  emotionHistory: EmotionHistoryEntry[];
  userState: UserStateVector | null;
}

export const HealthTab: React.FC<HealthTabProps> = ({ isOpen, onClose, visualContext, emotionHistory, userState }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentEmotion = visualContext?.emotion;
  const sensoryData = visualContext?.sensoryData;
  const emotionConfig = currentEmotion ? EMOTION_CONFIG[currentEmotion.label] : null;
  const intensityHistory = emotionHistory.map(e => e.emotion.intensity).slice(0, 15).reverse();

  return (
      <div 
        className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-80 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="health-dashboard-title"
      >
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 id="health-dashboard-title" className="text-xl font-bold text-gray-100">Bio-Resonance</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <div className="mb-6 flex-shrink-0">
                <h4 className="text-sm text-gray-400 font-semibold mb-2">Current State</h4>
                {currentEmotion && emotionConfig ? (
                  <div className={`bg-gray-800/50 p-4 rounded-lg border-l-4 border-${emotionConfig.color}`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className={`font-bold text-xl text-${emotionConfig.color}`}>{currentEmotion.label}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Intensity</span>
                        <div className="w-1/2 bg-gray-700 rounded-full h-2">
                           <div className={`bg-${emotionConfig.color} h-2 rounded-full`} style={{width: `${currentEmotion.intensity}%`}}></div>
                        </div>
                        <span className="font-semibold text-gray-200">{currentEmotion.intensity}%</span>
                      </div>
                       <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Stability</span>
                        <div className="w-1/2 bg-gray-700 rounded-full h-2">
                           <div className={`bg-cyan-400 h-2 rounded-full`} style={{width: `${currentEmotion.stability}%`}}></div>
                        </div>
                        <span className="font-semibold text-gray-200">{currentEmotion.stability}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                    <div className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-gray-600">
                         <span className="text-gray-500">Sensing...</span>
                    </div>
                )}
            </div>

            <div className="mb-6 flex-shrink-0">
                <h4 className="text-sm text-gray-400 font-semibold mb-2">Sensory Input</h4>
                 {sensoryData ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-800/50 p-2 rounded-lg col-span-2 flex items-center gap-2">
                           <div className="w-8 h-8 rounded-md flex-shrink-0 border border-gray-700" style={{backgroundColor: sensoryData.dominantColor ? `rgb(${sensoryData.dominantColor.r}, ${sensoryData.dominantColor.g}, ${sensoryData.dominantColor.b})` : '#1f2937'}}></div>
                           <p className="text-gray-300">Dominant Environmental Color</p>
                        </div>
                        <VitalsCard icon={<SignalIcon className="w-5 h-5 text-green-400"/>} label="Vocal Energy" value={`${sensoryData.vocalEnergy}%`} />
                        <VitalsCard icon={<SignalIcon className="w-5 h-5 text-blue-400"/>} label="Focus Metric" value={`${sensoryData.focusMetric}%`} />
                        <VitalsCard icon={<HeartbeatIcon className="w-5 h-5 text-rose-400"/>} label="Heart Freq." value={sensoryData.simulatedHeartRate} unit="bpm" />
                    </div>
                 ) : (
                    <div className="text-center text-gray-500 text-xs py-2">No sensory data.</div>
                 )}
            </div>

            <div className="flex-grow flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h4 className="text-sm text-gray-400 font-semibold">State History</h4>
                    <div className="w-24 h-5">
                       <Sparkline data={intensityHistory} />
                    </div>
                </div>
                <div className="space-y-2 pr-2 -mr-2 overflow-y-auto h-full">
                    {emotionHistory.length > 0 ? (
                        emotionHistory.map((entry, index) => (
                            <div key={`${entry.timestamp.toISOString()}-${index}`} className="flex justify-between items-center text-sm bg-gray-800/50 p-2 rounded">
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full bg-${EMOTION_CONFIG[entry.emotion.label].color} mr-2`}></div>
                                    <span className="text-gray-200">{entry.emotion.label}</span>
                                </div>
                                <span className="text-gray-500">{entry.emotion.intensity}%</span>
                                <span className="text-gray-500">{formatTime(entry.timestamp)}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 text-sm py-4">No history yet.</div>
                    )}
                </div>
            </div>
        </div>
      </div>
  );
};
