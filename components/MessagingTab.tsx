
import React from 'react';
import type { DirectMessage } from '../types';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

interface MessagingTabProps {
  isOpen: boolean;
  onClose: () => void;
  messages: DirectMessage[];
}

export const MessagingTab: React.FC<MessagingTabProps> = ({ isOpen, onClose, messages }) => {
  return (
    <div 
      className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="messaging-title"
    >
      <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 id="messaging-title" className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <ChatBubbleIcon className="w-6 h-6 text-indigo-400" />
                  Messages
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          
           <div className="relative mb-4">
                <input
                    type="search"
                    placeholder="Search by username..."
                    className="w-full bg-gray-800/50 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-2">
              {messages.length > 0 ? messages.map(msg => (
                  <button key={msg.id} className="w-full text-left bg-gray-800/60 p-3 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                          <p className="font-semibold text-gray-200">{msg.contactName}</p>
                          <p className="text-xs text-gray-500">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-sm text-gray-400 truncate pr-4">{msg.lastMessage}</p>
                        {msg.unreadCount > 0 && 
                            <span className="flex items-center justify-center text-xs font-bold text-white bg-indigo-500 rounded-full w-5 h-5 flex-shrink-0">
                                {msg.unreadCount}
                            </span>
                        }
                      </div>
                  </button>
              )) : (
                  <div className="text-center text-gray-500 py-10">No messages.</div>
              )}
          </div>
      </div>
    </div>
  );
};
