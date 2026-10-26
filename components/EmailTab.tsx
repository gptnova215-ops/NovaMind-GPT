
import React from 'react';
import type { EmailItem } from '../types';
import { EmailIcon } from './icons/EmailIcon';

interface EmailTabProps {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailItem[];
  onEmailAction: (prompt: string) => void;
}

export const EmailTab: React.FC<EmailTabProps> = ({ isOpen, onClose, emails, onEmailAction }) => {
  return (
    <div 
      className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-title"
    >
      <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 id="email-title" className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <EmailIcon className="w-6 h-6 text-indigo-400" />
                  Email Hub
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
              {emails.length > 0 ? emails.map(email => (
                  <div key={email.id} className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/50">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <p className="font-semibold text-gray-200 truncate">{email.sender}</p>
                              <p className="text-sm text-gray-400">{email.subject}</p>
                          </div>
                          <p className="text-xs text-gray-500 flex-shrink-0">{email.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      <p className="text-sm text-gray-400 border-l-2 border-gray-700 pl-3 py-1 italic">
                          {email.body.length > 100 ? `${email.body.substring(0, 100)}...` : email.body}
                      </p>
                      <div className="flex justify-end gap-2 mt-2">
                         <button onClick={() => onEmailAction(`Send a reply to the email from ${email.sender} about "${email.subject}". Be concise and professional.`)} className="bg-indigo-600/80 text-white text-xs font-semibold px-3 py-1 rounded-lg hover:bg-indigo-600 transition-colors">Have NovaMind Reply</button>
                      </div>
                  </div>
              )) : (
                  <div className="text-center text-gray-500 py-10">Inbox Zero!</div>
              )}
          </div>
      </div>
    </div>
  );
};
