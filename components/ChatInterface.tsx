import React, { useEffect, useRef } from 'react';
import type { ChatMessage, EmotionState, VoiceConnectionState, VisualContext } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { EmotionSensor } from './CameraFeed';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { AuraVisualizer } from './AuraVisualizer';
import { EMOTION_CONFIG } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  isReady: boolean;
  onVisualContextChange: (context: VisualContext) => void;
  onReady: () => void;
  currentEmotion: EmotionState | null;
  currentThought: string | null;
  voiceConnectionState: VoiceConnectionState;
  toggleVoiceSession: () => void;
  liveUserTranscript: string;
  visualContext: VisualContext | null;
  input: string;
  setInput: (value: string) => void;
  onMessageFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  isLoading, 
  onSendMessage, 
  isReady,
  onVisualContextChange,
  onReady,
  currentEmotion,
  currentThought,
  voiceConnectionState,
  toggleVoiceSession,
  liveUserTranscript,
  visualContext,
  input,
  setInput,
  onMessageFeedback
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const emotionConfig = currentEmotion ? EMOTION_CONFIG[currentEmotion.label] : null;
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, currentThought]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && isReady) {
      onSendMessage(input);
    }
  };
  
  const isVoiceActive = voiceConnectionState === 'CONNECTED' || voiceConnectionState === 'CONNECTING';

  return (
    <div className="h-full flex flex-col">
      <div ref={scrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col items-start ${msg.sender === 'user' ? 'items-end' : ''}`}>
             <div className={`group flex items-start space-x-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center border border-indigo-400/50">
                    <BrainCircuitIcon className={`w-5 h-5 text-indigo-300`} />
                  </div>
                )}
                <div className={`rounded-lg p-3 max-w-xs md:max-w-md ${msg.sender === 'ai' ? 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 border border-gray-600/50' : 'bg-gradient-to-br from-blue-600/70 to-blue-700/70'}`}>
                   {msg.thought && (
                    <p className="text-xs text-indigo-300/70 italic border-b border-indigo-300/20 pb-2 mb-2">
                      {msg.thought}
                    </p>
                  )}
                  <p className="text-gray-200 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
                </div>
                 {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 self-center flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {(msg.feedback === undefined || msg.feedback === null) ? (
                      <>
                        <button onClick={() => onMessageFeedback(msg.id, 'positive')} className="p-1 text-gray-400 hover:text-emerald-400 rounded-full hover:bg-gray-900/50" aria-label="Good response">
                          <ThumbsUpIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onMessageFeedback(msg.id, 'negative')} className="p-1 text-gray-400 hover:text-rose-400 rounded-full hover:bg-gray-900/50" aria-label="Bad response">
                          <ThumbsDownIcon className="w-4 h-4" />
                        </button>
                      </>
                    ) : msg.feedback === 'positive' ? (
                      <ThumbsUpIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ThumbsDownIcon className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                )}
            </div>
          </div>
        ))}
        {isLoading && voiceConnectionState !== 'CONNECTING' && (
          <div className="flex items-start space-x-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center border border-indigo-400/50">
                <BrainCircuitIcon className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
            <div className="bg-gray-700/60 rounded-lg p-3 w-full max-w-xs md:max-w-md">
              {currentThought ? (
                <p className="text-sm text-indigo-300/80 italic animate-pulse">
                  {currentThought}
                </p>
              ) : (
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Video Feed and Input Section */}
      <div className="p-4 bg-gray-900/30 backdrop-blur-sm rounded-2xl">
        <div className="flex flex-col justify-center items-center mb-2">
            <div className={`relative w-28 h-28 sm:w-32 sm:h-32`}>
                <AuraVisualizer emotion={currentEmotion} />
                <div className={`absolute inset-0 flex items-center justify-center`}>
                    <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300 ${voiceConnectionState === 'CONNECTED' ? 'ring-4 ring-green-500 ring-opacity-75' : ''}`}>
                        <EmotionSensor 
                            onVisualContextChange={onVisualContextChange}
                            onReady={onReady}
                        />
                    </div>
                </div>
            </div>
            {currentEmotion && (
                <div className="mt-2 z-10">
                    <span className={`bg-gray-800/50 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
                        <span className={`text-${emotionConfig?.color || 'gray-300'} transition-colors duration-1000 font-bold`}>
                            {currentEmotion.label}
                        </span>
                    </span>
                </div>
            )}
        </div>
        
        {visualContext && (
          <div className="text-center text-xs text-gray-400 mb-3 leading-tight">
            <p>Sensing: <span className="font-medium text-gray-300">{visualContext.environmentDescription}</span>. You seem <span className="font-medium text-gray-300">{visualContext.userAppearance.toLowerCase()}</span>.</p>
          </div>
        )}

        {isVoiceActive ? (
          <div className="h-[42px] flex flex-col items-center justify-center text-center">
            <p className="text-gray-300 italic text-sm min-h-[20px]">{liveUserTranscript || (voiceConnectionState === 'CONNECTING' ? 'Connecting...' : 'Listening...')}</p>
            <button onClick={toggleVoiceSession} className="mt-2 text-xs text-rose-400 hover:text-rose-300">End Session</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isReady ? "Ask and you shall receive..." : "Awaiting connection..."}
              disabled={!isReady || isLoading}
              className="w-full bg-gray-700/50 text-gray-200 placeholder-gray-400 rounded-lg px-4 py-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              aria-label="Your message"
            />
            <button
              type="submit"
              disabled={!isReady || isLoading}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        )}

        <div className="flex justify-center mt-3">
          <button
            type="button"
            onClick={toggleVoiceSession}
            disabled={!isReady || isLoading}
            className={`p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              ${voiceConnectionState === 'CONNECTED' ? 'bg-rose-500/50 text-rose-200 hover:bg-rose-500/70' : ''}
              ${voiceConnectionState === 'CONNECTING' ? 'bg-yellow-500/50 text-yellow-200 animate-pulse' : ''}
              ${voiceConnectionState === 'IDLE' ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-700' : ''}
              ${voiceConnectionState === 'ERROR' ? 'bg-red-500/50 text-red-200' : ''}
            `}
            aria-label={isVoiceActive ? "End voice session" : "Start voice session"}
          >
            <MicrophoneIcon className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
};
