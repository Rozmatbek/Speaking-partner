export type SupportedLang = 'en' | 'de';

export const TRANSLATIONS = {
  en: {
    brand: 'Talkey',
    modulesTitle: 'Speaking Modules',
    navPartner: 'AI Partner',
    navShadowing: 'Shadowing',
    navMockTests: 'Mock Tests',
    profile: 'Profile',

    // Speaking
    speakingHeading: 'Speaking Partner',
    speakingSubheading:
      'Choose a partner for your selected language and practice unlimited speaking on any topic.',
    speakWith: (name: string) => `Speak with ${name}`,
    speakingYou: 'You:',
    unmuteMic: 'Unmute microphone',
    muteMic: 'Mute microphone',
    endCall: 'End conversation',

    // Shadowing
    shadowingHeading: 'Shadowing',
    shadowingSubheading:
      'Listen to native speaker recordings and repeat sentence-by-sentence to calibrate your cadence, rhythm, and natural pronunciation.',
    listenOriginal: 'Listen Original (1.0x)',
    playingAudio: 'Playing Audio...',
    prevSentence: 'Previous Sentence',
    nextSentence: 'Next Sentence',
    finishLesson: 'Finish Lesson',
    lessonCompleted: 'You completed this shadowing lesson!',

    // Mock Exams
    mockExamsHeading: 'Speaking Mock Exams',
    mockExamsSubheading:
      'Timed official exam simulations with realistic part timers and audio prompts.',
    startMockTest: 'Start Exam',
    duration: 'Duration',
    difficulty: 'Difficulty',
    preparationTime: 'Preparation Time',
    speakingTime: 'Speaking Time',
    myNotes: 'Your Preparation Notes',
    notesPlaceholder: 'Type bullet points or thoughts here...',
    nextSection: 'Next Section',
    completeExam: 'Finish Exam',
    playPromptAudio: 'Listen to Question',
    examResult: 'Exam Assessment Result',
    overallBand: 'Overall Band Score',
    keyStrengths: 'Key Strengths',
    areasForImprovement: 'Areas for Improvement',
    examinerFeedback: 'Examiner Detailed Feedback',
    retakeExam: 'Retake Exam',
    backToCatalog: 'Back to Mock Tests',

    // Profile Modal
    fullName: 'Full Name:',
    learningLang: 'Learning Language:',
    currentLevel: 'Current Level:',
    targetLevel: 'Target Level:',
    geminiKeyTitle: 'Google Gemini API Key:',
    getFreeKey: 'Get Free Key ↗',
    geminiKeyHint: 'You can enter your free API key from Google AI Studio.',
  },
  de: {
    brand: 'Talkey',
    modulesTitle: 'Sprechmodul',
    navPartner: 'KI-Partner',
    navShadowing: 'Shadowing',
    navMockTests: 'Modelltests',
    profile: 'Profil',

    // Speaking
    speakingHeading: 'Sprechpartner',
    speakingSubheading:
      'Wähle einen Partner für deine Zielsprache und übe unbegrenzt zu jedem Thema.',
    speakWith: (name: string) => `Mit ${name} sprechen`,
    speakingYou: 'Du:',
    unmuteMic: 'Mikrofon aktivieren',
    muteMic: 'Mikrofon stummschalten',
    endCall: 'Gespräch beenden',

    // Shadowing
    shadowingHeading: 'Shadowing',
    shadowingSubheading:
      'Höre dir Aufnahmen von Muttersprachlern an und wiederhole Satz für Satz, um Rhythmus, Intonation und Aussprache zu verbessern.',
    listenOriginal: 'Original anhören (1.0x)',
    playingAudio: 'Audio wird abgespielt...',
    prevSentence: 'Vorheriger Satz',
    nextSentence: 'Nächster Satz',
    finishLesson: 'Lektion abschließen',
    lessonCompleted: 'Du hast diese Shadowing-Lektion abgeschlossen!',

    // Mock Exams
    mockExamsHeading: 'Mündliche Modellprüfungen',
    mockExamsSubheading:
      'Offizielle Prüfungssimulationen mit realistischen Timern und Audiofragen.',
    startMockTest: 'Prüfung starten',
    duration: 'Dauer',
    difficulty: 'Niveau',
    preparationTime: 'Vorbereitungszeit',
    speakingTime: 'Sprechzeit',
    myNotes: 'Deine Vorbereitungsnotizen',
    notesPlaceholder: 'Schreibe hier Stichpunkte oder Gedanken auf...',
    nextSection: 'Nächster Teil',
    completeExam: 'Prüfung abschließen',
    playPromptAudio: 'Frage anhören',
    examResult: 'Prüfungsergebnis',
    overallBand: 'Gesamtbewertung',
    keyStrengths: 'Wichtigste Stärken',
    areasForImprovement: 'Verbesserungsbereiche',
    examinerFeedback: 'Ausführliches Prüfer-Feedback',
    retakeExam: 'Prüfung wiederholen',
    backToCatalog: 'Zurück zu den Tests',

    // Profile Modal
    fullName: 'Vollständiger Name:',
    learningLang: 'Lernsprache:',
    currentLevel: 'Aktuelles Niveau:',
    targetLevel: 'Zielniveau:',
    geminiKeyTitle: 'Google Gemini API-Schlüssel:',
    getFreeKey: 'Kostenlosen Schlüssel holen ↗',
    geminiKeyHint: 'Du kannst deinen kostenlosen API-Schlüssel aus Google AI Studio eingeben.',
  },
};

export const getTranslation = (langCodeOrName?: string) => {
  const isGerman =
    langCodeOrName?.toLowerCase().includes('german') ||
    langCodeOrName?.toLowerCase() === 'de';
  return isGerman ? TRANSLATIONS.de : TRANSLATIONS.en;
};
