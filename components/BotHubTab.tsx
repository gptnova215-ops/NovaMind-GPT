
import React from 'react';
import type { Bot } from '../types';
import { BotIcon } from './icons/BotIcon';
import { EyeIcon } from './icons/EyeIcon';
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface BotHubTabProps {
    isOpen: boolean;
    onClose: () => void;
    bots: Bot[];
    onBotAction: (botId: string, action: 'pause' | 'resume' | 'cancel') => void;
    onViewBotDetails: (bot: Bot) => void;
}

const StatusIndicator: React.FC<{ status: Bot['status'] }> = ({ status }) => {
    const color = status === 'Idle' ? 'bg-gray-500' : status === 'Working' ? 'bg-green-500' : status === 'Completed' ? 'bg-blue-500' : status === 'Paused' ? 'bg-yellow-500' : 'bg-red-500';
    const hasPing = status === 'Working';
    return ( <span className="relative flex h-2.5 w-2.5"> {hasPing && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>} <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`}></span> </span> );
};

export const BotHubTab: React.FC<BotHubTabProps> = ({ isOpen, onClose, bots, onBotAction, onViewBotDetails }) => {
  return (
    <div 
      className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bot-hub-title"
    >
      <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 id="bot-hub-title" className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <BotIcon className="w-6 h-6 text-indigo-400" />
                  Bot Hub
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center bg-gray-800/50 p-3 rounded-lg mb-4">
            <div><p className="text-2xl font-bold text-green-400">{bots.filter(b=>b.status === 'Working').length}</p><p className="text-xs text-gray-400">Active</p></div>
            <div><p className="text-2xl font-bold text-blue-400">{bots.filter(b=>b.status === 'Completed').length}</p><p className="text-xs text-gray-400">Completed</p></div>
            <div><p className="text-2xl font-bold text-gray-300">{bots.length}</p><p className="text-xs text-gray-400">Total</p></div>
          </div>

          <p className="text-sm text-gray-400 mb-4 text-center italic">Deploy new bots through conversation.</p>

          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
              {bots.length > 0 ? bots.map(bot => (
                  <div key={bot.id} className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/50">
                     <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3"><BotIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" /><div className="min-w-0"><p className="font-semibold text-gray-200 truncate">{bot.name}</p><p className="text-xs text-gray-400">{bot.specialty}</p></div></div>
                          <div className="flex items-center gap-2 text-sm text-gray-300"><StatusIndicator status={bot.status} /><span>{bot.status}</span></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Task: <span className="text-gray-400 italic">"{bot.currentTask}"</span></p>
                      {(bot.status === 'Working' || bot.status === 'Paused') && bot.progress !== undefined && (<div className="mt-2"><div className="w-full bg-gray-700 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{width: `${bot.progress}%`}}></div></div></div>)}
                      <div className="flex justify-end items-center gap-2 mt-3 pt-2 border-t border-gray-700/50">
                         {bot.status === 'Working' && <button onClick={() => onBotAction(bot.id, 'pause')} className="p-2 text-gray-400 hover:text-yellow-400" aria-label="Pause Bot"><PauseIcon className="w-4 h-4"/></button>}
                         {bot.status === 'Paused' && <button onClick={() => onBotAction(bot.id, 'resume')} className="p-2 text-gray-400 hover:text-green-400" aria-label="Resume Bot"><PlayIcon className="w-4 h-4"/></button>}
                         {(bot.status === 'Working' || bot.status === 'Paused') && <button onClick={() => onBotAction(bot.id, 'cancel')} className="p-2 text-gray-400 hover:text-rose-400" aria-label="Cancel Bot"><XCircleIcon className="w-4 h-4"/></button>}
                          <button onClick={() => onViewBotDetails(bot)} className="p-2 text-gray-400 hover:text-blue-400" aria-label="View Bot Details"><EyeIcon className="w-4 h-4"/></button>
                      </div>
                  </div>
              )) : (<div className="text-center text-gray-500 py-10">No bots deployed.</div>)}
           </div>
      </div>
    </div>
  );
};
