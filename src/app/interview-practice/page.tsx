'use client';

import React, { useState } from 'react';
import { practiceQuestions, PracticeQuestion } from '../../data/practiceQuestions';
import { useProgress } from '../../context/ProgressContext';
import { useUI } from '../../context/UIContext';
import { Star, Eye, EyeOff, CheckCircle, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function InterviewPracticePage() {
  const { progress, markQuestionAnswered, toggleBookmark, resetPracticeProgress } = useProgress();
  const { addToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const categories = ['All', 'General', 'Behavioral', 'Situational', 'Strengths & Weaknesses', 'Remote Work', 'Bookmarked'];

  const filteredQuestions = practiceQuestions.filter((q) => {
    if (selectedCategory === 'Bookmarked') {
      return progress.bookmarkedQuestions.includes(q.id);
    }
    if (selectedCategory === 'All') return true;
    return q.category === selectedCategory;
  });

  const toggleReveal = (id: string) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMarkAnswered = (id: string) => {
    markQuestionAnswered(id);
    addToast('Question marked as practiced!', 'success');
  };

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
    const isBookmarked = progress.bookmarkedQuestions.includes(id);
    addToast(isBookmarked ? 'Bookmark removed' : 'Question bookmarked!', 'info');
  };

  const handleReset = () => {
    const idsToReset = selectedCategory === 'All' || selectedCategory === 'Bookmarked'
      ? undefined
      : practiceQuestions.filter((q) => q.category === selectedCategory).map((q) => q.id);
    
    resetPracticeProgress(idsToReset);
    addToast('Practice progress reset successfully!', 'info');
  };

  // Progress Calculation
  const totalCount = selectedCategory === 'Bookmarked'
    ? progress.bookmarkedQuestions.length
    : selectedCategory === 'All'
      ? practiceQuestions.length
      : practiceQuestions.filter((q) => q.category === selectedCategory).length;

  const answeredInScope = selectedCategory === 'Bookmarked'
    ? progress.bookmarkedQuestions.filter((id) => progress.practiceQuestionsAnswered.includes(id)).length
    : selectedCategory === 'All'
      ? progress.practiceQuestionsAnswered.length
      : practiceQuestions.filter((q) => q.category === selectedCategory && progress.practiceQuestionsAnswered.includes(q.id)).length;

  const progressPercent = totalCount > 0 ? (answeredInScope / totalCount) * 100 : 0;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent mb-4">
          <HelpCircle className="w-3.5 h-3.5 animate-pulse" />
          Interactive Trainer
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-primary mb-4 leading-tight">
          STAR Interview Q&A Flashcards
        </h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Drill common and tough interview questions. Study structurally indexed STAR replies, bookmark key flashcards, and track your overall practice progress.
        </p>
      </div>

      {/* Categories Tab navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150',
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:border-zinc-300'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Progress & Control Card */}
      <div className="bg-white border border-zinc-150 rounded-2xl p-6 mb-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in">
        <div className="w-full sm:w-2/3">
          <div className="flex justify-between items-center text-xs font-bold text-primary mb-2 uppercase tracking-wider">
            <span>{selectedCategory} progress</span>
            <span>{answeredInScope} / {totalCount} practiced</span>
          </div>
          <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden border border-zinc-200">
            <div
              className="bg-accent h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={answeredInScope === 0}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 w-full sm:w-auto justify-center',
            answeredInScope > 0
              ? 'bg-zinc-100 text-zinc-600 border border-zinc-250 hover:bg-zinc-200 hover:text-zinc-700'
              : 'bg-zinc-50 text-zinc-300 border border-zinc-100 cursor-not-allowed'
          )}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset progress
        </button>
      </div>

      {/* Questions Stack */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-zinc-150 rounded-2xl shadow-sm max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-primary mb-2">No questions found</h3>
          <p className="text-zinc-450 text-sm px-6">
            {selectedCategory === 'Bookmarked' 
              ? 'You haven\'t bookmarked any interview questions yet. Star some questions to see them here!'
              : 'Choose a different filter category to get started.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 md:gap-8 animate-fade-in">
          {filteredQuestions.map((q) => {
            const isAnswered = progress.practiceQuestionsAnswered.includes(q.id);
            const isBookmarked = progress.bookmarkedQuestions.includes(q.id);
            const isRevealed = !!revealedAnswers[q.id];

            return (
              <div
                key={q.id}
                className={cn(
                  'bg-white border rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-200',
                  isAnswered ? 'border-zinc-200 bg-zinc-50/20' : 'border-zinc-150'
                )}
              >
                {/* Header card meta */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-650">
                    {q.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBookmark(q.id)}
                      className={cn(
                        'p-1.5 rounded-lg border transition-colors duration-150',
                        isBookmarked 
                          ? 'bg-amber-50 border-amber-200 text-amber-500 hover:bg-amber-100' 
                          : 'bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600'
                      )}
                      aria-label="Bookmark question"
                    >
                      <Star className={cn('w-4 h-4', isBookmarked && 'fill-amber-500')} />
                    </button>
                    
                    <button
                      onClick={() => handleMarkAnswered(q.id)}
                      disabled={isAnswered}
                      className={cn(
                        'p-1.5 rounded-lg border transition-colors duration-150',
                        isAnswered
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 cursor-default'
                          : 'bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600'
                      )}
                      aria-label="Mark practiced"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-primary mb-4 leading-snug">
                  {q.question}
                </h3>

                {/* Quick Hint Card */}
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 mb-6 text-xs text-zinc-500 leading-relaxed font-body">
                  <span className="font-bold text-primary block mb-1">Preparation Hint:</span>
                  {q.tip}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors duration-150',
                      isRevealed
                        ? 'bg-primary text-white hover:bg-slate-900'
                        : 'bg-accent text-white hover:bg-accent/90'
                    )}
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {isRevealed ? 'Hide answer' : 'Reveal model answer'}
                  </button>
                  
                  {!isAnswered && (
                    <button
                      onClick={() => handleMarkAnswered(q.id)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-250 text-xs font-semibold text-zinc-650 hover:bg-zinc-50 hover:text-zinc-700 transition-colors"
                    >
                      Mark as practiced
                    </button>
                  )}
                </div>

                {/* Hidden STAR Answer Container */}
                {isRevealed && (
                  <div className="mt-8 border-t border-zinc-150 pt-8 animate-fade-in flex flex-col gap-6">
                    <p className="text-zinc-650 text-sm font-semibold leading-relaxed">
                      {q.modelAnswer.overview}
                    </p>

                    {q.modelAnswer.generalAnswer ? (
                      // General prompt answers
                      <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-150 text-sm text-zinc-550 leading-relaxed italic font-body">
                        {q.modelAnswer.generalAnswer}
                      </div>
                    ) : (
                      // Behavioral prompt answers
                      <div className="grid grid-cols-1 gap-4 font-body">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-150 text-xs leading-relaxed text-zinc-500">
                          <span className="sm:col-span-2 font-bold text-primary uppercase text-[10px] tracking-wider bg-zinc-200 border border-zinc-300 rounded px-2.5 py-1 w-fit h-fit">
                            S - Situation
                          </span>
                          <span className="sm:col-span-10 italic">{q.modelAnswer.situation}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-150 text-xs leading-relaxed text-zinc-500">
                          <span className="sm:col-span-2 font-bold text-primary uppercase text-[10px] tracking-wider bg-zinc-200 border border-zinc-300 rounded px-2.5 py-1 w-fit h-fit">
                            T - Task
                          </span>
                          <span className="sm:col-span-10 italic">{q.modelAnswer.task}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-150 text-xs leading-relaxed text-zinc-500">
                          <span className="sm:col-span-2 font-bold text-primary uppercase text-[10px] tracking-wider bg-zinc-200 border border-zinc-300 rounded px-2.5 py-1 w-fit h-fit">
                            A - Action
                          </span>
                          <span className="sm:col-span-10 italic">{q.modelAnswer.action}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-150 text-xs leading-relaxed text-zinc-500">
                          <span className="sm:col-span-2 font-bold text-primary uppercase text-[10px] tracking-wider bg-zinc-200 border border-zinc-300 rounded px-2.5 py-1 w-fit h-fit">
                            R - Result
                          </span>
                          <span className="sm:col-span-10 italic font-semibold text-primary">{q.modelAnswer.result}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
