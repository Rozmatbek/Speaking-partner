// AI Provider Service Abstraction for LinguaMate AI
import { CefrLevel, SpeakingFeedback, SpeakingMessage, SpeakingMistake } from '@/types';

export interface AIProviderConfig {
  apiKey?: string;
  provider?: 'openai' | 'gemini' | 'anthropic' | 'demo';
  model?: string;
}

export interface ConversationTurnRequest {
  language: string;
  cefrLevel: CefrLevel;
  topic: string;
  mode: string;
  history: SpeakingMessage[];
  userMessage: string;
  userPreferredStyle?: string;
}

export interface ConversationTurnResponse {
  aiReply: string;
  suggestedQuickReplies: string[];
  instantCorrections?: SpeakingMistake[];
  detectedLevel: CefrLevel;
}

export interface WritingEvaluationRequest {
  examType: string;
  taskPrompt: string;
  userEssay: string;
  timeSpentSeconds: number;
}

export interface WritingEvaluationResponse {
  estimatedBand: string;
  cefrLevel: CefrLevel;
  taskAchievement: number; // 0-100
  coherenceAndCohesion: number;
  lexicalResource: number;
  grammaticalAccuracy: number;
  mistakes: Array<{ original: string; suggested: string; explanation: string }>;
  overallFeedback: string;
  betterAlternatives: string[];
}

class AIProviderService {
  private isDemoMode: boolean = true;

  constructor() {
    this.isDemoMode = !process.env.NEXT_PUBLIC_AI_API_KEY;
  }

  // Generate conversational reply
  public async generateConversation(
    request: ConversationTurnRequest
  ): Promise<ConversationTurnResponse> {
    const isGerman = request.language.toLowerCase().includes('german') || request.language === 'de';

    // Tailored responses based on level and context
    const responsesByLevel: Record<string, string[]> = {
      English_A1: [
        `Hello! Nice to meet you. I am glad you are practicing English. How was your day today?`,
        `That sounds very interesting! What do you like to do in your free time?`,
        `I understand! Do you prefer coffee or tea in the morning?`,
        `Great job! Tell me a little about your hometown or family.`,
      ],
      English_B1: [
        `That's a very thoughtful point! When I think about ${request.topic.toLowerCase()}, it usually depends on personal habits. What made you interested in this topic?`,
        `I completely see what you mean. In fact, many students face similar challenges. How do you usually handle such situations?`,
        `Interesting perspective! Could you elaborate a bit more on why you feel that way?`,
        `That makes total sense. If you had the opportunity to change one thing about that, what would it be?`,
      ],
      English_B2: [
        `You articulated that quite effectively! Examining ${request.topic.toLowerCase()} from a broader viewpoint, there are distinct advantages and potential drawbacks. How would you weigh them?`,
        `That is a nuanced observation. Many people overlook that aspect entirely. What evidence or personal experience led you to this conclusion?`,
        `Fascinating! How do you foresee this trend evolving over the next five to ten years?`,
      ],
      English_C1: [
        `Your line of reasoning is compelling. However, considering the potential socioeconomic implications, one might argue that counter-measures are necessary. How would you counter that argument?`,
        `A remarkably sophisticated perspective. It touches on intrinsic human behavior and systemic factors. To what extent do you believe individual agency outweighs institutional structures in this context?`,
      ],
      German_A1: [
        `Hallo! Schön dich kennenzulernen. Wie geht es dir heute?`,
        `Das ist sehr interessant! Was machst du gern am Wochenende?`,
        `Sehr gut! Woher kommst du und wie lange lernst du schon Deutsch?`,
      ],
      German_B1: [
        `Das ist ein interessanter Gedanke! Beim Thema ${request.topic} gibt es ja verschiedene Meinungen. Was ist deine persönliche Erfahrung damit?`,
        `Ich verstehe genau, was du meinst. Viele Deutschlerner finden das auch spannend. Welche Vorteile siehst du darin?`,
        `Sehr gut ausgedrückt! Wenn du die Wahl hättest, wie würdest du dich entscheiden?`,
      ],
      German_B2: [
        `Das ist ein bemerkenswerter Gesichtspunkt. Im Vergleich zu früher hat sich die Situation stark gewandelt. Welche langfristigen Konsequenzen erwartest du?`,
        `Eine sehr überzeugende Argumentation! Allerdings betonen manche Experten auch die Kehrseite. Wie stehst du zu diesem Einwand?`,
      ]
    };

    const key = `${isGerman ? 'German' : 'English'}_${request.cefrLevel}`;
    const fallbackList = responsesByLevel[key] || responsesByLevel[`${isGerman ? 'German' : 'English'}_B1`];

    // Pick dynamic response matching turn count
    const index = request.history.length % fallbackList.length;
    let selectedReply = fallbackList[index];

    // Detect quick mistakes for instant pedagogical feedback
    const corrections: SpeakingMistake[] = [];
    const textLower = request.userMessage.toLowerCase();

    if (!isGerman) {
      if (textLower.includes('i am agree') || textLower.includes("i'm agree")) {
        corrections.push({
          mistake: 'I am agree',
          correction: 'I agree',
          explanation: 'In English, "agree" is a verb, not an adjective. Say "I agree" or "I disagree".'
        });
      }
      if (textLower.includes('people is')) {
        corrections.push({
          mistake: 'people is',
          correction: 'people are',
          explanation: '"People" is plural, so it takes the plural verb "are".'
        });
      }
      if (textLower.includes('he go ') || textLower.includes('she go ')) {
        corrections.push({
          mistake: 'he/she go',
          correction: 'he/she goes',
          explanation: 'Use third-person singular "-s/es" in present simple (he goes, she goes).'
        });
      }
    } else {
      if (textLower.includes('ich bin gut')) {
        corrections.push({
          mistake: 'Ich bin gut',
          correction: 'Mir geht es gut',
          explanation: 'To express "I am doing well" in German, use the dative idiom "Mir geht es gut".'
        });
      }
    }

    const quickReplies = isGerman
      ? ['Das stimmt genau.', 'Meiner Meinung nach...', 'Kannst du das erklären?']
      : ['I totally agree with that.', 'In my opinion...', 'Could you explain further?'];

    return {
      aiReply: selectedReply,
      suggestedQuickReplies: quickReplies,
      instantCorrections: corrections.length > 0 ? corrections : undefined,
      detectedLevel: request.cefrLevel
    };
  }

  // Generate full session post-evaluation feedback
  public async generateFeedback(
    messages: SpeakingMessage[],
    targetLevel: CefrLevel,
    language: string
  ): Promise<SpeakingFeedback> {
    const userMessages = messages.filter((m) => m.sender === 'user');
    const wordCount = userMessages.reduce(
      (acc, m) => acc + m.text.split(/\s+/).length,
      0
    );

    // Heuristic calculations for realistic feedback
    const baseScore = targetLevel === 'A1' ? 88 : targetLevel === 'B1' ? 82 : 78;
    const fluency = Math.min(Math.max(baseScore + (wordCount > 40 ? 5 : -2), 65), 94);
    const grammar = Math.min(Math.max(baseScore + (wordCount > 60 ? 4 : 0), 70), 92);
    const vocabulary = Math.min(Math.max(baseScore + (wordCount > 50 ? 6 : -3), 68), 95);
    const pronunciation = Math.min(Math.max(baseScore + 3, 72), 93);
    const coherence = Math.min(Math.max(baseScore + 4, 75), 96);

    const isGerman = language.toLowerCase().includes('german');

    const defaultMistakes: SpeakingMistake[] = isGerman
      ? [
          {
            mistake: 'weil ich will Deutsch lernen',
            correction: 'weil ich Deutsch lernen will',
            explanation: 'Subordinate clauses with "weil" send the conjugated verb to the end of the clause.'
          },
          {
            mistake: 'für machen das',
            correction: 'um das zu machen',
            explanation: 'Use "um ... zu + Infinitiv" to express purpose ("in order to do that").'
          }
        ]
      : [
          {
            mistake: 'I have visited there 2 years ago.',
            correction: 'I visited there 2 years ago.',
            explanation: 'Use the past simple ("visited") with specific finished time references like "2 years ago".'
          },
          {
            mistake: 'It is depend on the situation.',
            correction: 'It depends on the situation.',
            explanation: '"Depend" is a verb. Use "It depends on..." with third-person singular -s.'
          }
        ];

    const usefulVocab = isGerman
      ? [
          { word: 'Bemerkenswert', meaning: 'Remarkable / Noteworthy', level: 'B2' as CefrLevel },
          { word: 'Erfahrungsgemäß', meaning: 'Based on experience', level: 'B2' as CefrLevel },
          { word: 'Herausforderung', meaning: 'Challenge', level: 'B1' as CefrLevel },
        ]
      : [
          { word: 'Substantial', meaning: 'Of considerable importance or size', level: 'B2' as CefrLevel },
          { word: 'Nuanced', meaning: 'Characterized by subtle distinctions', level: 'C1' as CefrLevel },
          { word: 'In terms of', meaning: 'With regard to the aspect of', level: 'B1' as CefrLevel },
        ];

    const alternatives = isGerman
      ? [
          'Instead of "Ich denke das ist gut", say: "Meiner Ansicht nach bietet dies erhebliche Vorteile."',
          'Instead of "Ich habe keine Zeit", say: "Aus zeitlichen Gründen ist es mir momentan nicht möglich."'
        ]
      : [
          'Instead of "I think it is good", say: "From my perspective, this yields significant advantages."',
          'Instead of "I like it a lot", try: "I am particularly enthusiastic about it."'
        ];

    const pronunciationTips = [
      'Focus on vowel elongation in stressed syllables.',
      'Maintain smooth linking between consonant endings and vowel starts.',
      'Keep your intonation rising naturally on open-ended questions.'
    ];

    return {
      sessionId: `eval-${Date.now()}`,
      durationSeconds: messages.length * 15,
      totalExchanges: userMessages.length,
      estimatedLevel: targetLevel,
      scores: {
        fluency,
        grammar,
        vocabulary,
        pronunciation,
        coherence
      },
      mistakes: defaultMistakes,
      betterAlternatives: alternatives,
      usefulVocabulary: usefulVocab,
      pronunciationTips
    };
  }

  // Writing Evaluation for IELTS / Goethe
  public async evaluateWriting(
    request: WritingEvaluationRequest
  ): Promise<WritingEvaluationResponse> {
    const wordCount = request.userEssay.trim().split(/\s+/).length;
    
    let band = '6.5';
    let level: CefrLevel = 'B2';
    if (wordCount > 250) {
      band = '7.5';
      level = 'C1';
    } else if (wordCount < 150) {
      band = '5.5';
      level = 'B1';
    }

    return {
      estimatedBand: `Estimated ${band}`,
      cefrLevel: level,
      taskAchievement: wordCount >= 250 ? 85 : 70,
      coherenceAndCohesion: 80,
      lexicalResource: 82,
      grammaticalAccuracy: 78,
      mistakes: [
        {
          original: 'Nowadays people is heavily rely on technology',
          suggested: 'Nowadays, people heavily rely on technology',
          explanation: 'Subject-verb agreement: "people" is plural, remove "is".'
        }
      ],
      overallFeedback: `Good structure with well-organized paragraphs. To reach Band 8.0, integrate more complex subordinate clauses and academic collocations.`,
      betterAlternatives: [
        'Furthermore, empirical evidence suggests that...',
        'On the other hand, one cannot overlook the detrimental consequences of...'
      ]
    };
  }
}

export const aiProvider = new AIProviderService();
