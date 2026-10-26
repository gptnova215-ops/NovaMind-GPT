
import React from 'react';
import type { BusinessMetric, TaskItem, Meeting } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

interface BusinessHubTabProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: BusinessMetric[];
  tasks: TaskItem[];
  meetings: Meeting[];
}

const MetricCard: React.FC<{ metric: BusinessMetric }> = ({ metric }) => {
    const isPositive = metric.change >= 0;
    const changeColor = isPositive ? 'text-green-400' : 'text-rose-400';
    const changeIcon = isPositive ? '▲' : '▼';
    return (
        <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">{metric.label}</p>
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-bold text-gray-100">{metric.value}</p>
              <p className={`text-sm font-semibold ${changeColor}`}>{changeIcon} {Math.abs(metric.change)}%</p>
            </div>
        </div>
    );
};

export const BusinessHubTab: React.FC<BusinessHubTabProps> = ({ isOpen, onClose, metrics, tasks, meetings }) => {
  const priorityTasks = tasks.filter(t => t.dueDate === 'Today');

  return (
    <div 
      className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-hub-title"
    >
      <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 id="business-hub-title" className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-indigo-400" />
                  Business Hub
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
               <div>
                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Connect Platforms</h4>
                  <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect Shopify</button>
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect Wordpress</button>
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect eBay</button>
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect GoDaddy</button>
                  </div>
              </div>
              <div>
                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                      {metrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}
                  </div>
              </div>

              <div>
                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Priority Tasks</h4>
                  <div className="space-y-2">
                      {priorityTasks.length > 0 ? priorityTasks.map(task => (
                          <div key={task.id} className="bg-gray-800/50 p-2 rounded-lg flex items-center justify-between">
                              <p className="text-sm text-gray-200">{task.title}</p>
                              <span className="text-xs font-semibold bg-rose-500/50 text-rose-200 px-2 py-1 rounded">Today</span>
                          </div>
                      )) : <p className="text-sm text-gray-500 italic">No tasks due today.</p>}
                  </div>
              </div>
              
              <div>
                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Upcoming Meetings</h4>
                  <div className="space-y-2">
                      {meetings.map(meeting => (
                          <div key={meeting.id} className="bg-gray-800/50 p-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-200">{meeting.title}</p>
                                <p className="text-sm text-gray-300">{meeting.time}</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">
                                  With: {meeting.participants.join(', ')}
                              </p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
