// Initial Mock Data and Catalog for LinguaMate AI
import {
  LanguageInfo,
  MockExamDetails,
  PlacementQuestion,
  ShadowingLesson,
} from '@/types';

export const INITIAL_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flagEmoji: '🇬🇧',
    isAvailable: true,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flagEmoji: '🇩🇪',
    isAvailable: true,
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flagEmoji: '🇰🇷',
    isAvailable: false,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flagEmoji: '🇨🇳',
    isAvailable: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flagEmoji: '🇸🇦',
    isAvailable: false,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flagEmoji: '🇷🇺',
    isAvailable: false,
  },
];

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    type: 'multiple_choice',
    question: 'Choose the correct sentence to complete the conversation:',
    context: 'Person A: "Have you ever traveled to Germany?"\nPerson B: "Yes, I ______ to Berlin last summer."',
    options: ['have gone', 'went', 'was going', 'had been going'],
    correctAnswer: 'went',
    cefrTarget: 'A2',
  },
  {
    id: 2,
    type: 'audio_listen',
    question: 'Listen to the audio clip and identify the speaker’s main intention:',
    audioPrompt: 'I was wondering if it might be possible to reschedule our meeting to Thursday morning?',
    options: [
      'Cancelling the contract',
      'Politely proposing a new appointment time',
      'Complaining about a delay',
      'Confirming attendance for today',
    ],
    correctAnswer: 'Politely proposing a new appointment time',
    cefrTarget: 'B1',
  },
  {
    id: 3,
    type: 'multiple_choice',
    question: 'Select the most appropriate connector for an academic essay:',
    context: 'Renewable energy adoption has increased rapidly; ________, storage infrastructure remains a significant bottleneck.',
    options: ['consequently', 'nevertheless', 'in addition', 'similarly'],
    correctAnswer: 'nevertheless',
    cefrTarget: 'B2',
  },
  {
    id: 4,
    type: 'speak_prompt',
    question: 'Spoken Response: In 30 seconds, describe what you enjoy most about learning a new language and why.',
    context: 'Evaluate fluency, pronunciation, grammatical cohesion and lexical range.',
    cefrTarget: 'B1',
  },
];

export const MOCK_EXAMS: MockExamDetails[] = [
  {
    id: 'ielts-speaking-1',
    type: 'IELTS Speaking',
    language: 'English',
    title: 'IELTS Speaking Test 1: Hometown, Goals & Lifestyle',
    badge: 'IELTS Standard',
    difficulty: 'B2',
    estimatedTime: '11–14 mins',
    description:
      'Standard 3-part official speaking simulation evaluating Fluency, Lexical Resource, Grammatical Range, and Pronunciation.',
    sections: [
      {
        title: 'Part 1: Introduction & Interview (4–5 mins)',
        instructions:
          'The examiner will ask you general questions about yourself, your hometown, studies, work, and everyday interests.',
        durationMinutes: 5,
        questions: [
          {
            id: 'ielts-p1-q1',
            prompt: 'Let’s talk about your hometown. Where is your hometown located and what do you like most about it?',
            speakTimeSec: 45,
          },
          {
            id: 'ielts-p1-q2',
            prompt: 'Do you prefer studying or working in the morning or in the evening? Why?',
            speakTimeSec: 45,
          },
          {
            id: 'ielts-p1-q3',
            prompt: 'How often do you use public transportation in your daily life?',
            speakTimeSec: 45,
          },
        ],
      },
      {
        title: 'Part 2: Long Turn / Cue Card (3–4 mins)',
        instructions:
          'You will be given a topic card. You have exactly 1 minute to prepare notes, then speak for 1 to 2 minutes.',
        durationMinutes: 4,
        questions: [
          {
            id: 'ielts-p2-cue',
            prompt: 'Describe an important goal you set for yourself and how you achieved it.',
            cueCardBulletPoints: [
              'What the goal was',
              'Why it was significant to you',
              'What obstacles you had to overcome',
              'And explain how you felt when you achieved it.',
            ],
            prepTimeSec: 60,
            speakTimeSec: 120,
          },
        ],
      },
      {
        title: 'Part 3: Two-Way Discussion (4–5 mins)',
        instructions:
          'The examiner will ask broader, abstract questions linked to the topic in Part 2.',
        durationMinutes: 5,
        questions: [
          {
            id: 'ielts-p3-q1',
            prompt: 'Why do you think some people find it hard to stay motivated when working toward long-term goals?',
            speakTimeSec: 60,
          },
          {
            id: 'ielts-p3-q2',
            prompt: 'To what extent should schools teach goal-setting strategies and financial literacy to young learners?',
            speakTimeSec: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'ielts-speaking-2',
    type: 'IELTS Speaking',
    language: 'English',
    title: 'IELTS Speaking Test 2: Technology, Travel & Environment',
    badge: 'IELTS Advanced',
    difficulty: 'B2',
    estimatedTime: '11–14 mins',
    description:
      'Practice authentic IELTS interview focusing on technological advancements, sustainable transportation, and global journeys.',
    sections: [
      {
        title: 'Part 1: Introduction & Technology (4–5 mins)',
        instructions:
          'General questions regarding daily technology usage, modern communication, and nature.',
        durationMinutes: 5,
        questions: [
          {
            id: 'ielts-s2-p1-q1',
            prompt: 'What kind of mobile apps do you use most frequently on a daily basis?',
            speakTimeSec: 45,
          },
          {
            id: 'ielts-s2-p1-q2',
            prompt: 'Do you enjoy spending time outdoors in natural parks or countryside areas?',
            speakTimeSec: 45,
          },
          {
            id: 'ielts-s2-p1-q3',
            prompt: 'Has your preference for traveling changed over the past few years?',
            speakTimeSec: 45,
          },
        ],
      },
      {
        title: 'Part 2: Long Turn / Cue Card (3–4 mins)',
        instructions:
          '1 minute preparation followed by a 1 to 2 minute continuous response.',
        durationMinutes: 4,
        questions: [
          {
            id: 'ielts-s2-p2-cue',
            prompt: 'Describe a memorable journey you took that did not go as planned.',
            cueCardBulletPoints: [
              'Where you were going and who was with you',
              'What unexpected problem occurred during the journey',
              'How you and others handled the situation',
              'And explain what you learned from this travel experience.',
            ],
            prepTimeSec: 60,
            speakTimeSec: 120,
          },
        ],
      },
      {
        title: 'Part 3: Two-Way Discussion on Global Mobility (4–5 mins)',
        instructions:
          'Deep abstract discussion about international tourism and environmental sustainability.',
        durationMinutes: 5,
        questions: [
          {
            id: 'ielts-s2-p3-q1',
            prompt: 'How can governments balance expanding tourism infrastructure with environmental preservation?',
            speakTimeSec: 60,
          },
          {
            id: 'ielts-s2-p3-q2',
            prompt: 'In what ways might virtual reality or remote communication impact the future of business travel?',
            speakTimeSec: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'ielts-speaking-3',
    type: 'IELTS Speaking',
    language: 'English',
    title: 'IELTS Speaking Test 3: Arts, Creativity & Society',
    badge: 'IELTS Academic',
    difficulty: 'C1',
    estimatedTime: '12–15 mins',
    description:
      'Rigorous academic speaking test evaluating high-level vocabulary, nuanced arguments, and idiomatic fluency.',
    sections: [
      {
        title: 'Part 1: Arts, Music & Leisure (4–5 mins)',
        instructions:
          'Questions on creative hobbies, live performances, and modern entertainment.',
        durationMinutes: 5,
        questions: [
          {
            id: 'ielts-s3-p1-q1',
            prompt: 'Do you enjoy visiting art galleries, museums, or historical monuments?',
            speakTimeSec: 45,
          },
          {
            id: 'ielts-s3-p1-q2',
            prompt: 'What style of music do you find most conducive to concentrating on complex tasks?',
            speakTimeSec: 45,
          },
        ],
      },
      {
        title: 'Part 2: Long Turn / Cue Card (3–4 mins)',
        instructions:
          'Present an in-depth profile of an influential creative individual.',
        durationMinutes: 4,
        questions: [
          {
            id: 'ielts-s3-p2-cue',
            prompt: 'Describe a creative artist, writer, or musician whose work inspires you.',
            cueCardBulletPoints: [
              'Who this person is and what field they work in',
              'How you first discovered their artistic work',
              'What makes their style or contribution unique',
              'And explain why their creativity has had a lasting impact on you.',
            ],
            prepTimeSec: 60,
            speakTimeSec: 120,
          },
        ],
      },
      {
        title: 'Part 3: Discussion on AI & Cultural Heritage (4–5 mins)',
        instructions:
          'Critical evaluation of automated creative tools and preservation of cultural traditions.',
        durationMinutes: 5,
        questions: [
          {
            id: 'ielts-s3-p3-q1',
            prompt: 'Do you believe artificial intelligence can create genuine art that conveys emotional depth?',
            speakTimeSec: 60,
          },
          {
            id: 'ielts-s3-p3-q2',
            prompt: 'Why is it critical for communities to preserve traditional folklore and indigenous handicrafts?',
            speakTimeSec: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'toefl-speaking-prep',
    type: 'TOEFL Speaking',
    language: 'English',
    title: 'TOEFL iBT Academic Speaking Simulation',
    badge: 'TOEFL iBT',
    difficulty: 'B2',
    estimatedTime: '15 mins',
    description:
      'Academic campus conversations and lecture synthesis with standardized prep and response intervals.',
    sections: [
      {
        title: 'Part 1: Independent Opinion Task',
        instructions:
          'State and defend your perspective on university education policies.',
        durationMinutes: 4,
        questions: [
          {
            id: 'toefl-p1-q1',
            prompt: 'Some universities require all first-year students to live on campus dormitories, while others permit them to live off-campus with family. Which policy do you favor and why?',
            prepTimeSec: 30,
            speakTimeSec: 60,
          },
        ],
      },
      {
        title: 'Part 2: Academic Lecture Synthesis (Cue Card)',
        instructions:
          'Summarize the core psychological principle explained in the lecture prompt.',
        durationMinutes: 5,
        questions: [
          {
            id: 'toefl-p2-cue',
            prompt: 'Explain the concept of "Cognitive Dissonance" in decision-making and how consumers resolve post-purchase regret.',
            cueCardBulletPoints: [
              'Define the psychological phenomenon',
              'Provide the main retail example from consumer behavior',
              'Explain how peer validation reduces cognitive tension',
              'Summarize the long-term impact on brand loyalty',
            ],
            prepTimeSec: 60,
            speakTimeSec: 120,
          },
        ],
      },
    ],
  },
  {
    id: 'goethe-b1-speaking',
    type: 'Goethe B1 Speaking',
    language: 'German',
    title: 'Goethe-Zertifikat B1 Mündliche Prüfung',
    badge: 'Goethe B1',
    difficulty: 'B1',
    estimatedTime: '15 mins',
    description:
      'Offizielles Goethe B1 Format: Teil 1 Gemeinsam etwas planen, Teil 2 Ein Thema präsentieren, Teil 3 Feedback geben & Fragen beantworten.',
    sections: [
      {
        title: 'Teil 1: Gemeinsam etwas planen (3–4 Min.)',
        instructions:
          'Sie und Ihr Partner möchten eine Abschlussfeier für Ihren Deutschkurs organisieren. Besprechen Sie Ort, Essen, Musik und Budget.',
        durationMinutes: 4,
        questions: [
          {
            id: 'goethe-t1-q1',
            prompt: 'Planen Sie die Feier: Wann soll sie stattfinden und welche Aufgaben übernimmt jeder von Ihnen?',
            speakTimeSec: 90,
          },
        ],
      },
      {
        title: 'Teil 2: Ein Thema präsentieren (4–5 Min.)',
        instructions:
          'Präsentieren Sie das Thema: "Brauchen Kinder eigene Smartphones?". Strukturieren Sie Ihre Präsentation nach den 5 Goethe-Punkten.',
        durationMinutes: 5,
        questions: [
          {
            id: 'goethe-t2-q1',
            prompt: 'Thema: "Brauchen Kinder schon im Grundschulalter Smartphones?". Schildern Sie eigene Erfahrungen, Vor- und Nachteile sowie die Situation in Ihrem Heimatland.',
            cueCardBulletPoints: [
              'Eigene Erfahrungen beschreiben',
              'Vor- und Nachteile nennen',
              'Situation im Heimatland erläutern',
              'Persönliche Meinung und Fazit formulieren',
            ],
            prepTimeSec: 60,
            speakTimeSec: 150,
          },
        ],
      },
      {
        title: 'Teil 3: Fragen beantworten & Feedback (2 Min.)',
        instructions:
          'Beantworten Sie Fragen der Prüfer zu Ihrer Präsentation.',
        durationMinutes: 3,
        questions: [
          {
            id: 'goethe-t3-q1',
            prompt: 'Wie können Eltern den Medienkonsum ihrer Kinder am besten kontrollieren, ohne das Vertrauen zu verlieren?',
            speakTimeSec: 60,
          },
        ],
      },
    ],
  },
  {
    id: 'testdaf-speaking',
    type: 'TestDaF Speaking',
    language: 'German',
    title: 'TestDaF Mündlicher Ausdruck (TDN 3–5)',
    badge: 'TestDaF Academic',
    difficulty: 'B2',
    estimatedTime: '20 mins',
    description:
      'Hochschulzugangsprüfung: Universitäre Aufgaben mit Grafikanalyse, Meinungsäußerung und Alternativenabwägung.',
    sections: [
      {
        title: 'Aufgabe 3: Eine Grafik beschreiben & Trends erläutern',
        instructions:
          'Sie nehmen an einem Seminar über Studienfinanzierung teil. Beschreiben Sie die Entwicklung der Lebenshaltungskosten für Studierende.',
        durationMinutes: 6,
        questions: [
          {
            id: 'testdaf-a3',
            prompt: 'Beschreiben Sie die Grafik "Ausgaben von Studierenden in Deutschland 2015-2025" und fassen Sie die wesentlichen Trends zusammen.',
            cueCardBulletPoints: [
              'Thema und Quelle der Grafik benennen',
              'Wichtigste Zahlen und Steigerungsraten vergleichen',
              'Mögliche Ursachen für die Kostensteigerung nennen',
              'Ausblick auf zukünftige Entwicklungen geben',
            ],
            prepTimeSec: 60,
            speakTimeSec: 120,
          },
        ],
      },
    ],
  },
];

export const SHADOWING_LESSONS: ShadowingLesson[] = [
  {
    id: 'shadow-en-b1-travel',
    language: 'English',
    level: 'B1',
    category: 'Travel & Culture',
    title: 'Checking into a Boutique Hotel in London',
    description: 'Master natural British conversational cadence, polite requests, and standard hospitality exchanges.',
    speaker: 'Charlotte (London, UK)',
    duration: '0:45',
    sentences: [
      {
        id: 1,
        text: 'Good afternoon, I have a reservation under the name of Davis for three nights.',
        translation: 'Xayrli kun, men Davis nomiga 3 kechaga bron qilgan edim.',
        startTime: 0,
        endTime: 4.5,
      },
      {
        id: 2,
        text: 'Certainly, sir. Could you please provide your passport and a credit card for incidental charges?',
        translation: 'Albatta, ser. Pasportingizni va qo‘shimcha xarajatlar uchun kartangizni taqdim qila olasizmi?',
        startTime: 4.6,
        endTime: 10.2,
      },
      {
        id: 3,
        text: 'Here you go. Also, would it be possible to get a quiet room facing the courtyard?',
        translation: 'Mana, marhamat. Shuningdek, hovliga qaragan tinch xona olish imkoni bormi?',
        startTime: 10.3,
        endTime: 16.0,
      },
      {
        id: 4,
        text: 'Let me check our system right away — yes, we have a lovely deluxe suite available on the fourth floor.',
        translation: 'Tizimimizni tekshirib ko‘raman — ha, to‘rtinchi qavatda ajoyib lyuks xonamiz bo‘sh.',
        startTime: 16.1,
        endTime: 23.5,
      },
    ],
  },
  {
    id: 'shadow-en-b2-interview',
    language: 'English',
    level: 'B2',
    category: 'Job Interview & Career',
    title: 'Answering: "Tell Me About a Difficult Challenge You Overcame"',
    description: 'Learn the STAR technique phrasing with confident intonation and professional vocabulary.',
    speaker: 'James (San Francisco, USA)',
    duration: '0:50',
    sentences: [
      {
        id: 1,
        text: 'In my previous project, we faced a critical deadline when our core data pipeline encountered severe latency issues.',
        translation: 'Oldingi loyihamizda asosiy ma’lumotlar tizimi sekinlashganda biz qat’iy muddatga duch keldik.',
        startTime: 0,
        endTime: 6.8,
      },
      {
        id: 2,
        text: 'I immediately organized a triage meeting to identify the root bottlenecks and redistributed key tasks among the engineers.',
        translation: 'Men darhol asosiy muammolarni aniqlash uchun yig‘ilish o‘tkazdim va vazifalarni qayta taqsimladim.',
        startTime: 6.9,
        endTime: 14.2,
      },
      {
        id: 3,
        text: 'By refactoring the caching layer and streamlining queries, we not only resolved the issue but also improved throughput by forty percent.',
        translation: 'Kesh tizimini qayta optimallashtirib, biz nafaqat muammoni hal qildik, balki unumdorlikni 40% oshirdik.',
        startTime: 14.3,
        endTime: 23.0,
      },
    ],
  },
  {
    id: 'shadow-de-b1-daily',
    language: 'German',
    level: 'B1',
    category: 'Alltag & Studium',
    title: 'Ein WG-Zimmer in Berlin besichtigen',
    description: 'Übe authentische deutsche Satzmelodie, Dativ/Akkusativ-Bindungen und lockere Umgangssprache.',
    speaker: 'Stefan (Berlin, Deutschland)',
    duration: '0:42',
    sentences: [
      {
        id: 1,
        text: 'Hallo Jonas, danke für die Einladung! Die Wohnung liegt ja wirklich super zentral.',
        translation: 'Salom Jonas, taklif uchun rahmat! Kvartira haqiqatan ham markazda joylashgan ekan.',
        startTime: 0,
        endTime: 4.8,
      },
      {
        id: 2,
        text: 'Freut mich, dass du es gefunden hast! Komm erst mal rein und schau dir in Ruhe die Küche und dein potenzielles Zimmer an.',
        translation: 'Topib kelganingdan xursandman! Kirib oshxona va bo‘lajak xonangni bemalol ko‘rib chiq.',
        startTime: 4.9,
        endTime: 12.0,
      },
      {
        id: 3,
        text: 'Wie regelt ihr das eigentlich mit dem Putzplan und den Nebenkosten?',
        translation: 'Sizlarda tozalash jadvali va kommunal to‘lovlar qanday tartibga solingan?',
        startTime: 12.1,
        endTime: 17.5,
      },
    ],
  },
];

