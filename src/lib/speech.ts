// Web Speech API Wrapper: Text-to-Speech (TTS) and Speech-to-Text (STT)

export interface VoiceOption {
  name: string;
  lang: string;
  gender: 'Female' | 'Male';
  voiceURI: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  // Get available voices from browser
  public getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve([]);
        return;
      }

      let voices = this.synth.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      this.synth.onvoiceschanged = () => {
        voices = this.synth?.getVoices() || [];
        resolve(voices);
      };

      // Fallback timeout in case onvoiceschanged does not fire
      setTimeout(() => {
        resolve(this.synth?.getVoices() || []);
      }, 500);
    });
  }

  // Speak text with specified parameters
  public speak(
    text: string,
    options: {
      lang?: string;
      gender?: 'Female' | 'Male';
      style?: 'Friendly' | 'Professional' | 'Calm' | 'Energetic';
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !this.synth) {
      options.onEnd?.();
      return;
    }

    // Cancel any currently playing speech to avoid overlapping
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = options.lang || 'en-US';
    utterance.lang = langCode;

    // Adjust rate and pitch based on style and gender
    let pitch = options.pitch ?? (options.gender === 'Female' ? 1.15 : 0.9);
    let rate = options.rate ?? 1.0;

    if (options.style === 'Energetic') {
      rate = 1.1;
      pitch += 0.1;
    } else if (options.style === 'Calm') {
      rate = 0.85;
      pitch -= 0.05;
    } else if (options.style === 'Professional') {
      rate = 0.95;
    }

    utterance.pitch = Math.min(Math.max(pitch, 0.5), 1.8);
    utterance.rate = Math.min(Math.max(rate, 0.5), 1.6);

    const allVoices = this.synth.getVoices();
    if (allVoices.length > 0) {
      // Find suitable voice matching language and gender
      const matchingVoice = allVoices.find((v) => {
        const matchesLang = v.lang.startsWith(langCode.substring(0, 2));
        if (!matchesLang) return false;

        const nameLower = v.name.toLowerCase();
        if (options.gender === 'Female') {
          return (
            nameLower.includes('female') ||
            nameLower.includes('samantha') ||
            nameLower.includes('victoria') ||
            nameLower.includes('zira') ||
            nameLower.includes('google us english') ||
            nameLower.includes('karen') ||
            nameLower.includes('anna') ||
            nameLower.includes('helena')
          );
        } else {
          return (
            nameLower.includes('male') ||
            nameLower.includes('david') ||
            nameLower.includes('mark') ||
            nameLower.includes('george') ||
            nameLower.includes('stefan') ||
            nameLower.includes('alex')
          );
        }
      });

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      } else {
        const langVoice = allVoices.find((v) =>
          v.lang.startsWith(langCode.substring(0, 2))
        );
        if (langVoice) utterance.voice = langVoice;
      }
    }

    utterance.onstart = () => options.onStart?.();
    utterance.onend = () => options.onEnd?.();
    utterance.onerror = (e) => {
      console.warn('Speech synthesis note:', e);
      options.onError?.(e);
      options.onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed', e);
      options.onEnd?.();
    }
  }

  // Stop any active speech synthesis
  public stopSpeech(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  // Speech to Text (Recognition)
  public startListening(options: {
    lang?: string;
    onResult: (transcript: string, isFinal: boolean) => void;
    onError?: (err: any) => void;
    onEnd?: () => void;
  }): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      options.onError?.({
        message: 'Web Speech Recognition not supported in this browser.',
      });
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = options.lang || 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          options.onResult(finalTranscript.trim(), true);
        } else if (interimTranscript) {
          options.onResult(interimTranscript.trim(), false);
        }
      };

      this.recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        options.onError?.(err);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        options.onEnd?.();
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.warn('Could not start speech recognition:', err);
      options.onError?.(err);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        this.recognition.abort();
      }
      this.isListening = false;
    }
  }

  public isSpeechSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('speechSynthesis' in window ||
        'webkitSpeechRecognition' in window ||
        'SpeechRecognition' in window)
    );
  }
}

export const speechService = new SpeechService();
