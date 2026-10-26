
import React from 'react';
import type { SocialMention } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';

interface WebSocialTabProps {
  isOpen: boolean;
  onClose: () => void;
  mentions: SocialMention[];
}

const PlatformIcon: React.FC<{ platform: SocialMention['platform'] }> = ({ platform }) => {
    if (platform === 'X') {
        return <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16"><path fill="currentColor" d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>;
    }
    return <GlobeIcon className="w-4 h-4 text-gray-400" />;
};

export const WebSocialTab: React.FC<WebSocialTabProps> = ({ isOpen, onClose, mentions }) => {
  return (
    <div 
      className={`fixed top-0 left-20 h-full w-full max-w-sm sm:w-96 bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="web-social-title"
    >
      <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 id="web-social-title" className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <GlobeIcon className="w-6 h-6 text-indigo-400" />
                  Web & Social
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
              <div>
                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Connect Accounts</h4>
                  <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect X</button>
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect Facebook</button>
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect Instagram</button>
                      <button className="bg-gray-800/60 p-3 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">Connect TikTok</button>
                  </div>
              </div>

              <div>
                  <h4 className="text-sm text-gray-400 font-semibold mb-2">Recent Mentions</h4>
                  <div className="space-y-3">
                    {mentions.length > 0 ? mentions.map(mention => (
                        <a href={mention.url} target="_blank" rel="noopener noreferrer" key={mention.id} className="block bg-gray-800/60 p-3 rounded-lg border border-gray-700/50 hover:bg-gray-800 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <PlatformIcon platform={mention.platform} />
                                  <p className="font-semibold text-gray-200 truncate">{mention.author}</p>
                                </div>
                                <p className="text-xs text-gray-500 flex-shrink-0">{mention.timestamp.toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm text-gray-400">
                                {mention.content}
                            </p>
                        </a>
                    )) : (
                        <div className="text-center text-gray-500 py-10">No recent mentions.</div>
                    )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
