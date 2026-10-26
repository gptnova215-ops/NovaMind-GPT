
import type { EmotionState, UserStateVector, ChatMessage, SubconsciousObservation } from '../types';

interface SubconsciousContext {
    emotion: EmotionState | null;
    userState: UserStateVector | null;
    recentMessage: ChatMessage | null;
}

const MAX_OBSERVATIONS = 10;

export class SubconsciousProcessor {
    private observations: SubconsciousObservation[] = [];

    private addObservation(observation: string, relevance: number) {
        this.observations.push({ timestamp: new Date(), observation, relevance });
        if (this.observations.length > MAX_OBSERVATIONS) {
            this.observations.shift(); // Keep the list trimmed
        }
    }

    public processTick(context: SubconsciousContext) {
        const { emotion, userState } = context;

        // --- Emotion Analysis ---
        if (emotion) {
            if (emotion.intensity > 85 && Math.random() < 0.3) {
                this.addObservation("User's emotional intensity is extremely high.", 80);
            }
            if (emotion.stability < 30 && Math.random() < 0.4) {
                this.addObservation("A turbulent emotional state detected; potential agitation.", 75);
            }
            if (emotion.label === 'Sadness' && Math.random() < 0.5) {
                this.addObservation("Sadness is the dominant emotion, user may be feeling down.", 85);
            }
             if (emotion.label === 'Agitation' && Math.random() < 0.5) {
                this.addObservation("Agitation is the dominant emotion, user may be stressed or anxious.", 85);
            }
        }

        // --- User State Analysis ---
        if (userState) {
            if (userState.stressLevel === 'High' || userState.stressLevel === 'Very High') {
                if (Math.random() < 0.5) this.addObservation("User's stress level is elevated.", 90);
            }
            if (userState.focusLevel < 30 && userState.activity === 'Stationary') {
                 if (Math.random() < 0.2) this.addObservation("User's focus appears low while stationary.", 60);
            }
            if (userState.inferredTypingCadence === 'Rapid & Intense') {
                if (Math.random() < 0.3) this.addObservation("User is typing rapidly, suggesting urgency or high engagement.", 70);
            }
        }
        
        // Decay relevance of old observations
        this.observations.forEach(obs => {
            obs.relevance *= 0.9; 
        });
        this.observations = this.observations.filter(obs => obs.relevance > 10);
    }

    public getRecentObservations(): SubconsciousObservation[] {
        return [...this.observations].sort((a, b) => b.relevance - a.relevance);
    }
}
