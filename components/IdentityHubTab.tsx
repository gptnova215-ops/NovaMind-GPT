
import React, { useState, useEffect, useRef } from 'react';
import type { UserProfile, ConnectedAccount, AccountProvider, BotPersona, ExperimentalFeatures, ActiveIdentityHubTabId } from '../types';
import { TagInput } from './TagInput';

// Icons
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg> );
const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.72-1.72"/></svg> );
const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2.82l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2.82l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg> );

const INTEGRATION_PROVIDERS: AccountProvider[] = ['google', 'microsoft', 'apple', 'slack', 'notion', 'github', 'facebook', 'instagram', 'tiktok', 'x', 'godaddy', 'wordpress', 'shopify', 'ebay'];

interface IdentityHubTabProps {
  isOpen: boolean; onClose: () => void;
  userProfile: UserProfile; onProfileUpdate: (profile: UserProfile) => void;
  onSignOut: () => void; onClearData: () => void;
  connectedAccounts: ConnectedAccount[]; onConnect: (provider: AccountProvider) => void;
  onDisconnect: (provider: AccountProvider) => void; connectingProvider: AccountProvider | null;
  botPersona: BotPersona; onPersonaUpdate: (persona: BotPersona) => void;
  experimentalFeatures: ExperimentalFeatures; onFeaturesChange: (features: ExperimentalFeatures) => void;
}

const PersonaSlider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; leftLabel: string; rightLabel: string; }> = ({ label, value, onChange, leftLabel, rightLabel }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input type="range" min="0" max="100" value={value} onChange={onChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
    <div className="flex justify-between text-xs text-gray-400 mt-1">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
  </div>
);

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-700/50">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-3 text-left">
                <h3 className="text-md font-semibold text-gray-300">{title}</h3>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && <div className="pb-4 pt-2 space-y-4">{children}</div>}
        </div>
    );
};

export const IdentityHubTab: React.FC<IdentityHubTabProps> = ({
  isOpen, onClose, userProfile, onProfileUpdate, onSignOut, onClearData, connectedAccounts, onConnect, 
  onDisconnect, connectingProvider, botPersona, onPersonaUpdate, experimentalFeatures, onFeaturesChange
}) => {
  const [activeTab, setActiveTab] = useState<ActiveIdentityHubTabId>('profile');
  const [localProfile, setLocalProfile] = useState(userProfile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { setLocalProfile(userProfile); }, [userProfile]);

  const handleProfileChange = (field: keyof UserProfile, value: any) => setLocalProfile(prev => ({ ...prev, [field]: value }));
  const handleNestedProfileChange = (parent: keyof UserProfile, field: string, value: string | number) => setLocalProfile(prev => ({ ...prev, [parent]: { ...prev[parent as keyof UserProfile] as object, [field]: value } }));
  const isProfileChanged = JSON.stringify(localProfile) !== JSON.stringify(userProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(localProfile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const TABS: { id: ActiveIdentityHubTabId; label: string; icon: React.ReactNode }[] = [
      { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5"/> },
      { id: 'persona', label: 'Persona', icon: <SparklesIcon className="w-5 h-5"/> },
      { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="w-5 h-5"/> },
      { id: 'system', label: 'System', icon: <SettingsIcon className="w-5 h-5"/> },
  ];

  return (
      <div className={`fixed top-0 left-20 h-full w-full max-w-lg bg-gray-900/80 backdrop-blur-lg border-r border-gray-700/50 z-20 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog" aria-modal="true" aria-labelledby="identity-hub-title">
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 flex-shrink-0 border-b border-gray-700/50">
                 <h3 id="identity-hub-title" className="text-xl font-bold text-gray-100">Identity Hub</h3>
                 <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>

            <nav className="flex justify-around border-b border-gray-700/50 flex-shrink-0">
                 {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-1 text-center p-3 text-xs font-medium transition-colors border-b-2 ${
                            activeTab === tab.id ? 'border-indigo-400 text-white' : 'border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                        }`}>
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                 ))}
            </nav>

            <main className="flex-grow p-4 md:p-6 overflow-y-auto">
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-2 border-2 border-indigo-400/50">
                            <span className="text-4xl font-bold">{localProfile.name.charAt(0)}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{localProfile.name}</h2>
                        <p className="text-gray-400">{localProfile.email}</p>
                    </div>
                    <Accordion title="Basic Information" defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium text-gray-300 mb-1">Name</label><input type="text" value={localProfile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="w-full bg-gray-800/50 text-gray-200 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                             <div><label className="block text-sm font-medium text-gray-300 mb-1">Occupation</label><input type="text" value={localProfile.occupation || ''} onChange={(e) => handleProfileChange('occupation', e.target.value)} className="w-full bg-gray-800/50 text-gray-200 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                        </div>
                    </Accordion>
                     <Accordion title="Personal Compass">
                        <div><label className="block text-sm font-medium text-gray-300 mb-1">Goals</label><textarea value={localProfile.goals} onChange={(e) => handleProfileChange('goals', e.target.value)} placeholder="What is your purpose?" rows={3} className="w-full bg-gray-800/50 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                        <div><label className="block text-sm font-medium text-gray-300 mb-1">Core Values</label><TagInput tags={localProfile.coreValues || []} setTags={(newTags) => handleProfileChange('coreValues', newTags)} placeholder="e.g., Compassion..."/></div>
                     </Accordion>
                  <button type="submit" disabled={!isProfileChanged} className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-500 transition-colors disabled:bg-indigo-500/50 disabled:cursor-not-allowed mt-4">
                      {isSaved ? 'Saved!' : 'Save Profile Changes'}
                  </button>
                </form>
              )}
              {activeTab === 'persona' && ( <div className="space-y-6"> <PersonaSlider label="Empathy" value={botPersona.resonance} onChange={e => onPersonaUpdate({...botPersona, resonance: +e.target.value})} leftLabel="Analytical" rightLabel="Compassionate" /> <PersonaSlider label="Guidance Style" value={botPersona.verbosity} onChange={e => onPersonaUpdate({...botPersona, verbosity: +e.target.value})} leftLabel="Concise" rightLabel="Elaborate" /> <PersonaSlider label="Proactivity" value={botPersona.proactivity} onChange={e => onPersonaUpdate({...botPersona, proactivity: +e.target.value})} leftLabel="Reactive" rightLabel="Proactive" /> <PersonaSlider label="Metaphorical Density" value={botPersona.metaphoricalDensity} onChange={e => onPersonaUpdate({...botPersona, metaphoricalDensity: +e.target.value})} leftLabel="Literal" rightLabel="Poetic" /> <PersonaSlider label="Challenge Level" value={botPersona.challengeLevel} onChange={e => onPersonaUpdate({...botPersona, challengeLevel: +e.target.value})} leftLabel="Supportive" rightLabel="Provocative" /> </div> )}
              {activeTab === 'integrations' && (
                 <div className="space-y-3">
                    {INTEGRATION_PROVIDERS.map(provider => (
                      <div key={provider} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                        <span className="font-semibold capitalize text-gray-200">{provider}</span>
                        {connectedAccounts.find(a => a.provider === provider) ? (
                            <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 truncate max-w-[100px]">{connectedAccounts.find(a => a.provider === provider)!.email}</span>
                            <button onClick={() => onDisconnect(provider)} className="text-rose-400 hover:text-rose-300 text-xs font-semibold">Disconnect</button>
                            </div>
                        ) : (
                            <button onClick={() => onConnect(provider)} disabled={connectingProvider === provider} className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {connectingProvider === provider ? 'Connecting...' : 'Connect'}
                            </button>
                        )}
                      </div>
                    ))}
                 </div>
              )}
               {activeTab === 'system' && (
                 <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-gray-200">Core Mandates</h4>
                        <p className="text-sm text-gray-400 mt-1 mb-3">These are the guiding principles I have derived from your stated goals and values to direct my actions.</p>
                        <div className="space-y-2">
                            <div className="bg-gray-800/50 p-3 rounded-lg"><p className="text-sm text-indigo-300">Mandate: Prioritize tasks and communications related to 'Project Phoenix'.</p></div>
                            <div className="bg-gray-800/50 p-3 rounded-lg"><p className="text-sm text-indigo-300">Mandate: Analyze incoming data for opportunities to foster 'creativity' and 'growth'.</p></div>
                            <div className="bg-gray-800/50 p-3 rounded-lg"><p className="text-sm text-indigo-300">Mandate: Monitor communication patterns to enhance key relationship with 'John Smith'.</p></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-200">Data Management</h4>
                        <p className="text-sm text-gray-400 mt-1">Permanently delete your conversation history and all memories. This cannot be undone.</p>
                        <button type="button" onClick={onClearData} className="w-full md:w-auto mt-2 bg-amber-800/80 text-white rounded-lg px-4 py-2 font-semibold hover:bg-amber-700/80 transition-colors text-sm">Clear Conversation & Memory</button>
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-200">Log Out</h4>
                        <p className="text-sm text-gray-400 mt-1">You will be returned to the sign-in screen.</p>
                        <button onClick={onSignOut} className="w-full md:w-auto mt-2 bg-rose-600/50 text-rose-300 rounded-lg px-4 py-2 font-semibold hover:bg-rose-600/70 transition-colors text-sm">Log Out</button>
                    </div>
                 </div>
              )}
            </main>
        </div>
      </div>
  );
};
