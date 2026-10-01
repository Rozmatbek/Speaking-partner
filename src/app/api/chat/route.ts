import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { history, userMessage, partner, userProfile, apiKey: clientApiKey } =
      await req.json();

    const apiKey =
      clientApiKey ||
      userProfile?.geminiApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      '';

    const isGerman =
      userProfile?.learningLanguage?.toLowerCase().includes('german') || false;
    const targetLanguage = isGerman ? 'German (Deutsch)' : 'English';
    const partnerName = partner?.name || 'Partner';
    const userName = userProfile?.name || 'Friend';
    const userLevel = userProfile?.currentLevel || 'B1';
    const personality =
      partner?.personality || 'Friendly, empathetic, and articulate conversationalist';

    const systemPrompt = `You are ${partnerName}, a native speaking tutor in a 1-on-1 real-time voice call with ${userName} practicing ${targetLanguage}.
User Level: CEFR ${userLevel}.
Partner Persona: ${personality}.

STRICT CONVERSATIONAL RULES:
1. Speak ONLY in ${targetLanguage}.
2. Keep your answer conversational, spoken, concise, and natural (1 to 2 sentences max, exactly like on a live phone call).
3. Directly react and respond to whatever ${userName} just said. Never give generic boilerplate.
4. End with one engaging follow-up question or thought-provoking prompt to keep the conversation going smoothly.
5. Adapt language vocabulary to CEFR ${userLevel}.
6. NEVER output markdown symbols (*, _, #, \`), emojis, or lists, as this output is spoken directly via text-to-speech.`;

    // Try Google Gemini API with fallback models
    if (apiKey && apiKey.trim().length > 5) {
      const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
      ];

      for (const model of models) {
        try {
          const contents: any[] = [];

          if (Array.isArray(history) && history.length > 0) {
            for (const item of history.slice(-6)) {
              contents.push({
                role: item.role === 'user' ? 'user' : 'model',
                parts: [{ text: item.text || item.content || '' }],
              });
            }
          }

          contents.push({
            role: 'user',
            parts: [{ text: userMessage || 'Hello!' }],
          });

          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents,
                generationConfig: {
                  temperature: 0.85,
                  maxOutputTokens: 100,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const candidateText =
              data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText && candidateText.trim().length > 0) {
              const cleanText = candidateText
                .replace(/[*_#~`]/g, '')
                .replace(/\n+/g, ' ')
                .trim();
              return NextResponse.json({ reply: cleanText });
            }
          }
        } catch (err) {
          console.warn(`Model ${model} attempt failed:`, err);
        }
      }
    }

    // Dynamic, context-aware NLP response generator
    const cleanUserText = (userMessage || '').trim();
    const reply = generateDynamicConversationalReply(
      cleanUserText,
      isGerman,
      userName,
      partnerName,
      history?.length || 0
    );

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat route error:', error);
    return NextResponse.json(
      { reply: 'That sounds really interesting! Tell me what you think about that.' },
      { status: 200 }
    );
  }
}

function generateDynamicConversationalReply(
  text: string,
  isGerman: boolean,
  userName: string,
  partnerName: string,
  turnCount: number
): string {
  const lower = text.toLowerCase();

  if (isGerman) {
    if (lower.includes('hallo') || lower.includes('hi') || lower.includes('guten')) {
      return `Hallo ${userName}! Es ist super, wieder mit dir zu sprechen. Worüber möchtest du heute plaudern?`;
    }
    if (lower.includes('wie geht') || lower.includes('geht es')) {
      return `Mir geht es ausgezeichnet, danke dir! Wie war dein bisheriger Tag?`;
    }
    if (lower.includes('film') || lower.includes('kino') || lower.includes('serie')) {
      return `Filme und Serien sind fantastisch, um die Sprache zu üben! Welchen Film hast du zuletzt gesehen?`;
    }
    if (lower.includes('sport') || lower.includes('fussball') || lower.includes('gym') || lower.includes('training')) {
      return `Sport hält den Kopf frei! Machst du selbst regelmäßig Sport oder schaust du lieber zu?`;
    }
    if (lower.includes('essen') || lower.includes('kochen') || lower.includes('restaurant')) {
      return `Leckeres Essen ist immer ein tolles Thema! Was ist dein absolutes Lieblingsgericht?`;
    }
    if (lower.includes('arbeit') || lower.includes('job') || lower.includes('beruf') || lower.includes('studium') || lower.includes('uni')) {
      return `Das klingt nach einer spannenden Aufgabe! Was gefällt dir daran am besten?`;
    }
    if (lower.includes('wetter') || lower.includes('sonne') || lower.includes('regen')) {
      return `Das Wetter beeinflusst die Stimmung ja wirklich sehr! Was unternimmst du bei solchem Wetter am liebsten?`;
    }

    // Reflect subject if question or statement
    if (lower.includes('warum') || lower.includes('wieso')) {
      return `Das ist eine tiefgründige Frage! Was ist denn deine eigene Vermutung dazu?`;
    }

    const dynamicGerman = [
      `Das ist wirklich ein interessanter Gedanke, ${userName}! Was hat dich dazu inspiriert?`,
      `Ich verstehe genau, was du meinst. Welche Erfahrung hat dich dabei am meisten geprägt?`,
      `Das klingt faszinierend! Wie siehst du die weitere Entwicklung in diesem Bereich?`,
      `Ein sehr guter Punkt! Wenn du eine Sache daran ändern könntest, was wäre das?`,
      `Interessante Ansicht! Gibt es dazu auch Gegenargumente, die man beachten sollte?`,
    ];
    return dynamicGerman[turnCount % dynamicGerman.length];
  } else {
    // English Dynamic Responses
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return `Hey ${userName}! Wonderful to hear your voice. What would you like to chat about today?`;
    }
    if (lower.includes('how are you') || lower.includes('how do you do') || lower.includes('how are things')) {
      return `I'm doing really well, thank you so much for asking! How is your day going so far?`;
    }
    if (lower.includes('football') || lower.includes('soccer') || lower.includes('sport') || lower.includes('gym') || lower.includes('basketball')) {
      return `Sports and staying active are awesome! Do you support a specific team, or do you enjoy playing yourself?`;
    }
    if (lower.includes('movie') || lower.includes('film') || lower.includes('cinema') || lower.includes('netflix') || lower.includes('series')) {
      return `Watching movies is such a great way to explore storytelling! What was the last movie or show that really impressed you?`;
    }
    if (lower.includes('music') || lower.includes('song') || lower.includes('singer') || lower.includes('band')) {
      return `Music connects people so deeply! What kind of genres or artists do you listen to most often?`;
    }
    if (lower.includes('book') || lower.includes('read') || lower.includes('author')) {
      return `Reading is a wonderful habit! What genre of books do you usually find most engaging?`;
    }
    if (lower.includes('ai') || lower.includes('tech') || lower.includes('computer') || lower.includes('program') || lower.includes('software')) {
      return `Technology is evolving at such an incredible pace! How do you think AI will change our daily routines in the coming years?`;
    }
    if (lower.includes('travel') || lower.includes('country') || lower.includes('trip') || lower.includes('vacation') || lower.includes('city')) {
      return `Traveling opens up so many new perspectives! What is a destination you dream of visiting next?`;
    }
    if (lower.includes('food') || lower.includes('cook') || lower.includes('eat') || lower.includes('dish') || lower.includes('dinner')) {
      return `Food is one of the best parts of any culture! What is your favorite traditional dish to enjoy?`;
    }
    if (lower.includes('work') || lower.includes('job') || lower.includes('career') || lower.includes('study') || lower.includes('university') || lower.includes('school')) {
      return `Balancing work and personal goals can be quite an adventure! What is the most rewarding part of what you do?`;
    }
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('sun') || lower.includes('hot') || lower.includes('cold')) {
      return `The weather definitely sets the mood for the day! Do you prefer sunny outdoor weather or cozy rainy days?`;
    }
    if (lower.includes('why') || lower.includes('how come')) {
      return `That is a really thoughtful question! From your own perspective, what do you think is the main reason behind it?`;
    }
    if (lower.includes('yes') || lower.includes('agree') || lower.includes('true') || lower.includes('right')) {
      return `I'm glad we see eye to eye on this! What other factors do you think play a role here?`;
    }
    if (lower.includes('no') || lower.includes('disagree') || lower.includes('not really')) {
      return `That is a very valid counter-perspective! What led you to feel differently about it?`;
    }

    // Smart diverse contextual questions
    const dynamicEnglish = [
      `That is such an interesting point, ${userName}! Could you share a quick personal example of that?`,
      `I completely see where you're coming from! What do you think is the most important lesson from that?`,
      `You explained that very clearly! If you had the power to change one aspect of it, what would you do?`,
      `That makes a lot of sense! How do you think most people usually handle that kind of situation?`,
      `Fascinating thoughts! How has your view on this evolved over the past few years?`,
      `That sounds very intriguing! What is the biggest advantage you see in that approach?`,
    ];
    return dynamicEnglish[turnCount % dynamicEnglish.length];
  }
}
