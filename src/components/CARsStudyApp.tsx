'use client';

import React, { useState } from 'react';

import part1Data from '../../data/cars/part1.json';
import part2Data from '../../data/cars/part2.json';
import part4Data from '../../data/cars/part4.json';
import part5Data from '../../data/cars/part5.json';
import part6Data from '../../data/cars/part6.json';
import part7Data from '../../data/cars/part7.json';

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
import { RefreshCw, Check, X, Brain, Trophy, BookOpen } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  reference?: string;
  source?: string;
  explanation?: string;
  category?: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

// apenas Parts individuais (sem "all")
type PartKey = 'part1' | 'part2' | 'part4' | 'part5' | 'part6' | 'part7';

const PART_KEYS: PartKey[] = ['part1', 'part2', 'part4', 'part5', 'part6', 'part7'];

// JSON cru de cada Part
const RAW_PARTS: Record<PartKey, any[]> = {
  part1: part1Data as any[],
  part2: part2Data as any[],
  part4: part4Data as any[],
  part5: part5Data as any[],
  part6: part6Data as any[],
  part7: part7Data as any[],
};

// Rótulo de cada Part
const PART_LABELS: Record<PartKey, string> = {
  part1: 'CARs Part I – General Provisions',
  part2: 'CARs Part II – Aircraft Identification & Registration',
  part4: 'CARs Part IV – Personnel Licensing',
  part5: 'CARs Part V – Airworthiness',
  part6: 'CARs Part VI – General Operating & Flight Rules',
  part7: 'CARs Part VII – Commercial Air Services',
};

// Título curto (linha de cima)
const PART_SHORT_TITLES: Record<PartKey, string> = {
  part1: 'Part I',
  part2: 'Part II',
  part4: 'Part IV',
  part5: 'Part V',
  part6: 'Part VI',
  part7: 'Part VII',
};

function getPartQuestionCount(partId: PartKey): number {
  const data = RAW_PARTS[partId] ?? [];
  return data.length;
}

function getAllPartsQuestionCount(): number {
  return PART_KEYS.reduce((sum, pid) => sum + getPartQuestionCount(pid), 0);
}

// Constrói deck combinando todas as Parts selecionadas
function buildDeckForParts(parts: PartKey[]): Question[] {
  let runningId = 1;
  const result: Question[] = [];

  parts.forEach((pid) => {
    const data = RAW_PARTS[pid] ?? [];
    data.forEach((q: any) => {
      result.push({
        id: runningId++,
        question: q.question,
        options: q.options,
        correctAnswer: (q.correctAnswer ?? q.correct_answer) as
          | 'A'
          | 'B'
          | 'C'
          | 'D',
        reference: q.reference,
        source: q.source,
        explanation: q.explanation,
        category: q.category,
      });
    });
  });

  return result;
}

// Label bonito para o deck atual (cabeçalho/resultados)
function getDeckLabel(parts: PartKey[]): string {
  if (parts.length === PART_KEYS.length) return 'CARs – All Parts (Full Deck)';
  if (parts.length === 1) return PART_LABELS[parts[0]];

  const shortNames = parts.map((p) => PART_SHORT_TITLES[p]).join(', ');
  return `CARs – ${shortNames}`;
}

export default function CARsStudyApp() {
  // Começa só com Part I selecionada
  const [selectedParts, setSelectedParts] = useState<PartKey[]>(['part1']);
  const [showCarsParts, setShowCarsParts] = useState(false);

  const [allQuestions, setAllQuestions] = useState<Question[]>(
    () => buildDeckForParts(['part1']),
  );
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildDeckForParts(['part1']),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [mode, setMode] = useState<'home' | 'quiz' | 'results'>('home');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'practice' | 'test'>(
    'flashcard',
  );
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [testQuestionCount] = useState<25 | 50>(50);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const getTestDurationSeconds = (questionCount: number) => {
    if (questionCount === 25) return 22 * 60;
    return 45 * 60;
  };

  const applySelectedParts = (parts: PartKey[]) => {
  // garante pelo menos 1 selecionada
  const safeParts: PartKey[] =
    parts.length === 0 ? (['part1'] as PartKey[]) : parts;

  const deck = buildDeckForParts(safeParts);

  setSelectedParts(safeParts);
  setAllQuestions(deck);
  setQuestions(deck);

  setCurrentQuestionIndex(0);
  setUserAnswers([]);
  setSelectedAnswer('');
  setShowFeedback(false);
  setTimeLeft(null);
  setIsTimerRunning(false);
  setMode('home');
};


  // toggle de uma Part (multi-select)
  const togglePart = (pid: PartKey) => {
    applySelectedParts(
      selectedParts.includes(pid)
        ? selectedParts.filter((p) => p !== pid)
        : [...selectedParts, pid],
    );
  };

  // seleciona TODAS as Parts
  const handleSelectAllParts = () => {
    applySelectedParts(PART_KEYS);
  };

  const handleStartQuiz = (forcedMode?: 'flashcard' | 'practice' | 'test') => {
    const modeToUse = forcedMode ?? studyMode;

    setStudyMode(modeToUse);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setShowFeedback(false);

    if (modeToUse === 'test') {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const count = Math.min(testQuestionCount, allQuestions.length);
      const selected = shuffled.slice(0, count);

      setQuestions(selected);

      const duration = getTestDurationSeconds(count);
      setTimeLeft(duration);
      setIsTimerRunning(true);
    } else {
      setQuestions(allQuestions);
      setTimeLeft(null);
      setIsTimerRunning(false);
    }

    setMode('quiz');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);

    if (studyMode === 'test') {
      const currentQuestion = questions[currentQuestionIndex];
      const correct = answer === currentQuestion.correctAnswer;

      const existingIndex = userAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id,
      );

      const updatedAnswers =
        existingIndex >= 0
          ? userAnswers.map((a, idx) =>
              idx === existingIndex
                ? {
                    ...a,
                    selectedAnswer: answer as 'A' | 'B' | 'C' | 'D',
                    isCorrect: correct,
                  }
                : a,
            )
          : [
              ...userAnswers,
              {
                questionId: currentQuestion.id,
                selectedAnswer: answer as 'A' | 'B' | 'C' | 'D',
                isCorrect: correct,
              },
            ];

      setUserAnswers(updatedAnswers);

      if (updatedAnswers.length === questions.length) {
        setTimeout(() => {
          setMode('results');
          setIsTimerRunning(false);
        }, 300);
      }
    } else {
      const currentQuestion = questions[currentQuestionIndex];
      const correct = answer === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (studyMode === 'flashcard') {
      setShowFeedback(false);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer('');

      if (studyMode !== 'test') {
        setShowFeedback(false);
      }
    } else {
      if (studyMode === 'test') {
        setMode('results');
        setIsTimerRunning(false);
      } else {
        setCurrentQuestionIndex(0);
        setSelectedAnswer('');
        setShowFeedback(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowFeedback(false);

      if (studyMode !== 'test') {
        setSelectedAnswer('');
      }
    }
  };

  const handleRestart = () => {
    if (studyMode === 'test' && allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const count = Math.min(testQuestionCount, allQuestions.length);
      const selected = shuffled.slice(0, count);
      setQuestions(selected);

      const duration = getTestDurationSeconds(count);
      setTimeLeft(duration);
      setIsTimerRunning(true);
    } else {
      setQuestions(allQuestions);
      setTimeLeft(null);
      setIsTimerRunning(false);
    }

    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setShowFeedback(false);
    setMode('quiz');
  };

  const handleTakeNewTest = () => {
    if (allQuestions.length > 0) {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const count = Math.min(testQuestionCount, allQuestions.length);
      const selected = shuffled.slice(0, count);

      setQuestions(selected);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedAnswer('');
      setShowFeedback(false);

      const duration = getTestDurationSeconds(count);
      setTimeLeft(duration);
      setIsTimerRunning(true);
      setMode('quiz');
    }
  };

  const handleGoHome = () => {
    setMode('home');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setShowFeedback(false);
    setTimeLeft(null);
    setIsTimerRunning(false);
  };

  React.useEffect(() => {
    if (!isTimerRunning || timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      setTimeLeft(0);
      setMode('results');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  React.useEffect(() => {
    if (studyMode === 'test' && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const savedAnswer = userAnswers.find(
        (a) => a.questionId === currentQuestion.id,
      );
      setSelectedAnswer(savedAnswer?.selectedAnswer || '');
    }
  }, [currentQuestionIndex, studyMode, questions, userAnswers]);

  const calculateScore = () => {
    const totalQuestions = questions.length;
    const correct = userAnswers.filter((a) => a.isCorrect).length;
    const answered = userAnswers.length;
    const incorrect = Math.max(totalQuestions - correct, 0);
    const unanswered = Math.max(totalQuestions - answered, 0);
    const percentage =
      totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    return { correct, answered, unanswered, incorrect, totalQuestions, percentage };
  };

  const deckLabel = getDeckLabel(selectedParts);
  const allSelected = selectedParts.length === PART_KEYS.length;

  // ---------------- HOME SCREEN ----------------
  if (mode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Study System – Aviation
            </h1>
            <p className="text-muted-foreground">
              Choose the module and how you want to study.
            </p>
          </div>

          {/* MÓDULOS / BOTÃO CARs */}
          <Card>
            <CardHeader>
              <CardTitle>Modules</CardTitle>
              <CardDescription>Available study decks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Botão principal CARs */}
              <Button
                className="w-full justify-between"
                variant="secondary"
                onClick={() => setShowCarsParts((prev) => !prev)}
              >
                <span>CARs – Canadian Aviation Regulations</span>
                <span className="text-xs text-muted-foreground">
                  {showCarsParts ? 'Hide modules' : 'Show modules'}
                </span>
              </Button>

              {/* Lista vertical arrojada + multi-seleção */}
              {showCarsParts && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Select one or more Parts, or choose{' '}
                    <span className="font-semibold">All Parts</span> to study
                    everything in one deck.
                  </p>

                  <ul className="space-y-2">
                    {PART_KEYS.map((pid) => {
                      const isActive = selectedParts.includes(pid);
                      const fullLabel = PART_LABELS[pid];
                      const shortTitle = PART_SHORT_TITLES[pid];
                      const subtitle = fullLabel.split('–')[1]?.trim() ?? '';
                      const count = getPartQuestionCount(pid);

                      return (
                        <li key={pid}>
                          <button
                            type="button"
                            onClick={() => togglePart(pid)}
                            className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition 
                            ${
                              isActive
                                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                                : 'bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-semibold">
                                {shortTitle}
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

                    {/* ALL PARTS */}
                    <li>
                      <button
                        type="button"
                        onClick={handleSelectAllParts}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition 
                        ${
                          allSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold">
                            All Parts – Full CARs Deck
                          </div>
                          <div
                            className={`text-xs ${
                              allSelected ? 'text-blue-100' : 'text-blue-800/80'
                            }`}
                          >
                            Mix of all CARs Parts in a single deck.
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            allSelected
                              ? 'bg-blue-500 text-blue-50'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {getAllPartsQuestionCount()} questions
                        </span>
                      </button>
                    </li>
                  </ul>

                  <p className="text-xs text-muted-foreground">
                    Selected deck:{' '}
                    <span className="font-semibold">
                      {deckLabel} ({allQuestions.length} questions)
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* STUDY MODES */}
          <Card>
            <CardHeader>
              <CardTitle>Study modes</CardTitle>
              <CardDescription>
                Select how you want to review the deck.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">Flashcard mode</p>
                  <p className="text-xs text-muted-foreground">
                    See the question with the correct answer, explanation and
                    reference.
                  </p>
                </div>
                <Button onClick={() => handleStartQuiz('flashcard')}>Start</Button>
              </div>

              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">Practice mode</p>
                  <p className="text-xs text-muted-foreground">
                    Multiple choice with instant feedback.
                  </p>
                </div>
                <Button onClick={() => handleStartQuiz('practice')}>Start</Button>
              </div>

              <div className="flex items-center justify-between border rounded-lg px-4 py-3">
                <div>
                  <p className="font-semibold">Test mode</p>
                  <p className="text-xs text-muted-foreground">
                    Timed exam. Unanswered questions count as incorrect.
                  </p>
                </div>
                <Button onClick={() => handleStartQuiz('test')}>Start</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ---------------- QUIZ SCREENS ----------------
  if (mode === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (studyMode === 'flashcard') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Flashcard Mode</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Study System - {deckLabel}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Review questions one by one and see the correct answer instantly.
                </p>
              </div>

              <Button variant="outline" onClick={handleGoHome} size="sm">
                <X className="w-4 h-4 mr-2" />
                Exit
              </Button>
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
              <CardHeader className="space-y-4">
                <CardTitle className="text-lg md:text-xl text-foreground">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="font-semibold mb-1">Correct answer</p>
                  <p>
                    {currentQuestion.correctAnswer}.{' '}
                    {currentQuestion.options[currentQuestion.correctAnswer]}
                  </p>
                </div>

                {currentQuestion.explanation && (
                  <div className="p-3 rounded-lg bg-muted/60">
                    <p className="font-semibold mb-1">Explanation</p>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}

                <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                  {currentQuestion.reference && (
                    <p>
                      <span className="font-semibold">Regulation reference: </span>
                      {currentQuestion.reference}
                    </p>
                  )}
                  {currentQuestion.source && (
                    <p>
                      <span className="font-semibold">Study source: </span>
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
                  {currentQuestionIndex === questions.length - 1 ? 'Restart' : 'Next'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }

    // PRACTICE & TEST
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-1">
                <Brain className="w-3 h-3" />
                <span>{studyMode === 'practice' ? 'Practice Mode' : 'Test Mode'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Study System - {deckLabel}
              </h1>
              <p className="text-sm text-muted-foreground">
                {studyMode === 'practice'
                  ? 'Practice questions at your own pace with instant feedback.'
                  : 'Simulate a real test with a timer and detailed results.'}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {studyMode === 'test' && timeLeft !== null && (
                <span className="font-mono text-sm px-2 py-1 rounded bg-secondary text-secondary-foreground">
                  Time left: {formatTime(timeLeft)}
                </span>
              )}
              <Button variant="outline" onClick={handleGoHome} size="sm">
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
              <CardTitle className="text-lg md:text-xl text-foreground">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <RadioGroupItem value={optionKey} id={`quiz-${optionKey}`} />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {optionKey}. {currentQuestion.options[optionKey]}
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
                            {currentQuestion.options[currentQuestion.correctAnswer]}
                          </span>
                        </p>
                        {currentQuestion.reference && (
                          <p className="mt-1 text-xs">
                            <span className="font-semibold">Reference: </span>
                            {currentQuestion.reference}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
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
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // ---------------- RESULTS SCREEN ----------------
  if (mode === 'results') {
    const { correct, answered, unanswered, incorrect, totalQuestions, percentage } =
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
                <CardTitle className="text-3xl font-bold text-foreground">
                  Test Results – {deckLabel}
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
                    {correct} of {totalQuestions} questions correct
                  </p>

                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-muted-foreground">{correct} correct</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-muted-foreground">
                        {incorrect} incorrect
                      </span>
                    </div>
                  </div>
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
                      <span className="text-3xl font-bold">{percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Summary
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Total questions:{' '}
                    <span className="font-medium">{totalQuestions}</span>
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
                    • Correct answers:{' '}
                    <span className="font-medium">{correct}</span>
                  </li>
                  <li>
                    • Incorrect answers:{' '}
                    <span className="font-medium">{incorrect}</span>
                  </li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col md:flex-row md:justify-between gap-3">
              <Button onClick={handleTakeNewTest} className="w-full md:w-auto" size="lg">
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
                  Back to Main Menu
                </Button>
                <Button onClick={handleRestart} variant="outline" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
