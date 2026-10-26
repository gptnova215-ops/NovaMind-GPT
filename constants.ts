
import type { EmotionLabel } from './types';

type EmotionConfig = {
  name: EmotionLabel;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  rgb: string;
};

export const EMOTION_CONFIG: Record<EmotionLabel, EmotionConfig> = {
  'Joy': { name: 'Joy', color: 'yellow-300', gradientFrom: 'from-yellow-400', gradientTo: 'to-amber-400', rgb: '253, 224, 71' },
  'Calm': { name: 'Calm', color: 'blue-400', gradientFrom: 'from-blue-500', gradientTo: 'to-cyan-400', rgb: '96, 165, 250' },
  'Focus': { name: 'Focus', color: 'indigo-400', gradientFrom: 'from-indigo-500', gradientTo: 'to-purple-500', rgb: '129, 140, 248' },
  'Agitation': { name: 'Agitation', color: 'rose-400', gradientFrom: 'from-rose-500', gradientTo: 'to-red-500', rgb: '251, 113, 133' },
  'Sadness': { name: 'Sadness', color: 'gray-400', gradientFrom: 'from-gray-500', gradientTo: 'to-slate-400', rgb: '156, 163, 175' },
  'Contentment': { name: 'Contentment', color: 'emerald-400', gradientFrom: 'from-emerald-500', gradientTo: 'to-green-400', rgb: '52, 211, 153' },
  'Inspired': { name: 'Inspired', color: 'orange-400', gradientFrom: 'from-orange-500', gradientTo: 'to-amber-400', rgb: '251, 146, 60' },
};

export const EMOTION_LIST = Object.values(EMOTION_CONFIG);
