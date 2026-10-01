// AI Provider Service for LinguaMate AI - Powered by Gemini
import { CefrLevel, SpeakingFeedback, SpeakingMessage, SpeakingMistake } from '@/types';

export interface ConversationTurnRequest {
  language: string;
  cefrLevel: CefrLevel;
  topic: string;
  mode: string;
  history: SpeakingMessage[];
  userMessage: string;
  partner?: {
    name: string;
    voiceGender: string;
    voiceStyle: string;
    personality: string;
  };
  userProfile?: {
    name: string;
    currentLevel: string;
    learningLanguage: string;
  };
}

export interface ConversationTurnResponse {
  aiReply: string;
  detectedLevel: CefrLevel;
}

class AIProviderService {
  // Generate conversational reply powered by Gemini API Route
  public async generateConversation(
    request: ConversationTurnRequest
  ): Promise<ConversationTurnResponse> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: request.history.map((h) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            text: h.text,
          })),
          userMessage: request.userMessage,
          partner: request.partner,
          userProfile: request.userProfile || {
            name: 'Friend',
            currentLevel: request.cefrLevel,
            learningLanguage: request.language,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          return {
            aiReply: data.reply,
            detectedLevel: request.cefrLevel,
          };
        }
      }
    } catch (err) {
      console.error('Failed to communicate with AI chat service:', err);
    }

    // Direct fallback if fetch network fails
    const isGerman =
      request.language.toLowerCase().includes('german') ||
      request.language === 'de';
    const defaultReply = isGerman
      ? 'Das ist ein sehr interessanter Gedanke! Was denkst du noch darüber?'
      : 'That is a really fascinating perspective! Could you tell me more about that?';

    return {
      aiReply: defaultReply,
      detectedLevel: request.cefrLevel,
    };
  }
}

export const aiProvider = new AIProviderService();
