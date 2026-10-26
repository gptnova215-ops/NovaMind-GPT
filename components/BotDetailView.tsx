
import React from 'react';
import type { Bot } from '../types';
import { BotIcon } from './icons/BotIcon';
import { FileIcon } from './icons/FileIcon';

interface BotDetailViewProps {
  bot: Bot | null;
  onClose: () => void;
  onViewFile: (fileId: string) => void;
}

const StatusIndicator: React.FC<{ status: Bot['status'] }> = ({ status }) => {
    const color = status === 'Idle' ? 'bg-gray-500' : status === 'Working' ? 'bg-green-500' : status === 'Completed' ? 'bg-blue-500' : status === 'Paused' ? 'bg-yellow-500' : 'bg-red-500';
    const hasPing = status === 'Working';
    return (
        <span className="relative flex h-3 w-3">
            {hasPing && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
        </span>
    );
};

export const BotDetailView: React.FC<BotDetailViewProps> = ({ bot, onClose, onViewFile }) => {
  if (!bot) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bot-detail-title"
    >
      <div 
        className="relative w-full max-w-lg h-auto max-h-[80vh] bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl flex flex-col shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50 flex-shrink-0">
            <div className="flex items-center gap-3">
                <BotIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <h3 id="bot-detail-title" className="text-lg font-bold text-gray-100">{bot.name}</h3>
                    <p className="text-xs text-gray-400">{bot.specialty}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-300">Status</span>
                <div className="flex items-center gap-2">
                    <StatusIndicator status={bot.status} />
                    <span className="font-semibold">{bot.status}</span>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Current Task</h4>
                <p className="text-gray-400 text-sm bg-gray-800/50 p-3 rounded-lg italic">
                    "{bot.currentTask}"
                </p>
            </div>
            
            {(bot.status === 'Working' || bot.status === 'Paused') && bot.progress !== undefined && (
                <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Progress</h4>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{width: `${bot.progress}%`}}></div>
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Execution Log</h4>
                <div className="bg-gray-800/50 p-3 rounded-lg max-h-48 overflow-y-auto font-mono text-xs">
                    {bot.log.map((entry, index) => (
                        <p key={index} className="text-gray-400 leading-relaxed">{entry}</p>
                    ))}
                </div>
            </div>

            {bot.status === 'Completed' && bot.resultFileId && (
                <div>
                     <h4 className="text-sm font-medium text-gray-300 mb-1">Result</h4>
                     <button onClick={() => { onViewFile(bot.resultFileId!); onClose(); }} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                        <FileIcon className="w-5 h-5"/>
                        View Result File
                     </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
