
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Header } from './components/Header';
import { HealthTab } from './components/HealthTab';
import { ConsciousnessVisualizer } from './components/ConsciousnessVisualizer';
import { CognitiveStreamTab } from './components/CognitiveStreamTab';
import { SignIn } from './components/SignIn';
import type { EmotionState, ChatMessage, EmotionHistoryEntry, NeuroMemory, UserStateVector, UserProfile, ConnectedAccount, AccountProvider, VisualContext, Hypothesis, BotPersona, CognitiveInsight, EmailItem, TaskItem, Bot, EncryptedFile, Notification as NotificationType, BotSpecialty, BotStatus, PhoneCallItem, MemoryType, ExperimentalFeatures, SocialMention, BusinessMetric, Meeting, ActivePanel } from './types';
import { startChat, continueConversation, getProactiveMessage, defaultUserState, generateCognitiveStream, generateSuggestedReply } from './services/geminiService';
import { SubconsciousProcessor } from './services/subconsciousService';
import { useVoice, Turn } from './hooks/useVoice';
import { DynamicBackground } from './components/DynamicBackground';
import { mockEmails, mockTasks, mockBots, mockFiles, mockPhoneCalls, mockSocialMentions, mockBusinessMetrics, mockMeetings, mockCognitiveInsights, mockMessages } from './mockData';
import { FileViewer } from './components/FileViewer';
import { Notification } from './components/Notification';
import { BotDetailView } from './components/BotDetailView';
import { EmailTab } from './components/EmailTab';
import { PhoneTab } from './components/PhoneTab';
import { WebSocialTab } from './components/WebSocialTab';
import { BusinessHubTab } from './components/BusinessHubTab';
import { SideBar } from './components/SideBar';
import { IdentityHubTab } from './components/IdentityHubTab';
import { BotHubTab } from './components/BotHubTab';
import { MessagingTab } from './components/MessagingTab';


const initialUserProfile: UserProfile = { 
  name: 'Guest', 
  email: '', 
  goals: 'Launch my startup "Project Phoenix". Nurture creativity and growth. Strengthen my relationship with John Smith.', 
  coreValues: ['Creativity', 'Growth', 'Compassion'], 
  focusAreas: ['Product Development', 'Networking'], 
  keyRelationships: ['John Smith'],
  address: { street: '', city: '', state: '', zip: '', country: '' },
  age: '',
  pronouns: '',
  occupation: '',
  sleepSchedule: { wake: '07:00', sleep: '23:00' },
  personality: { myersBriggs: '', enneagram: '' },
  emergencyContact: { name: '', relationship: '', phone: '' },
};
const initialBotPersona: BotPersona = { resonance: 75, verbosity: 60, proactivity: 70, metaphoricalDensity: 50, challengeLevel: 30 };
const initialExperimentalFeatures: ExperimentalFeatures = { dreamWeaver: false, chronoOptimizer: true, socialResonator: false, serendipityEngine: true, shadowWork: false };

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionState | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [neuroMemories, setNeuroMemories] = useState<NeuroMemory[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [currentThought, setCurrentThought] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserStateVector | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [visualContext, setVisualContext] = useState<VisualContext | null>(null);
  const [aiHypotheses, setAiHypotheses] = useState<Hypothesis[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [connectingProvider, setConnectingProvider] = useState<AccountProvider | null>(null);

  // Feature States
  const [botPersona, setBotPersona] = useState<BotPersona>(initialBotPersona);
  const [cognitiveInsights, setCognitiveInsights] = useState<CognitiveInsight[]>([]);
  const [emailItems, setEmailItems] = useState<EmailItem[]>([]);
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  const [phoneCalls, setPhoneCalls] = useState<PhoneCallItem[]>([]);
  const [socialMentions, setSocialMentions] = useState<SocialMention[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [bots, setBots] = useState<Bot[]>(mockBots);
  const [files, setFiles] = useState<EncryptedFile[]>(mockFiles);
  const [viewingFile, setViewingFile] = useState<EncryptedFile | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [selectedBotForDetail, setSelectedBotForDetail] = useState<Bot | null>(null);
  const [experimentalFeatures, setExperimentalFeatures] = useState<ExperimentalFeatures>(initialExperimentalFeatures);
  
  // UI Panel States
  const [activePanel, setActivePanel] = useState<ActivePanel | null>(null);

  const isMounted = useRef(false);
  const subconsciousProcessor = useRef(new SubconsciousProcessor()).current;
  const previousEmotion = useRef<EmotionState | null>(null);

  const createEngram = useCallback((type: MemoryType, content: string) => {
    const newMemory: NeuroMemory = { id: `${type}-${Date.now()}`, type, content, timestamp: new Date() };
    setNeuroMemories(prev => [...prev, newMemory]);
  }, []);

  const addNotification = useCallback((message: string, type: 'success' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const closeAllPanels = useCallback(() => {
    setActivePanel(null);
    setViewingFile(null);
    setSelectedBotForDetail(null);
  }, []);

  const handleTogglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel(prev => prev === panel ? null : panel);
  }, []);

  // --- Core AI Response Processing ---
  const processResponse = useCallback((novaResponse: Awaited<ReturnType<typeof continueConversation>>) => {
      setCurrentThought(novaResponse.thought);
      setUserState(novaResponse.userState);
      setAiHypotheses(novaResponse.hypotheses);
      
      if (novaResponse.memory) {
        createEngram(novaResponse.memory.type, novaResponse.memory.content);
      }

      if (novaResponse.functionCalls) {
        for (const fc of novaResponse.functionCalls) {
          switch (fc.name) {
            case 'deployBot': {
              const { botName, taskDescription, specialty } = fc.args as { botName: string; taskDescription: string; specialty: BotSpecialty };
              const newBot: Bot = { id: `bot-${Date.now()}`, name: botName, specialty: specialty || 'General Task', status: 'Working', currentTask: taskDescription, log: [`[${new Date().toLocaleTimeString()}] Deployed. Task: ${taskDescription}`], progress: 0, resultFileId: null };
              setBots(prev => [newBot, ...prev]);
              addNotification(`Deployed new bot: ${botName}`, 'info');
              createEngram('bot_deployment', `Deployed bot "${newBot.name}" for task: ${newBot.currentTask}`);
              const confirmationMsg: ChatMessage = { id: `${Date.now()}-bot-confirm`, sender: 'ai', text: `I have deployed a new bot, **${botName}**, to handle the task: *"${taskDescription}"*. You can monitor its progress in the Bot Hub.`, thought: `Deployed bot ${botName} as requested.` };
              setChatMessages(prev => [...prev, confirmationMsg]);
              break;
            }
            case 'navigateUI': {
              const { target } = fc.args as { target: string };
              setActivePanel(target as ActivePanel);
              if (target === 'fileViewer' && fc.args.subTarget) {
                const subTarget = fc.args.subTarget as string;
                const foundFile = files.find(f => f.name.toLowerCase().includes(subTarget.toLowerCase()) || f.id === subTarget);
                if (foundFile) setViewingFile(foundFile);
                else addNotification(`Could not find a file matching "${subTarget}"`, 'info');
              }
              if (target === 'botDetailViewer' && fc.args.subTarget) {
                 const subTarget = fc.args.subTarget as string;
                 const foundBot = bots.find(b => b.name.toLowerCase().includes(subTarget.toLowerCase()) || b.id === subTarget);
                 if (foundBot) setSelectedBotForDetail(foundBot);
                 else addNotification(`Could not find a bot matching "${subTarget}"`, 'info');
              }
              break;
            }
            case 'closeUI': {
                closeAllPanels();
                break;
            }
            case 'sendEmail': {
                const { recipient, subject, body } = fc.args as { recipient: string; subject: string; body: string };
                addNotification(`Email sent to ${recipient}: "${subject}"`, 'success');
                createEngram('email_sent', `Sent email to ${recipient} with subject "${subject}". Body: ${body.substring(0, 50)}...`);
                break;
            }
            case 'makePhoneCall': {
                const { recipient } = fc.args as { recipient: string };
                addNotification(`Initiating call to ${recipient}...`, 'info');
                createEngram('phone_call_initiated', `Initiated a call to ${recipient}.`);
                break;
            }
            case 'suggestPersonaTune': {
              const { reasoning, personaKey, suggestedValue } = fc.args as { reasoning: string; personaKey: keyof BotPersona; suggestedValue: number };
              const newInsight: CognitiveInsight = {
                  id: `insight-tune-${Date.now()}`,
                  timestamp: new Date(),
                  type: 'self_reflection',
                  title: 'Persona Tuning Suggestion',
                  description: reasoning,
                  color: 'fuchsia-400',
                  action: {
                      label: `Tune Persona: ${personaKey}`,
                      type: 'suggest_persona_tune',
                      payload: {
                          key: personaKey,
                          value: suggestedValue,
                      }
                  }
              };
              setCognitiveInsights(prev => [newInsight, ...prev].slice(0, 20));
              addNotification('NovaMind has a self-tuning suggestion in the Cognitive Stream.', 'info');
              break;
            }
          }
        }
      }
  }, [addNotification, createEngram, files, bots, closeAllPanels]);

  const handleTurnComplete = useCallback(async (turn: Turn) => {
    setLastInteractionTime(Date.now());
    const userMessage: ChatMessage = { id: `${Date.now()}-user`, sender: 'user', text: turn.userInput, feedback: null };
    const aiMessage: ChatMessage = { id: `${Date.now()}-ai`, sender: 'ai', text: turn.modelOutput, feedback: null };
    setChatMessages(prev => [...prev, userMessage, aiMessage]);

    try {
      setIsAIThinking(true);
      const observations = subconsciousProcessor.getRecentObservations();
      const novaResponse = await continueConversation(turn.userInput, currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, observations, experimentalFeatures);
      processResponse(novaResponse);
      setChatMessages(prev => prev.map(msg => msg.id === aiMessage.id ? { ...msg, thought: novaResponse.thought } : msg));
    } catch (error) {
       console.error('Error getting background response from Gemini:', error);
    } finally {
      setIsAIThinking(false);
    }
  }, [currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, processResponse, subconsciousProcessor, experimentalFeatures]);

  const { connectionState, connect, disconnect, liveUserTranscript } = useVoice({ onTurnComplete: handleTurnComplete });

  const handleSendMessage = useCallback(async (message: string) => {
    if (isAIThinking || !message.trim()) return;

    setLastInteractionTime(Date.now());
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: message, feedback: null };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsAIThinking(true);
    setCurrentThought(null);
    setAiHypotheses([]);
    setChatInput('');

    try {
      const observations = subconsciousProcessor.getRecentObservations();
      const novaResponse = await continueConversation(message, currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, observations, experimentalFeatures);
      const aiMessage: ChatMessage = { id: `${Date.now()}-ai`, sender: 'ai', text: novaResponse.response, thought: novaResponse.thought, feedback: null };
      
      if (novaResponse.response) {
        setChatMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
      processResponse(novaResponse);

    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      const errorMsg = 'I seem to be having trouble connecting. Please check your connection and API key.';
      setChatMessages((prevMessages) => [...prevMessages, { id: `${Date.now()}-error`, sender: 'ai', text: errorMsg, thought: 'A critical error occurred.', feedback: null }]);
    } finally {
      setIsAIThinking(false);
    }
  }, [isAIThinking, currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, processResponse, subconsciousProcessor, experimentalFeatures]);
  
  const handleMessageFeedback = useCallback(async (messageId: string, feedback: 'positive' | 'negative') => {
    setChatMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, feedback } : msg));
    const targetMessage = chatMessages.find(msg => msg.id === messageId);
    if (!targetMessage) return;

    try {
      const feedbackInstruction = `FEEDBACK::${feedback}`;
      const observations = subconsciousProcessor.getRecentObservations();
      const novaResponse = await continueConversation(feedbackInstruction, currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, observations, experimentalFeatures, targetMessage.text);
      processResponse(novaResponse);
    } catch (error) {
      console.error('Error sending feedback to Gemini:', error);
    }
  }, [chatMessages, currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, processResponse, subconsciousProcessor, experimentalFeatures]);

  useEffect(() => {
    if (isAuthenticated && !isMounted.current) {
      isMounted.current = true;
      startChat();
      setLastInteractionTime(Date.now());
      const welcomeMsg = `Greetings, ${userProfile.name}. I am NovaMind GPT, your hyper-conscious learning AI companion. I am now online and attuned to your presence. How may I serve you on this day?`;
      setChatMessages([{ id: 'welcome', sender: 'ai', text: welcomeMsg, thought: 'Greeting the user with my new purpose.', feedback: null }]);
      setEmailItems(mockEmails);
      setTaskItems(mockTasks);
      setPhoneCalls(mockPhoneCalls);
      setSocialMentions(mockSocialMentions);
      setBusinessMetrics(mockBusinessMetrics);
      setMeetings(mockMeetings);
      setCognitiveInsights(mockCognitiveInsights);
    }
  }, [isAuthenticated, userProfile.name]);
  
  const handleGenerateReply = useCallback(async (emailId: string) => {
    const targetEmail = emailItems.find(e => e.id === emailId);
    if (!targetEmail || targetEmail.suggestedReply) return;
    setEmailItems(prev => prev.map(e => e.id === emailId ? { ...e, suggestedReply: '...' } : e));

    try {
      const suggestion = await generateSuggestedReply(targetEmail, userProfile);
      setEmailItems(prev => prev.map(e => e.id === emailId ? { ...e, suggestedReply: suggestion } : e));
    } catch (error) {
       setEmailItems(prev => prev.map(e => e.id === emailId ? { ...e, suggestedReply: 'Error generating reply.' } : e));
    }
  }, [emailItems, userProfile]);
  
  const handleReady = useCallback(() => setIsReady(true), []);
  
  const handleNewVisualContext = useCallback((context: VisualContext) => {
    setVisualContext(context);
    setCurrentEmotion(context.emotion);
    setEmotionHistory(prev => [{ emotion: context.emotion, timestamp: new Date() }, ...prev.slice(0, 49)]);
    setUserState(prev => ({ ...(prev || defaultUserState), inferredLocation: context.environmentDescription, inferredSocialContext: context.socialContext }));

    if (previousEmotion.current) {
        const intensityDiff = Math.abs(context.emotion.intensity - previousEmotion.current.intensity);
        if (context.emotion.label !== previousEmotion.current.label || intensityDiff > 30) {
            createEngram('aura_shift', `Emotion shifted from ${previousEmotion.current.label} (${previousEmotion.current.intensity}%) to ${context.emotion.label} (${context.emotion.intensity}%).`);
        }
    }
    previousEmotion.current = context.emotion;
  }, [createEngram]);

  useEffect(() => {
    const botInterval = setInterval(() => {
      setBots(prevBots => 
        prevBots.map(bot => {
          if (bot.status === 'Working' && (bot.progress ?? 0) < 100) {
            const newProgress = Math.min(100, (bot.progress ?? 0) + Math.random() * 15);
            if (newProgress >= 100) {
              const newFile: EncryptedFile = {
                id: `file-result-${bot.id}`, name: `${bot.name}_result.txt`, type: 'Text', uploadDate: new Date().toLocaleDateString(),
                content: `Final report for task: "${bot.currentTask}".\n\n[Simulation Complete]\nAnalysis:\nThe task was completed with a 98.7% success rating based on internal metrics.\n\nDetails:\n- Data points processed: 1,482\n- Key insights discovered: 3\n- Time to completion: 4.7 seconds (simulated)\n\nThis document was automatically generated by ${bot.name}.`
              };
              setFiles(prev => [newFile, ...prev]);
              addNotification(`Bot "${bot.name}" completed its task.`, 'success');
              createEngram('task_completion', `Bot "${bot.name}" completed task: ${bot.currentTask}`);
              return { ...bot, progress: 100, status: 'Completed', resultFileId: newFile.id };
            }
            return { ...bot, progress: newProgress };
          }
          return bot;
        })
      );
    }, 2000);
    return () => clearInterval(botInterval);
  }, [addNotification, createEngram]);

  useEffect(() => {
    const subconsciousInterval = setInterval(() => {
        subconsciousProcessor.processTick({ emotion: currentEmotion, userState: userState, recentMessage: chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null });
    }, 5000);
    return () => clearInterval(subconsciousInterval);
  }, [subconsciousProcessor, currentEmotion, userState, chatMessages]);
  
  useEffect(() => {
    const PROACTIVE_IDLE_TIMEOUT = 60000;
    const PROACTIVE_CHECK_INTERVAL = 15000;

    const timer = setInterval(async () => {
      const isUserActive = isAIThinking || chatInput.trim() !== '' || connectionState === 'CONNECTED';
      if (isUserActive) {
        setLastInteractionTime(Date.now());
        return;
      }
      
      const isIdle = Date.now() - lastInteractionTime > PROACTIVE_IDLE_TIMEOUT;
      const shouldBeProactive = botPersona.proactivity > 60;
      
      if (isReady && isIdle && shouldBeProactive) {
        setLastInteractionTime(Date.now());
        setIsAIThinking(true);
        setCurrentThought("Sensing the moment...");
        try {
          const observations = subconsciousProcessor.getRecentObservations();
          const novaResponse = await getProactiveMessage(currentEmotion, userProfile, botPersona, connectedAccounts, visualContext, neuroMemories, observations, experimentalFeatures);
          if (novaResponse.response.trim()) {
            processResponse(novaResponse);
            setChatMessages((prev) => [...prev, { id: `${Date.now()}-proactive`, sender: 'ai', text: novaResponse.response, thought: novaResponse.thought, feedback: null }]);
          }
        } catch (error) {
          console.error('Error during proactive check:', error);
        } finally {
          setIsAIThinking(false);
          setCurrentThought(null);
        }
      }
    }, PROACTIVE_CHECK_INTERVAL);

    return () => clearInterval(timer);
  }, [isAIThinking, chatInput, lastInteractionTime, currentEmotion, connectionState, isReady, userProfile, botPersona, visualContext, connectedAccounts, neuroMemories, processResponse, subconsciousProcessor, experimentalFeatures]);

  useEffect(() => {
    const INSIGHT_INTERVAL = 90000;
    const insightTimer = setInterval(async () => {
        if (!isReady || !userState) return;
        const newInsights = await generateCognitiveStream(userState, currentEmotion, neuroMemories, userProfile);
        if (newInsights && newInsights.length > 0) {
            setCognitiveInsights(prev => [...newInsights, ...prev].slice(0, 20));
        }
    }, INSIGHT_INTERVAL);
    return () => clearInterval(insightTimer);
  }, [isReady, userState, currentEmotion, neuroMemories, userProfile]);

  const handleSignIn = ({ email }: { email: string }) => {
      const nameFromEmail = email.split('@')[0];
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      setUserProfile({ ...initialUserProfile, name: capitalizedName || 'User', username: nameFromEmail, email });
      setIsAuthenticated(true);
  };
  const handleSignOut = () => {
    setIsAuthenticated(false); setChatMessages([]); setNeuroMemories([]); setEmotionHistory([]); setCurrentEmotion(null);
    setUserProfile(initialUserProfile); setConnectedAccounts([]); isMounted.current = false;
    setBotPersona(initialBotPersona); setExperimentalFeatures(initialExperimentalFeatures); closeAllPanels();
  };
  const handleClearData = () => {
    if (window.confirm("Are you sure? This will clear the conversation and all memories.")) {
        setChatMessages(prev => prev.slice(0, 1)); setNeuroMemories([]);
    }
  };
  const handleConnectAccount = (provider: AccountProvider) => {
    setConnectingProvider(provider);
    setTimeout(() => {
        const identifier = userProfile.email || `${userProfile.name.toLowerCase()}@${provider}.com`;
        setConnectedAccounts(prev => [...prev, { provider, email: identifier, scopes: ['all'] }]);
        setConnectingProvider(null);
    }, 1500);
  };
  const handleDisconnectAccount = (provider: AccountProvider) => setConnectedAccounts(prev => prev.filter(acc => acc.provider !== provider));

  const toggleVoiceSession = useCallback(() => {
    if (connectionState === 'CONNECTED') disconnect();
    else if (['IDLE', 'ERROR'].includes(connectionState)) {
      const recentMemories = neuroMemories.slice(-5).map(m => `- (${m.type}) ${m.content}`).join('\n');
      const contextString = `Current context: User is ${userProfile.name}, their emotion is ${currentEmotion?.label || 'Unknown'} with ${currentEmotion?.intensity || 'N/A'} intensity. Environment: ${visualContext?.environmentDescription || 'N/A'}. Recent memories: ${recentMemories || 'None'}.`;
      connect(contextString.trim());
    }
  }, [connectionState, connect, disconnect, neuroMemories, userProfile, currentEmotion, visualContext]);
    
  const handleOpenFile = (fileId: string) => {
    const fileToView = files.find(f => f.id === fileId);
    if (fileToView) setViewingFile(fileToView);
  };

  const handleBotAction = (botId: string, action: 'pause' | 'resume' | 'cancel') => {
    setBots(prevBots => prevBots.map(bot => {
        if (bot.id === botId) {
            if (action === 'pause' && bot.status === 'Working') return { ...bot, status: 'Paused' as BotStatus };
            if (action === 'resume' && bot.status === 'Paused') return { ...bot, status: 'Working' as BotStatus };
            if (action === 'cancel') return { ...bot, status: 'Cancelled' as BotStatus, progress: 0 };
        }
        return bot;
    }));
  };

  const handleInsightAction = useCallback((insight: CognitiveInsight) => {
      if (insight.action.type === 'explore_in_chat' && insight.action.prompt) {
          setChatInput(insight.action.prompt);
          closeAllPanels();
      } else if (insight.action.type === 'suggest_persona_tune' && insight.action.payload) {
          const { key, value } = insight.action.payload;
          setBotPersona(prev => ({...prev, [key]: value}));
          addNotification(`Persona updated: ${key} set to ${value}.`, 'success');
          setCognitiveInsights(prev => prev.filter(i => i.id !== insight.id));
      }
  }, [addNotification, closeAllPanels]);

  if (!isAuthenticated) {
    return <SignIn onSignIn={handleSignIn} onSignUp={(d) => handleSignIn({email: d.email})} onGuestSignIn={() => handleSignIn({ email: 'guest@novamind.ai'})} />;
  }

  return (
    <div className="h-screen bg-gray-900 flex items-stretch relative font-sans overflow-hidden">
      <DynamicBackground emotion={currentEmotion} />
      
      <SideBar onTogglePanel={handleTogglePanel} activePanel={activePanel} />

      {/* --- UI Panels & Modals --- */}
      <HealthTab isOpen={activePanel === 'bio-resonance'} onClose={closeAllPanels} visualContext={visualContext} emotionHistory={emotionHistory} userState={userState} />
      <CognitiveStreamTab isOpen={activePanel === 'cognitive'} onClose={closeAllPanels} insights={cognitiveInsights} onInsightAction={handleInsightAction} />
      <ConsciousnessVisualizer isOpen={activePanel === 'consciousness'} onClose={closeAllPanels} memories={neuroMemories} hypotheses={aiHypotheses} isThinking={isAIThinking} />
      <IdentityHubTab isOpen={activePanel === 'identity'} onClose={closeAllPanels} userProfile={userProfile} onProfileUpdate={setUserProfile} onSignOut={handleSignOut} onClearData={handleClearData} connectedAccounts={connectedAccounts} onConnect={handleConnectAccount} onDisconnect={handleDisconnectAccount} connectingProvider={connectingProvider} botPersona={botPersona} onPersonaUpdate={setBotPersona} experimentalFeatures={experimentalFeatures} onFeaturesChange={setExperimentalFeatures} />
      <EmailTab isOpen={activePanel === 'email'} onClose={closeAllPanels} emails={emailItems} onEmailAction={(prompt) => { closeAllPanels(); setChatInput(prompt); }} />
      <PhoneTab isOpen={activePanel === 'phone'} onClose={closeAllPanels} calls={phoneCalls} onCallAction={(prompt) => { closeAllPanels(); setChatInput(prompt); }} />
      <MessagingTab isOpen={activePanel === 'messaging'} onClose={closeAllPanels} messages={mockMessages} />
      <WebSocialTab isOpen={activePanel === 'web-social'} onClose={closeAllPanels} mentions={socialMentions} />
      <BusinessHubTab isOpen={activePanel === 'business'} onClose={closeAllPanels} metrics={businessMetrics} tasks={taskItems} meetings={meetings} />
      <BotHubTab isOpen={activePanel === 'bots'} onClose={closeAllPanels} bots={bots} onBotAction={handleBotAction} onViewBotDetails={(bot) => { setSelectedBotForDetail(bot); }} />

      <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />
      <BotDetailView bot={selectedBotForDetail} onClose={() => setSelectedBotForDetail(null)} onViewFile={handleOpenFile} />

      {/* --- Notifications --- */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-3">
        {notifications.map(n => (<Notification key={n.id} notification={n} onDismiss={dismissNotification} />))}
      </div>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col items-center">
        <div className="z-10 w-full max-w-3xl h-full flex flex-col items-stretch sm:py-6 gap-2 sm:gap-4">
          <Header isAIThinking={isAIThinking} voiceConnectionState={connectionState} />
          <div className="flex-grow flex flex-col min-h-0">
             <ChatInterface messages={chatMessages} isLoading={isAIThinking || connectionState === 'CONNECTING'} onSendMessage={handleSendMessage} isReady={isReady} onVisualContextChange={handleNewVisualContext} onReady={handleReady} currentEmotion={currentEmotion} currentThought={currentThought} voiceConnectionState={connectionState} toggleVoiceSession={toggleVoiceSession} liveUserTranscript={liveUserTranscript} visualContext={visualContext} input={chatInput} setInput={setChatInput} onMessageFeedback={handleMessageFeedback} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
