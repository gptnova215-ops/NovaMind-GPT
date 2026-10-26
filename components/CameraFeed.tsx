
import React, { useRef, useEffect, useState, useCallback, CSSProperties } from 'react';
import type { VisualContext } from '../types';
import { analyzeFrame } from '../services/localEmpathyService';
import { EMOTION_CONFIG } from '../constants';

interface EmotionSensorProps {
  onVisualContextChange: (context: VisualContext) => void;
  onReady: () => void;
}

export const EmotionSensor: React.FC<EmotionSensorProps> = ({ onVisualContextChange, onReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMediaOn, setIsMediaOn] = useState(false);
  const [currentEmotionColor, setCurrentEmotionColor] = useState<string | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          // These constraints help in capturing clearer audio for analysis
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }, 
        video: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      audioContextRef.current = context;
      
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMediaOn(true);
      onReady();
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Camera and microphone access denied. Please enable permissions in your browser settings.");
      setIsMediaOn(false);
    }
  }, [onReady]);

  useEffect(() => {
    startMedia();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [startMedia]);

  useEffect(() => {
    if (!isMediaOn) return;

    const contextDetectionInterval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;

      const video = videoRef.current;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      // Get audio data for analysis
      const analyser = analyserRef.current;
      let frequencyData: Uint8Array | null = null;
      if (analyser) {
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
      }

      try {
        const visualContext = await analyzeFrame(ctx, video.videoWidth, video.videoHeight, frequencyData);
        if (visualContext) {
            onVisualContextChange(visualContext);
            const emotionConfig = EMOTION_CONFIG[visualContext.emotion.label];
            setCurrentEmotionColor(emotionConfig.rgb);
        }
      } catch (error) {
        console.error("Local visual context analysis failed:", error);
      }
    }, 2000); // Check every 2 seconds for a more responsive feel

    return () => clearInterval(contextDetectionInterval);
  }, [isMediaOn, onVisualContextChange]);

  // FIX: Cast style object to CSSProperties to allow for CSS custom properties like '--emotion-color'.
  const overlayStyle = {
    '--emotion-color': currentEmotionColor || '96, 165, 250',
    backgroundColor: `rgba(var(--emotion-color), 0.1)`,
    transition: 'background-color 2000ms ease-in-out',
  } as CSSProperties;

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-700/50 shadow-xl shadow-black/50 bg-gray-900 flex items-center justify-center">
      {error ? (
        <div className="p-2 text-center text-rose-400 text-xs">
          <p>{error}</p>
        </div>
      ) : (
         <>
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 transition-opacity duration-500 ${isMediaOn ? 'opacity-100' : 'opacity-0'}`}
          />
          <div 
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${isMediaOn ? 'opacity-100' : 'opacity-0'}`}
            style={overlayStyle}
          />
        </>
      )}
       {!isMediaOn && !error && (
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
         </div>
       )}
    </div>
  );
};
