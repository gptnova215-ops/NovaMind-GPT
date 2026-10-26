
import React from 'react';
import type { CognitiveInsight } from '../types';
import { LightbulbIcon } from './icons/LightbulbIcon';

const InsightIcon: React.FC<{ type: CognitiveInsight['type'] }> = ({ type }) => {
    const props = { className: "w-4 h-4 text-gray-200" };
    if (type === 'stress') return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m13 2-3 9h4l-3 9"/></svg>;
    if (type === 'focus') return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h2m14 0h2m-9-9v2m0 14v2"/></svg>;
    if (type === 'pattern') return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>;
    if (type === 'event') return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
    if (type === 'opportunity') return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg>;
    if (type === 'self_reflection') return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg>;
    return <LightbulbIcon {...props} />;
};

interface CognitiveStreamTabProps {
    isOpen: boolean;
    onClose: () => void;
    insights: CognitiveInsight[];
    onInsightAction: (insight: CognitiveInsight) => void;
}

export const CognitiveStreamTab: React.FC<CognitiveStreamTabProps> = ({ isOpen, onClose, insights, onInsightAction }) => {
  return (
      <div 
        className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog" aria-modal="true" aria-labelledby="cognitive-stream-title"
      >
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 id="cognitive-stream-title" className="text-xl font-bold text-gray-100">Cognitive Stream</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
                {insights.length > 0 ? (
                    insights.map((insight) => (
                        <div key={insight.id} className={`bg-gray-800/50 p-3 rounded-lg border-l-4 border-${insight.color}`}>
                           <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${insight.color}/20 flex items-center justify-center mt-1`}>
                                  <InsightIcon type={insight.type} />
                                </div>
                                <div className="min-w-0 flex-grow">
                                    <p className="text-sm font-semibold text-gray-200">{insight.title}</p>
                                    <p className="text-sm text-gray-400 mb-2">{insight.description}</p>
                                    {insight.action.type !== 'dismiss' && (
                                        <button 
                                            onClick={() => onInsightAction(insight)}
                                            className="text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-500 transition-colors"
                                        >
                                            {insight.action.label}
                                        </button>
                                    )}
                                </div>
                           </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 text-sm py-8 space-y-2">
                        <LightbulbIcon className="w-8 h-8 mx-auto text-gray-600" />
                        <h4 className="font-semibold text-gray-400">The Stream is Quiet</h4>
                        <p className="text-xs">As I process more information and learn your patterns, proactive insights and suggestions will appear here.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
  );
};
