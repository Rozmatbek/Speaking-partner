'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CefrLevel, FlashcardWord } from '@/types';
import { speechService } from '@/lib/speech';
import {
  BookOpen,
  Check,
  Filter,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';

export const VocabularyView: React.FC = () => {
  const { flashcards, addFlashcard, reviewFlashcard, selectedLanguage, addXP } = useApp();

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Word Form State
  const [newWord, setNewWord] = useState<string>('');
  const [newTranslation, setNewTranslation] = useState<string>('');
  const [newLevel, setNewLevel] = useState<CefrLevel>('B1');
  const [newExample, setNewExample] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Academic & Speaking');

  const filteredCards = flashcards.filter((c) => {
    const matchesSearch =
      c.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.translation.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory !== 'All') {
      return matchesSearch && c.category === selectedCategory;
    }
    return matchesSearch;
  });

  const activeCard = filteredCards[activeCardIndex] || filteredCards[0];
  const isGerman = selectedLanguage.code === 'de';

  const speakWord = (word: string) => {
    speechService.speak(word, {
      lang: isGerman ? 'de-DE' : 'en-US',
    });
  };

  const handleReview = (cardId: string, performance: 'Easy' | 'Medium' | 'Hard') => {
    reviewFlashcard(cardId, performance);
    setIsFlipped(false);
    if (activeCardIndex < filteredCards.length - 1) {
      setActiveCardIndex(activeCardIndex + 1);
    } else {
      setActiveCardIndex(0);
    }
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newTranslation) return;

    addFlashcard({
      word: newWord.trim(),
      language: selectedLanguage.name,
      translation: newTranslation.trim(),
      phonetic: '',
      level: newLevel,
      exampleSentence: newExample.trim() || `Mastering ${newWord} in context.`,
      partOfSpeech: 'lexicon',
      category: newCategory,
      source: 'System Core',
      difficulty: 'Medium',
    });

    setNewWord('');
    setNewTranslation('');
    setNewExample('');
    setIsAddModalOpen(false);
  };

  const categories = ['All', 'Academic & Speaking', 'IELTS Lexicon', 'Business & Formal', 'Core Vocabulary', 'Speaking Session'];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Spaced Repetition System
            </span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              {flashcards.length} Words Saved
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Vocabulary & Flashcards
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Reinforce high-value expressions with audio pronunciation and memory curves.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Word</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, translations, or level..."
            className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveCardIndex(0);
                setIsFlipped(false);
              }}
              className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Flashcard Hero Deck */}
      {activeCard ? (
        <div className="mx-auto max-w-xl space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="group relative min-h-[320px] cursor-pointer rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
          >
            {/* Top info */}
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                {activeCard.level} · {activeCard.partOfSpeech}
              </span>
              <span className="text-zinc-400">
                Card {activeCardIndex + 1} of {filteredCards.length}
              </span>
            </div>

            {/* Center Front or Back */}
            <div className="text-center my-auto space-y-3">
              {!isFlipped ? (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
                    {activeCard.word}
                  </h2>
                  {activeCard.phonetic && (
                    <span className="mt-1 font-mono text-xs text-zinc-400">
                      {activeCard.phonetic}
                    </span>
                  )}
                  <p className="mt-4 text-xs text-zinc-400 flex items-center justify-center gap-1.5">
                    <RotateCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Click anywhere to flip & reveal meaning</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {activeCard.translation}
                  </h3>
                  <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300 italic">
                    "{activeCard.exampleSentence}"
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    Source: {activeCard.source} ({activeCard.category})
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Audio Trigger */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(activeCard.word);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 transition-colors"
              >
                <Volume2 className="h-4 w-4" />
                <span>Audio Pronunciation</span>
              </button>

              <span className="text-[11px] text-zinc-400">
                Repetitions: {activeCard.repetitionCount}
              </span>
            </div>
          </div>

          {/* Spaced Repetition Evaluation Rating: Easy / Medium / Hard */}
          <div className="space-y-2">
            <span className="block text-center text-xs font-semibold text-zinc-500">
              How well did you know this word?
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleReview(activeCard.id, 'Hard')}
                className="rounded-2xl border border-rose-200 bg-rose-50/80 py-3 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 transition-all active:scale-95"
              >
                Hard 🔴
              </button>

              <button
                onClick={() => handleReview(activeCard.id, 'Medium')}
                className="rounded-2xl border border-amber-200 bg-amber-50/80 py-3 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300 transition-all active:scale-95"
              >
                Good 🟡
              </button>

              <button
                onClick={() => handleReview(activeCard.id, 'Easy')}
                className="rounded-2xl border border-emerald-200 bg-emerald-50/80 py-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 transition-all active:scale-95"
              >
                Easy 🟢
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-12 text-xs text-zinc-400">
          No flashcards found matching your filter criteria.
        </div>
      )}

      {/* Add Custom Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Add Word to Flashcard Deck
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWord} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Word / Phrase:
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Inevitable or Bemerkenswert"
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Translation / Meaning:
                </label>
                <input
                  type="text"
                  required
                  value={newTranslation}
                  onChange={(e) => setNewTranslation(e.target.value)}
                  placeholder="e.g. Muqarrar, qochib bo'lmas"
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Example Context Sentence:
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="e.g. Change is an inevitable part of career development."
                  className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  Save to Flashcards ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
