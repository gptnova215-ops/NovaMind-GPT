import React, { useEffect, useState } from 'react';
import type { Notification as NotificationType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface NotificationProps {
  notification: NotificationType;
  onDismiss: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  const icon = notification.type === 'success' 
    ? <CheckCircleIcon className="w-6 h-6 text-green-400" /> 
    : <LightbulbIcon className="w-6 h-6 text-blue-400" />;

  return (
    <div 
      className={`
        w-full bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg flex items-start p-4
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-200">{notification.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button 
          onClick={handleDismiss} 
          className="text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};