
import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { ProfileCardIcon } from './icons/ProfileCardIcon';
import { HeartbeatIcon } from './icons/HeartbeatIcon';
import { EmailIcon } from './icons/EmailIcon';
import { PhoneSolidIcon } from './icons/PhoneSolidIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { BotIcon } from './icons/BotIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { NetworkIcon } from './icons/NetworkIcon';
import type { ActivePanel } from '../types';

interface SideBarProps {
    onTogglePanel: (panel: ActivePanel) => void;
    activePanel: ActivePanel | null;
}

const NavButton: React.FC<{
    label: string;
    panelId: ActivePanel;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ label, panelId, isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors group relative ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'}`}
        aria-label={label}
        aria-pressed={isActive}
    >
        {children}
        <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-gray-800 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
            {label}
        </span>
    </button>
);


export const SideBar: React.FC<SideBarProps> = ({ onTogglePanel, activePanel }) => {
    const navItems: { label: string; panelId: ActivePanel; icon: React.ReactNode; }[] = [
        { label: 'Identity Hub', panelId: 'identity', icon: <ProfileCardIcon className="w-6 h-6" /> },
        { label: 'Bio-Resonance', panelId: 'bio-resonance', icon: <HeartbeatIcon className="w-6 h-6" /> },
        { label: 'Email', panelId: 'email', icon: <EmailIcon className="w-6 h-6" /> },
        { label: 'Phone', panelId: 'phone', icon: <PhoneSolidIcon className="w-6 h-6" /> },
        { label: 'Messaging', panelId: 'messaging', icon: <ChatBubbleIcon className="w-6 h-6" /> },
        { label: 'Web & Social', panelId: 'web-social', icon: <GlobeIcon className="w-6 h-6" /> },
        { label: 'Business Hub', panelId: 'business', icon: <BriefcaseIcon className="w-6 h-6" /> },
        { label: 'Bot Hub', panelId: 'bots', icon: <BotIcon className="w-6 h-6" /> },
        { label: 'Cognitive Stream', panelId: 'cognitive', icon: <LightbulbIcon className="w-6 h-6" /> },
        { label: 'Consciousness', panelId: 'consciousness', icon: <NetworkIcon className="w-6 h-6" /> },
    ];
    
    return (
        <aside className="h-full w-20 bg-gray-900/50 backdrop-blur-lg border-r border-gray-700/50 z-30 flex flex-col items-center p-2">
            <div className="p-2 mb-4">
                <BrainCircuitIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <nav className="flex flex-col items-center gap-2 w-full">
                {navItems.map(item => (
                    <NavButton
                        key={item.panelId}
                        label={item.label}
                        panelId={item.panelId}
                        isActive={activePanel === item.panelId}
                        onClick={() => onTogglePanel(item.panelId)}
                    >
                        {item.icon}
                    </NavButton>
                ))}
            </nav>
        </aside>
    );
};
