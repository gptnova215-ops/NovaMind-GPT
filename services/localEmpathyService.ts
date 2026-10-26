
import type { VisualContext, InferredSocialContext, EmotionState, SensoryData, EmotionLabel } from '../types';
import { EMOTION_CONFIG } from '../constants';

let lastImageData: Uint8ClampedArray | null = null;
let lastEmotion: EmotionLabel = 'Calm';
let stabilityCounter = 0;

const analyzeDominantColor = (imageData: ImageData): { r: number, g: number, b: number } | null => {
    const colorCounts: Record<string, number> = {};
    let maxCount = 0;
    let dominantColor: string | null = null;

    // Sample a grid of pixels for performance
    const step = 20;
    for (let y = 0; y < imageData.height; y += step) {
        for (let x = 0; x < imageData.width; x += step) {
            const i = (y * imageData.width + x) * 4;
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const key = `${r},${g},${b}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
            if (colorCounts[key] > maxCount) {
                maxCount = colorCounts[key];
                dominantColor = key;
            }
        }
    }

    if (dominantColor) {
        const [r, g, b] = dominantColor.split(',').map(Number);
        return { r, g, b };
    }
    return null;
};

const analyzeVocalEnergy = (frequencyData: Uint8Array | null): number => {
    if (!frequencyData) return 0;
    const sum = frequencyData.reduce((a, b) => a + b, 0);
    const average = sum / frequencyData.length;
    return Math.min(100, Math.floor(average * 1.5)); // Normalize and scale
};

const simulateHeartRate = (frequencyData: Uint8Array | null): number => {
    if (!frequencyData) return 65;
    // Simulate by looking at low-frequency, low-amplitude "rumble"
    const lowFreqEnergy = (frequencyData[1] + frequencyData[2] + frequencyData[3]) / 3;
    const baseHeartRate = 60;
    const variation = Math.min(40, lowFreqEnergy * 2); // Cap variation
    return Math.floor(baseHeartRate + (Math.random() * 10 - 5) + variation);
};

const analyzeFocus = (currentFrame: ImageData): number => {
    // Define a "face" region (top-center) to simulate eye/micro-expression tracking
    const faceX = Math.floor(currentFrame.width * 0.25);
    const faceY = 0;
    const faceWidth = Math.floor(currentFrame.width * 0.5);
    const faceHeight = Math.floor(currentFrame.height * 0.5);

    if (!lastImageData || lastImageData.length !== currentFrame.data.length) {
        lastImageData = new Uint8ClampedArray(currentFrame.data);
        return 100; // Assume focus initially
    }

    let diff = 0;
    const step = 4 * 5; // Sample every 5th pixel in the region
    for (let y = faceY; y < faceHeight; y += 5) {
        for (let x = faceX; x < faceWidth; x += 5) {
            const i = (y * currentFrame.width + x) * 4;
            const grayCurrent = (currentFrame.data[i] + currentFrame.data[i+1] + currentFrame.data[i+2]) / 3;
            const grayLast = (lastImageData[i] + lastImageData[i+1] + lastImageData[i+2]) / 3;
            diff += Math.abs(grayCurrent - grayLast);
        }
    }
    
    lastImageData = new Uint8ClampedArray(currentFrame.data);
    
    const motionScore = (diff / ((faceWidth * faceHeight) / 25)) * 3;
    // Invert the score: less motion means more focus
    const focusScore = 100 - Math.min(100, Math.floor(motionScore));
    return focusScore;
};


export const analyzeFrame = async (ctx: CanvasRenderingContext2D, width: number, height: number, frequencyData: Uint8Array | null): Promise<VisualContext> => {
    const imageData = ctx.getImageData(0, 0, width, height);

    // --- Generate Sensory Data ---
    const sensoryData: SensoryData = {
        dominantColor: analyzeDominantColor(imageData),
        vocalEnergy: analyzeVocalEnergy(frequencyData),
        focusMetric: analyzeFocus(imageData),
        simulatedHeartRate: simulateHeartRate(frequencyData),
    };

    // --- Emotion State Machine ---
    let detectedEmotion: EmotionLabel = 'Calm';

    if (sensoryData.vocalEnergy > 60 && sensoryData.simulatedHeartRate > 90) {
        detectedEmotion = 'Agitation';
    } else if (sensoryData.dominantColor && (sensoryData.dominantColor.r > 150 && sensoryData.dominantColor.g < 100)) {
        detectedEmotion = 'Agitation'; // Red tones
    } else if (sensoryData.dominantColor && (sensoryData.dominantColor.g > 150 && sensoryData.dominantColor.r > 150)) {
        detectedEmotion = 'Joy'; // Yellow/Orange tones
    } else if (sensoryData.dominantColor && (sensoryData.dominantColor.g > 120 && sensoryData.dominantColor.r < 100)) {
        detectedEmotion = 'Contentment'; // Green tones
    } else if (sensoryData.focusMetric > 85 && sensoryData.vocalEnergy < 20) {
        detectedEmotion = 'Focus';
    } else if (sensoryData.vocalEnergy < 15 && sensoryData.simulatedHeartRate < 65) {
        detectedEmotion = 'Sadness';
    } else if (sensoryData.vocalEnergy > 50) {
        detectedEmotion = 'Inspired';
    }

    // Calculate stability
    if (detectedEmotion === lastEmotion) {
        stabilityCounter = Math.min(10, stabilityCounter + 1);
    } else {
        stabilityCounter = 0;
    }
    lastEmotion = detectedEmotion;
    const stability = stabilityCounter * 10;

    // Calculate intensity
    const intensity = Math.min(100, Math.floor(sensoryData.vocalEnergy + ((100-sensoryData.focusMetric)/2) ));


    const emotion: EmotionState = {
        label: detectedEmotion,
        intensity: intensity,
        stability: stability,
    };

    // --- Other fields ---
    const environmentDescription = "an indoor setting";
    const userAppearance = "attentive";
    const socialContext: InferredSocialContext = 'Alone';

    return {
        emotion,
        sensoryData,
        userAppearance,
        environmentDescription,
        socialContext,
    };
};
