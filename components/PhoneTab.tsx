
import React, { useState } from 'react';
import type { PhoneCallItem } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { PhoneSolidIcon } from './icons/PhoneSolidIcon';

interface PhoneTabProps {
  isOpen: boolean;
  onClose: () => void;
  calls: PhoneCallItem[];
  onCallAction: (prompt: string) => void;
}

const DialButton: React.FC<{ digit: string, letters?: string, onClick: (d: string) => void }> = ({ digit, letters, onClick }) => (
    <button onClick={() => onClick(digit)} className="flex flex-col items-center justify-center h-16 w-16 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
        <span className="text-2xl font-light text-white">{digit}</span>
        {letters && <span className="text-[10px] tracking-widest text-gray-400">{letters}</span>}
    </button>
);

export const PhoneTab: React.FC<PhoneTabProps> = ({ isOpen, onClose, calls, onCallAction }) => {
  const [dialerInput, setDialerInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const handleDial = (digit: string) => {
      if (isCalling) return;
      setDialerInput(prev => prev + digit);
  };
  
  const handleDelete = () => {
    if (isCalling) return;
    setDialerInput(prev => prev.slice(0, -1));
  }
  
  const handleCall = () => {
      if (!dialerInput) return;
      setIsCalling(true);
      setTimeout(() => {
          onCallAction(`Call the number ${dialerInput}.`);
          setIsCalling(false);
          setDialerInput('');
          onClose();
      }, 2000);
  }

  return (
    <div 
      className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-title"
    >
      <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 id="phone-title" className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <PhoneSolidIcon className="w-6 h-6 text-indigo-400" />
                  Phone Hub
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 flex flex-col">
             {/* Dialer UI */}
             <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg mb-4">
                <p className="text-xs text-gray-400">Your NovaMind Number: <span className="font-semibold text-gray-300">+1 (555) 424-8080</span></p>
                <div className="h-12 w-full my-2 text-center text-3xl font-light text-white tracking-wider flex items-center justify-center">
                    {isCalling ? <span className="text-green-400 animate-pulse text-xl">Connecting...</span> : dialerInput || <span className="text-gray-500">Dial a number</span>}
                </div>
                 <div className="grid grid-cols-3 gap-4">
                    <DialButton digit="1" onClick={handleDial} />
                    <DialButton digit="2" letters="ABC" onClick={handleDial} />
                    <DialButton digit="3" letters="DEF" onClick={handleDial} />
                    <DialButton digit="4" letters="GHI" onClick={handleDial} />
                    <DialButton digit="5" letters="JKL" onClick={handleDial} />
                    <DialButton digit="6" letters="MNO" onClick={handleDial} />
                    <DialButton digit="7" letters="PQRS" onClick={handleDial} />
                    <DialButton digit="8" letters="TUV" onClick={handleDial} />
                    <DialButton digit="9" letters="WXYZ" onClick={handleDial} />
                    <div className="h-16 w-16" /> {/* Placeholder */}
                    <DialButton digit="0" letters="+" onClick={handleDial} />
                    <button onClick={handleDelete} className="flex items-center justify-center h-16 w-16 text-gray-400 hover:text-white transition-colors" disabled={!dialerInput || isCalling}>
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                    </button>
                </div>
                 <button onClick={handleCall} disabled={!dialerInput || isCalling} className="mt-4 w-20 h-20 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-400 disabled:bg-gray-600 transition-colors">
                     <PhoneSolidIcon className="w-8 h-8 text-white"/>
                </button>
             </div>

              {/* Call Log */}
              <h4 className="text-sm font-semibold text-gray-400 mb-2 flex-shrink-0">Recent Calls</h4>
              <div className="flex-grow overflow-y-auto space-y-3">
                {calls.length > 0 ? calls.map(call => (
                    <div key={call.id} className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/50">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <PhoneIcon type={call.type} className="w-5 h-5 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-200">{call.contactName}</p>
                                    <p className="text-sm text-gray-400">
                                        {call.type} Call - <span className="text-xs">{call.duration !== 'N/A' ? call.duration : ''}</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 flex-shrink-0">{call.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                           <button onClick={() => onCallAction(`Create a task based on my recent call with ${call.contactName}.`)} className="bg-gray-700/50 text-gray-300 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors">Create Task</button>
                           <button onClick={() => onCallAction(`Summarize my recent call with ${call.contactName}. What were the key points?`)} className="bg-indigo-600/80 text-white text-xs font-semibold px-3 py-1 rounded-lg hover:bg-indigo-600 transition-colors">Summarize</button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-500 py-10">No recent calls.</div>
                )}
              </div>
          </div>
      </div>
    </div>
  );
};
