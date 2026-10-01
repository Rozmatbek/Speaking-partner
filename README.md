# 🌐 LinguaMate AI — Multilingual Speaking & Human Exchange Platform

**LinguaMate AI** is a production-grade full-stack web application designed for students and young language learners to build authentic fluency through:
1. **Real Human Speaking Partners** (Encrypted voice-only peer exchange with minor safety controls)
2. **Certificate Mock Exams** (Timed IELTS Speaking Parts 1–3, IELTS Writing, Goethe B1/B2, and TestDaF with AI CEFR evaluations)
3. **Shadowing Practice Lab** (Sentence-by-sentence acoustic echo with 4-metric cadence breakdown)
4. **AI Speaking Companion** (Spontaneous conversational partner adapting vocabulary and grammar to A1–C2 levels)
5. **Spaced Repetition Flashcards & 4-Week Mastery Roadmap**

---

## 🌟 Key Product Features

### 1. 10-Step Onboarding Wizard
* **Step 1 — Name:** Personalizes speaking dialogues and learning journey.
* **Step 2 — Age & Safety Isolation:** Age categories (`Under 16`, `16–17`, `18+`). Exact age is kept strictly private.
* **Step 3 — Target Language:** Fully functional English 🇬🇧 and German 🇩🇪; prepared architecture for Korean 🇰🇷, Chinese 🇨🇳, Arabic 🇸🇦, and Russian 🇷🇺.
* **Step 4 — CEFR Level Selection:** Beginner to C2 or fast-track AI Diagnostic Placement Test.
* **Step 5 — Multi-select Goals:** Speaking, Certificate Exam, University, Work, Travel, School, General Communication.
* **Step 6 & 7 — Target & Commitment:** Custom target level and daily study commitment (10m to 90m).
* **Step 8 — AI Voice Persona:** Female/Male selection with Friendly, Professional, Calm, and Energetic tone settings + live Web Speech audio preview.
* **Step 9 — AI Placement Test:** Interactive diagnostic test assessing vocabulary, grammar, fluency, and pronunciation.
* **Step 10 — Celebration:** Summary and launch to personalized dashboard.

### 2. Dedicated AI Voice Speaking Interface
* Real-time microphone transcription via Web Speech Recognition with intelligent fallback.
* Speech synthesis modulation matching selected gender and persona style.
* 10 conversation modes (Casual, Travel, Job Interview, IELTS, Goethe, University, etc.).
* Post-session **AI Estimated Feedback** (Fluency, Grammar, Vocabulary, Pronunciation, Coherence + Detected Mistakes & Corrections).

### 3. Real Human Speaking Partners
* Algorithmic language exchange matching (e.g. Uzbek native learning German ↔ German native learning Uzbek/English).
* Safety controls for minors (age category isolation, voice-only default, direct contact sharing prohibition).
* Real-time peer voice room with mute, deafen, icebreaker prompt generator, and immediate report/block system.

### 4. Certificate Exam Mock Tests
* **IELTS Speaking:** Full 3-part simulation with cue card prep timers (1 min prep, 2 min speech).
* **IELTS Writing Task 2:** Timed essay editor with live word count and CEFR band estimation.
* **Goethe-Zertifikat B1/B2:** Teil 1 (Planen), Teil 2 (Präsentation), Teil 3 (Fragen).
* **TestDaF:** Mündlicher Ausdruck university seminar graph analysis.

### 5. Shadowing Practice Lab
* Native audio playback with regular (1.0x) and slow (0.75x) speeds.
* Microphone recording with instant acoustic cadence scoring:
  * **Pronunciation %**
  * **Rhythm %**
  * **Intonation %**
  * **Speed %**
* Word-by-word visual highlight (Green / Amber / Red).

### 6. Spaced Repetition Vocabulary & Flashcards
* Save high-yield expressions directly from AI speaking sessions.
* Leitner-based Easy / Medium / Hard review grading.
* Built-in native pronunciation speech synthesis.

### 7. 4-Week Learning Roadmap & Analytics
* Step-by-step weekly milestone tracker (Speaking Foundations → Lexicon Expansion → Shadowing Mastery → Exam Simulation).
* Study time tracking, CEFR competence radar, daily streaks 🔥, and gamification achievements.

### 8. Admin & Safety Moderation Center
* Live SLA monitoring of safety reports and tickets.
* Learner directory, age category verification, and ban triggers.
* Language and content catalog manager.

---

## 🛠️ Technology Stack
* **Frontend:** Next.js 16 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS v4, Modern Dark/Light glassmorphism design system
* **Icons & Animation:** Lucide React, Canvas Confetti
* **Audio & Voice:** Web Speech API (`SpeechSynthesis` & `SpeechRecognition`) + WebRTC P2P abstraction
* **Database Schema:** PostgreSQL via Prisma (`prisma/schema.prisma`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file (optional for external API keys; demo mode works out-of-the-box):
```env
# Optional external AI key (Demo mode enabled if omitted)
NEXT_PUBLIC_AI_API_KEY=""

# PostgreSQL Database (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/linguamate_db?schema=public"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Child Safety & Compliance
* All human-to-human exchanges are default **Voice-Only**.
* Minor age categories (`Under 16`, `16–17`, `18+`) are strictly isolated from cross-group matching.
* Exact ages and private contact details are never exposed.
* Inappropriate behavior triggers immediate account suspension.
* All AI evaluations are explicitly marked as **"AI Estimated Score / Practice Assessment"** and not official certifications.
