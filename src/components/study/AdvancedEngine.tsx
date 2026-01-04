'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import {
  ArrowLeft,
  BookOpen,
  Brain,
  Check,
  Coins,
  Minus,
  Plus,
  RefreshCw,
  Trophy,
  User,
  X,
} from 'lucide-react';

// --------------------------------------------------------
// Tipos exportados para as páginas de módulo usarem
// --------------------------------------------------------

export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface RawQuestion {
  id?: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer?: OptionKey;
  correct_answer?: OptionKey;
  reference?: string;
  source?: string;
  explanation?: string;
  category?: string;
}

export interface DeckSection {
  id: string;                // ex: 'part1', 'sp01'
  title: string;             // título completo
  shortTitle?: string;       // ex: 'Part I', '01'
  subtitle?: string;         // descrição curta
  weight?: number;           // peso para provas (default = 1)
  questions: RawQuestion[];  // array de questões cru
}

// --------------------------------------------------------
// Tipos internos
// --------------------------------------------------------

interface Question {
  id: number;
  sectionId: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: OptionKey;
  reference?: string;
  source?: string;
  explanation?: string;
  category?: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: OptionKey;
  isCorrect: boolean;
}

type QuestionScoreMap = Record<number, number>; // 0–5

interface AdvancedEngineProps {
  moduleId: string;              // usado no localStorage (ex: 'cars', 'stdp')
  moduleTitle: string;
  moduleDescription: string;
  sections: DeckSection[];
  enableCredits?: boolean;       // se true, cobra crédito no modo Test
  examCost?: number;             // custo em créditos por prova (default 1)
  defaultTestQuestionCount?: number; // tamanho da prova (default 50)
}

// --------------------------------------------------------
// Utils
// --------------------------------------------------------

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffleQuestionOptions(question: Question): Question {
  const entries = Object.entries(question.options) as [OptionKey, string][];
  const shuffled = shuffleArray(entries);

  const newOptions: Record<OptionKey, string> = { A: '', B: '', C: '', D: '' };
  const newKeys: OptionKey[] = ['A', 'B', 'C', 'D'];

  let newCorrect: OptionKey = 'A';

  shuffled.forEach(([oldKey, text], idx) => {
    const newKey = newKeys[idx];
    newOptions[newKey] = text;
    if (oldKey === question.correctAnswer) {
      newCorrect = newKey;
    }
  });

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrect,
  };
}

// indicador visual de nível (0–5) por questão
function QuestionScoreIndicator({ score }: { score: number }) {
  const max = 5;
  const levels = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
      <span className="font-medium">Level {score}/5</span>
      <div className="flex gap-1">
        {levels.map((lvl) => (
          <div
            key={lvl}
            className={[
              'h-2 w-2 rounded-full border border-gray-400',
              lvl <= score ? 'bg-gray-800' : 'bg-transparent',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------
// LocalStorage helpers (por módulo)
// --------------------------------------------------------

function getScoreStorageKey(moduleId: string) {
  return `${moduleId}_questionScores_v1`;
}

function getCreditsStorageKey(moduleId: string) {
  return `${moduleId}_examCredits_v1`;
}

function loadQuestionScores(moduleId: string): QuestionScoreMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(getScoreStorageKey(moduleId));
    if (!raw) return {};
    return JSON.parse(raw) as QuestionScoreMap;
  } catch {
    return {};
  }
}

function saveQuestionScores(moduleId: string, map: QuestionScoreMap) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getScoreStorageKey(moduleId), JSON.stringify(map));
  } catch {
    // ignore
  }
}

function getQuestionScore(map: QuestionScoreMap, questionId: number): number {
  return map[questionId] ?? 3; // default 3 (meio termo)
}

function applyAnswerToScore(
  map: QuestionScoreMap,
  questionId: number,
  isCorrect: boolean,
): QuestionScoreMap {
  const current = map[questionId] ?? 3;
  const next = isCorrect ? Math.min(5, current + 1) : Math.max(0, current - 1);
  return { ...map, [questionId]: next };
}

function loadCredits(moduleId: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem(getCreditsStorageKey(moduleId));
    if (!raw) return 0;
    const num = Number(raw);
    return Number.isFinite(num) ? num : 0;
  } catch {
    return 0;
  }
}

function saveCredits(moduleId: string, value: number) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getCreditsStorageKey(moduleId), String(value));
  } catch {
    // ignore
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// --------------------------------------------------------
// Componente principal
// --------------------------------------------------------

function AdvancedEngine({
  moduleId,
  moduleTitle,
  moduleDescription,
  sections,
  enableCredits = true,
  examCost = 1,
  defaultTestQuestionCount = 50,
}: AdvancedEngineProps) {
  // ids das seções
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  // estado de seleção de seções
  const [selectedSections, setSelectedSections] = useState<string[]>(() =>
    sectionIds.length > 0 ? [sectionIds[0]] : [],
  );

  // modos de tela
  const [screenMode, setScreenMode] = useState<
    'home' | 'quiz' | 'results' | 'practiceResults' | 'account'
  >('home');

  const [studyMode, setStudyMode] = useState<'flashcard' | 'practice' | 'test'>(
    'flashcard',
  );

  // decks
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // timer (só test)
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // níveis por questão
  const [questionScores, setQuestionScores] = useState<QuestionScoreMap>({});

  // créditos
  const [credits, setCredits] = useState<number>(0);

  // mapa de questões já respondidas (trava no practice/test)
  const [lockedQuestions, setLockedQuestions] = useState<Record<number, boolean>>(
    {},
  );

  // ----------------------------------------------------
  // Helpers com base nas sections
  // ----------------------------------------------------

  const getSectionById = (id: string) => sections.find((s) => s.id === id);

  const getSectionQuestionCount = (id: string): number => {
    const section = getSectionById(id);
    return section?.questions?.length ?? 0;
  };

  const getAllSectionsQuestionCount = (): number =>
    sections.reduce((sum, s) => sum + (s.questions?.length ?? 0), 0);

  const deckLabel = useMemo(() => {
    if (selectedSections.length === 0) return `${moduleTitle} – No section selected`;
    if (selectedSections.length === sectionIds.length) {
      return `${moduleTitle} – All sections`;
    }
    const names = selectedSections
      .map((id) => getSectionById(id))
      .filter(Boolean)
      .map((s) => s!.shortTitle || s!.title);
    return `${moduleTitle} – ${names.join(', ')}`;
  }, [moduleTitle, selectedSections, sectionIds.length, sections]);

  // ----------------------------------------------------
  // Construção do deck
  // ----------------------------------------------------

  const buildDeckForSections = (sectionIdList: string[]): Question[] => {
    const activeIds = sectionIdList.length > 0 ? sectionIdList : sectionIds;

    let runningId = 1;
    const result: Question[] = [];

    activeIds.forEach((sid) => {
      const section = getSectionById(sid);
      if (!section) return;

      (section.questions || []).forEach((q) => {
        if (!q || !q.question || !q.options) return;

        const baseCorrect =
          (q.correctAnswer ?? q.correct_answer ?? 'A') as OptionKey;

        const baseQuestion: Question = {
          id: runningId++,
          sectionId: sid,
          question: q.question,
          options: q.options,
          correctAnswer: baseCorrect,
          reference: q.reference,
          source: q.source,
          explanation: q.explanation,
          category: q.category,
        };

        result.push(shuffleQuestionOptions(baseQuestion));
      });
    });

    return result;
  };

  const buildTestExamQuestions = (
    allQs: Question[],
    selectedSectionIds: string[],
    totalQuestions: number,
  ): Question[] => {
    const activeIds =
      selectedSectionIds.length > 0 ? selectedSectionIds : sectionIds;

    const maxQuestions = Math.min(totalQuestions, allQs.length);
    if (maxQuestions <= 0) return [];

    // agrupa por seção
    const pools: Record<string, Question[]> = {};
    let totalWeight = 0;

    activeIds.forEach((sid) => {
      pools[sid] = shuffleArray(allQs.filter((q) => q.sectionId === sid));
      const section = getSectionById(sid);
      const weight = section?.weight ?? 1;
      totalWeight += weight;
    });

    const selected: Question[] = [];
    const leftovers: Question[] = [];
    let remaining = maxQuestions;

    activeIds.forEach((sid) => {
      const pool = pools[sid] ?? [];
      if (pool.length === 0 || remaining <= 0) return;

      const section = getSectionById(sid);
      const weight = section?.weight ?? 1;
      const ideal = Math.round((maxQuestions * weight) / totalWeight);

      const target = Math.min(ideal, pool.length, remaining);
      selected.push(...pool.slice(0, target));
      remaining -= target;
      leftovers.push(...pool.slice(target));
    });

    if (remaining > 0 && leftovers.length > 0) {
      const shuffledLeftovers = shuffleArray(leftovers);
      selected.push(...shuffledLeftovers.slice(0, remaining));
    }

    return shuffleArray(selected).slice(0, maxQuestions);
  };

  const totalQuestionsSelected = useMemo(
    () =>
      selectedSections.reduce(
        (sum, sid) => sum + getSectionQuestionCount(sid),
        0,
      ),
    [selectedSections, sections],
  );

  const allSelected = selectedSections.length === sectionIds.length;

  // ----------------------------------------------------
  // Efeitos: carregar scores / créditos
  // ----------------------------------------------------

  useEffect(() => {
    setQuestionScores(loadQuestionScores(moduleId));
    setCredits(loadCredits(moduleId));
  }, [moduleId]);

  useEffect(() => {
    saveQuestionScores(moduleId, questionScores);
  }, [moduleId, questionScores]);

  useEffect(() => {
    saveCredits(moduleId, credits);
  }, [moduleId, credits]);

  // timer
  useEffect(() => {
    if (!isTimerRunning || timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      setTimeLeft(0);
      setScreenMode('results');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // ----------------------------------------------------
  // Handlers gerais
  // ----------------------------------------------------

  const handleToggleSection = (sid: string) => {
    setSelectedSections((prev) =>
      prev.includes(sid) ? prev.filter((id) => id !== sid) : [...prev, sid],
    );
  };

  const handleSelectAllSections = () => {
    setSelectedSections(sectionIds);
  };

  const handleStartQuiz = (modeToUse: 'flashcard' | 'practice' | 'test') => {
    if (sections.length === 0) {
      alert('This module has no sections configured yet.');
      return;
    }

    const deck = buildDeckForSections(selectedSections);
    if (deck.length === 0) {
      alert(
        'There are no questions in the selected sections. Please add questions to the JSON files.',
      );
      return;
    }

    // Test mode: créditos + prova balanceada
    if (modeToUse === 'test') {
      if (enableCredits && credits < examCost) {
        alert(
          `You do not have enough exam credits to start a test. Required: ${examCost}.`,
        );
        return;
      }

      if (enableCredits) {
        setCredits((prev) => Math.max(prev - examCost, 0));
      }

      const testQuestions = buildTestExamQuestions(
        deck,
        selectedSections,
        defaultTestQuestionCount,
      );

      setQuestions(testQuestions);
      setTimeLeft(testQuestions.length > 25 ? 45 * 60 : 22 * 60);
      setIsTimerRunning(true);
    } else {
      // flashcard / practice usam o deck completo
      setQuestions(deck);
      setTimeLeft(null);
      setIsTimerRunning(false);
    }

    setAllQuestions(deck);
    setStudyMode(modeToUse);
    setScreenMode('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setUserAnswers([]);
    setShowFeedback(false);
    setIsCorrect(false);
    setLockedQuestions({});
  };

  const handleGoHome = () => {
    setScreenMode('home');
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setUserAnswers([]);
    setLockedQuestions({});
    setTimeLeft(null);
    setIsTimerRunning(false);
  };

  const handleAnswerSelect = (value: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // trava practice/test
    if (
      (studyMode === 'practice' || studyMode === 'test') &&
      lockedQuestions[currentQuestion.id]
    ) {
      return;
    }

    setSelectedAnswer(value);

    if (studyMode === 'flashcard') return;

    const correct = value === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(studyMode === 'practice');

    // score
    setQuestionScores((prev) =>
      applyAnswerToScore(prev, currentQuestion.id, correct),
    );

    // salva resposta
    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.questionId === currentQuestion.id,
      );
      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: value as OptionKey,
        isCorrect: correct,
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = answer;
        return copy;
      }
      return [...prev, answer];
    });

    // trava questão
    if (studyMode === 'practice' || studyMode === 'test') {
      setLockedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }

    // auto-finaliza prova quando respondeu tudo
    if (studyMode === 'test') {
      const newAnsweredCount = userAnswers.length + 1;
      if (newAnsweredCount >= questions.length) {
        setTimeout(() => {
          setScreenMode('results');
          setIsTimerRunning(false);
        }, 300);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      // fim do deck
      if (studyMode === 'test') {
        setScreenMode('results');
        setIsTimerRunning(false);
      } else if (studyMode === 'practice') {
        setScreenMode('practiceResults');
      } else {
        // flashcard apenas volta pro início
        setCurrentQuestionIndex(0);
      }
      setSelectedAnswer('');
      setShowFeedback(false);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer('');
    if (studyMode === 'practice') {
      setShowFeedback(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex((prev) => prev - 1);
    setSelectedAnswer('');
    if (studyMode === 'practice') {
      setShowFeedback(false);
    }
  };

  const handleRestartCurrentMode = () => {
    if (questions.length === 0) return;

    if (studyMode === 'test') {
      if (enableCredits && credits < examCost) {
        alert(
          'You do not have enough exam credits to start a new test. Add more credits in My account.',
        );
        return;
      }
      if (enableCredits) {
        setCredits((prev) => Math.max(prev - examCost, 0));
      }

      const newTestQuestions = buildTestExamQuestions(
        allQuestions,
        selectedSections,
        defaultTestQuestionCount,
      );

      setQuestions(newTestQuestions);
      setTimeLeft(newTestQuestions.length > 25 ? 45 * 60 : 22 * 60);
      setIsTimerRunning(true);
    } else {
      const deck = buildDeckForSections(selectedSections);
      setQuestions(deck);
      setTimeLeft(null);
      setIsTimerRunning(false);
    }

    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setUserAnswers([]);
    setLockedQuestions({});
    setScreenMode('quiz');
  };

  const handlePracticeOnlyIncorrect = () => {
    const incorrectIds = userAnswers
      .filter((a) => !a.isCorrect)
      .map((a) => a.questionId);

    const incorrectQuestions = questions.filter((q) =>
      incorrectIds.includes(q.id),
    );

    if (incorrectQuestions.length === 0) {
      handleRestartCurrentMode();
      return;
    }

    setQuestions(incorrectQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setUserAnswers([]);
    setLockedQuestions({});
    setScreenMode('quiz');
  };

  const calculateScore = () => {
    const total = questions.length;
    const correct = userAnswers.filter((a) => a.isCorrect).length;
    const answered = userAnswers.length;
    const incorrect = Math.max(answered - correct, 0);
    const unanswered = Math.max(total - answered, 0);
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { total, correct, answered, incorrect, unanswered, percentage };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentScore =
    currentQuestion && questionScores
      ? getQuestionScore(questionScores, currentQuestion.id)
      : 3;

  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  // ----------------------------------------------------
  // TELAS
  // ----------------------------------------------------

  // 1) Tela "Minha conta" (créditos por módulo)
  if (screenMode === 'account') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <User className="h-3 w-3" />
                <span>My account – {moduleTitle}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Exam credits
              </h1>
              <p className="text-sm text-muted-foreground">
                Credits for Test mode sessions in this module.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={handleGoHome}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Available credits</CardTitle>
              <CardDescription>
                Test mode consumes credits; Practice and Flashcards are free.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm font-semibold">
                    Credits for this module
                  </span>
                </div>
                <span className="font-mono text-lg">{credits}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>• 1 Test = {examCost} credit</span>
                <span>• Practice and Flashcards are always free</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                In the future, credits will be recharged via payment methods.
              </p>
              {/* botão dev pra você encher os créditos */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCredits((prev) => prev + 5)}
              >
                Add 5 test credits (dev)
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 2) Tela inicial do módulo (seleção de seções + modos)
  if (screenMode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {moduleTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {moduleDescription}
              </p>
            </div>

            {enableCredits && (
              <div className="flex flex-col items-end gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs">
                  <Coins className="h-3 w-3" />
                  <span className="font-medium">
                    Credits:{' '}
                    <span className="font-mono">
                      {credits}
                    </span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setScreenMode('account')}
                >
                  <User className="mr-2 h-4 w-4" />
                  My account
                </Button>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>
                Select one or more sections to build the study deck.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No sections configured for this module yet.
                </p>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Click to toggle each section. You can combine multiple
                      sections in one session.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllSections}
                    >
                      Select all
                    </Button>
                  </div>

                  <ul className="space-y-2">
                    {sections.map((section) => {
                      const isActive = selectedSections.includes(section.id);
                      const count = section.questions?.length ?? 0;
                      const subtitle =
                        section.subtitle ||
                        `${count} question${count === 1 ? '' : 's'}`;

                      return (
                        <li key={section.id}>
                          <button
                            type="button"
                            onClick={() => handleToggleSection(section.id)}
                            className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition
                              ${
                                isActive
                                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                  : 'bg-white hover:bg-gray-50 border-gray-200'
                              }`}
                          >
                            <div>
                              <div className="text-sm font-semibold">
                                {section.shortTitle || section.title}
                              </div>
                              <div
                                className={`text-xs ${
                                  isActive ? 'text-gray-200' : 'text-gray-600'
                                }`}
                              >
                                {subtitle}
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                isActive
                                  ? 'bg-gray-800 text-gray-100'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {count} questions
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-xs text-muted-foreground">
                    Selected sections:{' '}
                    <span className="font-semibold">
                      {selectedSections.length}
                    </span>{' '}
                    · Total questions in deck:{' '}
                    <span className="font-semibold">
                      {totalQuestionsSelected}
                    </span>
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study modes</CardTitle>
              <CardDescription>
                Choose how you want to study this deck.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">Flashcard mode</p>
                  <p className="text-xs text-muted-foreground">
                    Shows the correct answer and explanation immediately.
                  </p>
                </div>
                <Button
                  disabled={totalQuestionsSelected === 0}
                  onClick={() => handleStartQuiz('flashcard')}
                >
                  Start
                </Button>
              </div>

              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">Practice mode</p>
                  <p className="text-xs text-muted-foreground">
                    Multiple choice with instant feedback. Free, unlimited.
                  </p>
                </div>
                <Button
                  disabled={totalQuestionsSelected === 0}
                  onClick={() => handleStartQuiz('practice')}
                >
                  Start
                </Button>
              </div>

              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">Test mode</p>
                  <p className="text-xs text-muted-foreground">
                    Timed exam. Unanswered questions count as incorrect.
                    {enableCredits && (
                      <>
                        {' '}
                        Costs{' '}
                        <span className="font-semibold">
                          {examCost} credit
                          {examCost !== 1 && 's'}
                        </span>{' '}
                        per test.
                      </>
                    )}
                  </p>
                </div>
                <Button
                  disabled={totalQuestionsSelected === 0}
                  onClick={() => handleStartQuiz('test')}
                >
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between text-xs text-muted-foreground">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to main menu
              </Button>
            </Link>
            <span>{deckLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  // 3) Tela de quiz (Flashcard / Practice / Test)
  if (screenMode === 'quiz' && currentQuestion) {
    const isFlashcard = studyMode === 'flashcard';
    const isTest = studyMode === 'test';

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-1">
                {isFlashcard ? (
                  <>
                    <BookOpen className="w-3 h-3" />
                    <span>Flashcard mode</span>
                  </>
                ) : studyMode === 'practice' ? (
                  <>
                    <Brain className="w-3 h-3" />
                    <span>Practice mode</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-3 h-3" />
                    <span>Test mode</span>
                  </>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {moduleTitle}
              </h1>
              <p className="text-sm text-muted-foreground">
                {deckLabel}
              </p>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {isTest && timeLeft !== null && (
                <span className="font-mono text-sm px-2 py-1 rounded bg-secondary text-secondary-foreground">
                  Time left: {formatTime(timeLeft)}
                </span>
              )}
              <Button variant="outline" size="sm" onClick={handleGoHome}>
                <X className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% completed</span>
            </div>
            <div className="w-full bg-secondary/40 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="shadow-lg border-primary/10">
            <CardHeader className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg md:text-xl">
                  {currentQuestion.question}
                </CardTitle>
                {!isFlashcard && (
                  <QuestionScoreIndicator score={currentScore} />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFlashcard ? (
                <>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                    <p className="font-semibold mb-1">Correct answer</p>
                    <p>
                      {currentQuestion.correctAnswer}.{' '}
                      {
                        currentQuestion.options[
                          currentQuestion.correctAnswer
                        ]
                      }
                    </p>
                  </div>
                  {currentQuestion.explanation && (
                    <div className="p-3 rounded-lg bg-muted/60 text-sm">
                      <p className="font-semibold mb-1">Explanation</p>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  )}
                  <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                    {currentQuestion.reference && (
                      <p>
                        <span className="font-semibold">Reference: </span>
                        {currentQuestion.reference}
                      </p>
                    )}
                    {currentQuestion.source && (
                      <p>
                        <span className="font-semibold">Source: </span>
                        {currentQuestion.source}
                      </p>
                    )}
                    {currentQuestion.category && (
                      <p>
                        <span className="font-semibold">Category: </span>
                        {currentQuestion.category}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <RadioGroup
                    value={selectedAnswer}
                    onValueChange={handleAnswerSelect}
                    className="grid gap-3"
                  >
                    {(['A', 'B', 'C', 'D'] as const).map((optionKey) => (
                      <Label
                        key={optionKey}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedAnswer === optionKey
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/60 hover:bg-primary/5'
                        }`}
                      >
                        <RadioGroupItem
                          value={optionKey}
                          id={`${moduleId}-${currentQuestion.id}-${optionKey}`}
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">
                            {optionKey}.{' '}
                            {currentQuestion.options[optionKey]}
                          </span>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>

                  {studyMode === 'practice' && showFeedback && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-sm flex items-start space-x-2 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                          : 'bg-red-50 text-red-800 border border-red-100'
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCorrect ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {isCorrect ? 'Correct!' : 'Incorrect.'}
                        </p>
                        {!isCorrect && (
                          <>
                            <p className="mt-1">
                              Correct answer:{' '}
                              <span className="font-semibold">
                                {currentQuestion.correctAnswer}.{' '}
                                {
                                  currentQuestion.options[
                                    currentQuestion.correctAnswer
                                  ]
                                }
                              </span>
                            </p>
                            {currentQuestion.reference && (
                              <p className="mt-1 text-xs">
                                <span className="font-semibold">
                                  Reference:{' '}
                                </span>
                                {currentQuestion.reference}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                disabled={currentQuestionIndex === 0}
                onClick={handlePreviousQuestion}
              >
                Previous
              </Button>
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === questions.length - 1
                  ? isTest
                    ? 'Finish test'
                    : 'Finish'
                  : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 4) Resultados de Practice
  if (screenMode === 'practiceResults') {
    const { total, correct, incorrect, answered, unanswered, percentage } =
      calculateScore();

    const incorrectDetails = userAnswers
      .filter((a) => !a.isCorrect)
      .map((ans, idx) => {
        const q = questions.find((qq) => qq.id === ans.questionId);
        return q
          ? {
              idx,
              question: q,
              answer: ans,
            }
          : null;
      })
      .filter(Boolean) as {
      idx: number;
      question: Question;
      answer: UserAnswer;
    }[];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-9 h-9 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Practice Summary – {moduleTitle}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Use this to attack your weak questions.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-3xl font-bold tracking-tight">
                    {percentage}%{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      correct in this practice
                    </span>
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      • Total questions in deck:{' '}
                      <span className="font-medium">{total}</span>
                    </li>
                    <li>
                      • Answered:{' '}
                      <span className="font-medium">{answered}</span>
                    </li>
                    <li>
                      • Unanswered:{' '}
                      <span className="font-medium">{unanswered}</span>
                    </li>
                    <li>
                      • Correct:{' '}
                      <span className="font-medium">{correct}</span>
                    </li>
                    <li>
                      • Incorrect:{' '}
                      <span className="font-medium">{incorrect}</span>
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-64">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-secondary" />
                    <div
                      className="absolute inset-2 rounded-full border-[8px] border-primary"
                      style={{
                        background: `conic-gradient(var(--primary) ${percentage}%, transparent ${percentage}%)`,
                      }}
                    />
                    <div className="absolute inset-6 rounded-full bg-background flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h3 className="text-sm font-semibold">Questions you missed</h3>
                {incorrectDetails.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    You didn&apos;t miss any question in this practice. Great
                    job!
                  </p>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-auto pr-1">
                    {incorrectDetails.map(({ idx, question, answer }) => (
                      <div
                        key={`${question.id}-${idx}`}
                        className="border rounded-md p-2 bg-muted/40 text-xs"
                      >
                        <p className="font-semibold mb-1">
                          Q{idx + 1}. {question.question}
                        </p>
                        <p className="mb-1">
                          Your answer:{' '}
                          <span className="font-semibold">
                            {answer.selectedAnswer}.{' '}
                            {question.options[answer.selectedAnswer]}
                          </span>
                        </p>
                        <p className="mb-1">
                          Correct answer:{' '}
                          <span className="font-semibold">
                            {question.correctAnswer}.{' '}
                            {
                              question.options[
                                question.correctAnswer
                              ]
                            }
                          </span>
                        </p>
                        {question.reference && (
                          <p className="text-[11px] text-muted-foreground">
                            Reference: {question.reference}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row md:justify-between gap-3">
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Button
                  className="w-full md:w-auto"
                  size="sm"
                  onClick={handleRestartCurrentMode}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Repeat practice with same configuration
                </Button>
                <Button
                  className="w-full md:w-auto"
                  size="sm"
                  variant="outline"
                  disabled={
                    userAnswers.filter((a) => !a.isCorrect).length === 0
                  }
                  onClick={handlePracticeOnlyIncorrect}
                >
                  Study only the questions I got wrong
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Back to module home
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 5) Resultados de Test
  if (screenMode === 'results') {
    const { total, correct, incorrect, answered, unanswered, percentage } =
      calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold">
                  Test Results – {moduleTitle}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Review your performance and identify areas to improve.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-4xl font-bold tracking-tight">
                    {percentage}%{' '}
                    <span className="text-base font-normal text-muted-foreground">
                      score
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {correct} of {total} questions correct
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      • Answered:{' '}
                      <span className="font-medium">{answered}</span>
                    </li>
                    <li>
                      • Unanswered:{' '}
                      <span className="font-medium">
                        {unanswered}
                      </span>
                    </li>
                    <li>
                      • Incorrect:{' '}
                      <span className="font-medium">{incorrect}</span>
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-64">
                  <div className="relative w-40 h-40 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-secondary" />
                    <div
                      className="absolute inset-3 rounded-full border-[10px] border-primary"
                      style={{
                        background: `conic-gradient(var(--primary) ${percentage}%, transparent ${percentage}%)`,
                      }}
                    />
                    <div className="absolute inset-7 rounded-full bg-background flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row md:justify-between gap-3">
              <Button
                onClick={handleRestartCurrentMode}
                className="w-full md:w-auto"
                size="lg"
              >
                <Brain className="w-4 h-4 mr-2" />
                Take another test
              </Button>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Back to module home
                </Button>
                <Button
                  onClick={handlePracticeOnlyIncorrect}
                  variant="outline"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Practice only incorrect questions
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // fallback (não deveria chegar aqui)
  return null;
}

export default AdvancedEngine;
