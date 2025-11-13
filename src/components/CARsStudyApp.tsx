'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Upload, RefreshCw, Check, X, FileText, Brain, Trophy, BookOpen } from 'lucide-react';

interface Question {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  id: number;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
}

export default function CARsStudyApp() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [mode, setMode] = useState<'upload' | 'quiz' | 'results'>('upload');
  const [studyMode, setStudyMode] = useState<'practice' | 'test' | 'flashcard'>('flashcard');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fileName, setFileName] = useState('');
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const [hasStoredQuestions, setHasStoredQuestions] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  // Quantidade de questões no Test Mode (25 ou 50)
  const [testQuestionCount, setTestQuestionCount] = useState<25 | 50>(50);

  // Timer do Test Mode
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const getTestDurationSeconds = (questionCount: number) => {
    if (questionCount === 25) return 22 * 60; // 22 minutos
    return 45 * 60; // 45 minutos para 50 questões
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExportQuestions = () => {
    const questionsToExport = allQuestions.length > 0 ? allQuestions : questions;
    
    if (questionsToExport.length === 0) {
      alert('Não há questões para exportar.');
      return;
    }

    const exportText = questionsToExport.map((q) => {
      const lines = [
        `Q: ${q.question}`,
        `A. ${q.options.A}`,
        `B. ${q.options.B}`,
        `C. ${q.options.C}`,
        `D. ${q.options.D}`,
        `Correct Answer: ${q.correctAnswer}`,
        ''
      ];
      return lines.join('\n');
    }).join('\n');

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const exportFileName = fileName.replace('.txt', '') + '_sem_duplicadas.txt';
    link.download = exportFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const shuffleOptions = (
    options: { A: string; B: string; C: string; D: string },
    correctAnswer: 'A' | 'B' | 'C' | 'D'
  ) => {
    const optionEntries = [
      { key: 'A', value: options.A },
      { key: 'B', value: options.B },
      { key: 'C', value: options.C },
      { key: 'D', value: options.D }
    ];

    for (let i = optionEntries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionEntries[i], optionEntries[j]] = [optionEntries[j], optionEntries[i]];
    }

    const newCorrectIndex = optionEntries.findIndex(entry => entry.key === correctAnswer);
    const newCorrectAnswer = ['A', 'B', 'C', 'D'][newCorrectIndex] as 'A' | 'B' | 'C' | 'D';

    const shuffledOptions = {
      A: optionEntries[0].value,
      B: optionEntries[1].value,
      C: optionEntries[2].value,
      D: optionEntries[3].value
    };

    return { shuffledOptions, newCorrectAnswer };
  };

  const parseQuestions = (text: string): Question[] => {
    const parsed: Question[] = [];
    const questionBlocks = text.split(/\n\s*\n/).filter(block => block.trim());
    const seenQuestions = new Set<string>();
    let duplicateCount = 0;

    questionBlocks.forEach((block) => {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 6) return;

      const questionLine = lines.find(line => line.startsWith('Q:'));
      const correctLine = lines.find(line => line.toLowerCase().startsWith('correct answer:'));
      
      if (!questionLine || !correctLine) return;

      const question = questionLine.replace(/^Q:\s*/, '').trim();
      const correctAnswer = correctLine.replace(/^correct answer:\s*/i, '').trim().toUpperCase() as 'A' | 'B' | 'C' | 'D';

      const options = {
        A: '',
        B: '',
        C: '',
        D: ''
      };

      lines.forEach(line => {
        if (line.match(/^A\.\s/)) options.A = line.replace(/^A\.\s*/, '').trim();
        if (line.match(/^B\.\s/)) options.B = line.replace(/^B\.\s*/, '').trim();
        if (line.match(/^C\.\s/)) options.C = line.replace(/^C\.\s*/, '').trim();
        if (line.match(/^D\.\s/)) options.D = line.replace(/^D\.\s*/, '').trim();
      });

      if (options.A && options.B && options.C && options.D) {
        const questionKey = `${question.toLowerCase()}|${options.A}|${options.B}|${options.C}|${options.D}`;
        
        if (seenQuestions.has(questionKey)) {
          duplicateCount++;
          return;
        }
        
        seenQuestions.add(questionKey);

        const { shuffledOptions, newCorrectAnswer } = shuffleOptions(options, correctAnswer);

        parsed.push({
          question,
          options: shuffledOptions,
          correctAnswer: newCorrectAnswer,
          id: parsed.length // usa comprimento atual como ID
        });
      }
    });

    if (duplicateCount > 0) {
      alert(`Encontradas ${duplicateCount} questão(ões) duplicada(s). Elas foram removidas automaticamente.`);
    }

    return parsed;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const questionBlocks = text.split(/\n\s*\n/).filter(block => block.trim());
      const totalQuestions = questionBlocks.length;
      
      const parsedQuestions = parseQuestions(text);
      const duplicates = totalQuestions - parsedQuestions.length;
      
      if (parsedQuestions.length > 0) {
        setAllQuestions(parsedQuestions);
        setQuestions(parsedQuestions);
        setDuplicatesRemoved(duplicates);
        setMode('quiz');
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer('');
        
        localStorage.setItem('studyQuestions', JSON.stringify(parsedQuestions));
        localStorage.setItem('studyFileName', file.name);
        localStorage.setItem('studyDuplicates', duplicates.toString());
        setHasStoredQuestions(true);
      } else {
        alert('Não foi possível encontrar questões no arquivo. Verifique o formato.');
      }
    };

    reader.readAsText(file);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    if (studyMode === 'test') {
      const currentQuestion = questions[currentQuestionIndex];
      const correct = answer === currentQuestion.correctAnswer;
      
      const existingAnswerIndex = userAnswers.findIndex(a => a.questionId === currentQuestion.id);
      
      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: answer as 'A' | 'B' | 'C' | 'D',
        isCorrect: correct
      };
      
      if (existingAnswerIndex >= 0) {
        setUserAnswers(prev => {
          const updated = [...prev];
          updated[existingAnswerIndex] = newAnswer;
          return updated;
        });
      } else {
        setUserAnswers(prev => [...prev, newAnswer]);
      }
    }
    
    setShowFeedback(false);
  };

  const handleGotIt = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      setMode('results');
    }
  };

  const handleSubmitAnswer = () => {
    if (studyMode === 'practice') {
      if (!selectedAnswer) return;

      const currentQuestion = questions[currentQuestionIndex];
      const correct = selectedAnswer === currentQuestion.correctAnswer;
      
      const answer: UserAnswer = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer as 'A' | 'B' | 'C' | 'D',
        isCorrect: correct
      };

      setUserAnswers(prev => [...prev, answer]);
      setIsCorrect(correct);
      setShowFeedback(true);
      
      if (correct) {
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer('');
            setShowFeedback(false);
          } else {
            setMode('results');
          }
        }, 2000);
      }
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        const nextQuestion = questions[currentQuestionIndex + 1];
        const savedAnswer = userAnswers.find(a => a.questionId === nextQuestion.id);
        setSelectedAnswer(savedAnswer?.selectedAnswer || '');
      } else {
        setMode('results');
      }
    }
  };

  const handleNextFlashcard = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleGoHome();
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
      setTimeLeft(null);
      setIsTimerRunning(false);
      setQuestions(allQuestions);
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
      setMode('quiz');

      const duration = getTestDurationSeconds(count);
      setTimeLeft(duration);
      setIsTimerRunning(true);
    }
  };

  const handleGoHome = () => {
    setMode('upload');
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer('');
    setShowFeedback(false);
    setTimeLeft(null);
    setIsTimerRunning(false);
  };

  const handleClearMemory = () => {
    if (confirm('Tem certeza que deseja apagar todas as questões salvas? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('studyQuestions');
      localStorage.removeItem('studyFileName');
      localStorage.removeItem('studyDuplicates');
      setQuestions([]);
      setFileName('');
      setDuplicatesRemoved(0);
      setHasStoredQuestions(false);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedAnswer('');
      setShowFeedback(false);
      setMode('upload');
      setTimeLeft(null);
      setIsTimerRunning(false);
    }
  };

  const handleContinueStudying = () => {
    if (allQuestions.length > 0) {
      if (studyMode === 'test') {
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
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedAnswer('');
      setShowFeedback(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (allQuestions.length > 0 && mode === 'quiz') {
      if (studyMode === 'test') {
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
      } else {
        setQuestions(allQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer('');
        setShowFeedback(false);
        setTimeLeft(null);
        setIsTimerRunning(false);
      }
    }
  }, [studyMode]);

  React.useEffect(() => {
    if (!isTimerRunning || timeLeft === null) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      setTimeLeft(0);
      setMode('results');
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  React.useEffect(() => {
    if (studyMode === 'test' && questions.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const savedAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);
      setSelectedAnswer(savedAnswer?.selectedAnswer || '');
    }
  }, [currentQuestionIndex, studyMode, questions, userAnswers]);

  React.useEffect(() => {
    const storedQuestions = localStorage.getItem('studyQuestions');
    const storedFileName = localStorage.getItem('studyFileName');
    const storedDuplicates = localStorage.getItem('studyDuplicates');
    
    if (storedQuestions) {
      try {
        const parsed = JSON.parse(storedQuestions);
        setAllQuestions(parsed);
        setQuestions(parsed);
        setFileName(storedFileName || 'Arquivo carregado');
        setDuplicatesRemoved(parseInt(storedDuplicates || '0'));
        setHasStoredQuestions(true);
      } catch (error) {
        console.error('Error loading stored questions:', error);
        localStorage.removeItem('studyQuestions');
        localStorage.removeItem('studyFileName');
        localStorage.removeItem('studyDuplicates');
      }
    }
  }, []);

  const calculateScore = () => {
    const correct = userAnswers.filter(a => a.isCorrect).length;
    const total = userAnswers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  };

  if (mode === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Study System</CardTitle>
            <CardDescription className="text-base">
              Upload your question file and start studying
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showSettings && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg border-2 border-border">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <h3 className="font-semibold text-foreground">Settings</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-settings"
                    />
                    <label htmlFor="file-upload-settings" className="cursor-pointer flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">
                          Upload New File
                        </p>
                        <p className="text-xs text-muted-foreground">
                          TXT file with formatted questions
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="bg-background rounded-lg p-4 space-y-2">
                    <div className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">File format:</p>
                        <div className="text-xs text-muted-foreground space-y-1 font-mono bg-muted p-2 rounded">
                          <p>Q: Your question here?</p>
                          <p>A. Option A</p>
                          <p>B. Option B</p>
                          <p>C. Option C</p>
                          <p>D. Option D</p>
                          <p>Correct Answer: A</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {hasStoredQuestions && allQuestions.length > 0 && duplicatesRemoved > 0 && (
                      <Button 
                        onClick={handleExportQuestions} 
                        variant="outline" 
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Export Questions (no duplicates)
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleClearMemory} 
                      variant="destructive" 
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Memory
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {hasStoredQuestions && allQuestions.length > 0 && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30 rounded-xl p-8 text-center space-y-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Continue Studying</h3>
                  <div className="inline-flex items-center space-x-2 bg-background/80 px-4 py-2 rounded-full border border-border">
                    <FileText className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">
                      {fileName}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {allQuestions.length} <span className="text-base font-normal text-muted-foreground">questions ready</span>
                  </p>
                </div>
                <div className="space-y-2 pt-2">
                  <Button onClick={handleContinueStudying} className="w-full" size="lg">
                    <Brain className="w-5 h-5 mr-2" />
                    Start Quiz
                  </Button>
                  {duplicatesRemoved > 0 && (
                    <Button onClick={handleExportQuestions} variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Export Questions (no duplicates)
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="font-semibold text-foreground">Select study mode:</p>

              <div className="grid grid-cols-3 gap-4">
                <Card 
                  className={`border-2 transition-all cursor-pointer hover:shadow-md ${studyMode === 'flashcard' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setStudyMode('flashcard')}
                >
                  <CardContent className="pt-6 relative">
                    {studyMode === 'flashcard' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <p className="font-semibold text-foreground text-lg">Flash Card</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Question and correct answer only - Quick review
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card 
                  className={`border-2 transition-all cursor-pointer hover:shadow-md ${studyMode === 'practice' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setStudyMode('practice')}
                >
                  <CardContent className="pt-6 relative">
                    {studyMode === 'practice' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground text-lg">Practice Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Immediate feedback after each answer
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card 
                  className={`border-2 transition-all cursor-pointer hover:shadow-md ${studyMode === 'test' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  onClick={() => setStudyMode('test')}
                >
                  <CardContent className="pt-6 relative">
                    {studyMode === 'test' && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground text-lg">Test Mode</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Random questions - Full test simulation
                      </p>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={testQuestionCount === 25 ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestQuestionCount(25);
                          }}
                        >
                          25 questions
                        </Button>
                        <Button
                          type="button"
                          variant={testQuestionCount === 50 ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTestQuestionCount(50);
                          }}
                        >
                          50 questions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (studyMode === 'flashcard') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">Flash Card Mode</h1>
                <div className="flex items-center space-x-3">
                  <p className="text-sm text-muted-foreground">{fileName}</p>
                  {duplicatesRemoved > 0 && (
                    <span className="text-xs bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 px-2 py-1 rounded">
                      {duplicatesRemoved} duplicate(s) removed
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {duplicatesRemoved > 0 && (
                  <Button variant="outline" onClick={handleExportQuestions} size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
                <Button variant="outline" onClick={handleGoHome} size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Card {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="font-semibold text-primary">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Card className="shadow-lg min-h-96">
              <CardHeader>
                <CardTitle className="text-xl leading-relaxed text-center mb-6">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <div className="py-8 space-y-6">
                  <div className="text-sm text-muted-foreground">
                    Correct Answer:
                  </div>
                  <div className="bg-green-500/10 border-2 border-green-500 rounded-lg p-8">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {currentQuestion.options[currentQuestion.correctAnswer]}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4">
                  {currentQuestionIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentQuestionIndex(prev => prev - 1);
                      }}
                      size="sm"
                    >
                      Previous
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleNextFlashcard} className="min-w-32">
                    {currentQuestionIndex < questions.length - 1 ? 'Next Card' : 'Finish'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }

    // Practice / Test mode
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">
                {studyMode === 'practice' ? 'Practice Mode' : 'Test Mode'}
              </h1>
              <div className="flex items-center space-x-3">
                <p className="text-sm text-muted-foreground">{fileName}</p>
                {duplicatesRemoved > 0 && (
                  <span className="text-xs bg-yellow-500/10 text-yellow-700 border border-yellow-500/20 px-2 py-1 rounded">
                    {duplicatesRemoved} duplicate(s) removed
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {duplicatesRemoved > 0 && (
                <Button variant="outline" onClick={handleExportQuestions} size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleGoHome}
                size="sm"
              >
                <X className="w-4 h-4 mr-2" />
                Exit Quiz
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary">
                  {Math.round(progress)}% complete
                </span>

                {studyMode === 'test' && timeLeft !== null && (
                  <span className="font-mono text-sm">
                    ⏱ {formatTime(timeLeft)}
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      } ${
                        showFeedback
                          ? key === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-500/10'
                            : selectedAnswer === key
                            ? 'border-red-500 bg-red-500/10'
                            : 'opacity-50'
                          : ''
                      }`}
                    >
                      <RadioGroupItem value={key} id={key} className="mt-1" />
                      <Label htmlFor={key} className="flex-1 cursor-pointer font-normal text-base leading-relaxed">
                        <span className="font-semibold text-foreground">{key}.</span>{' '}
                        <span className="text-foreground">{value}</span>
                      </Label>
                      {showFeedback && key === currentQuestion.correctAnswer && (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      )}
                      {showFeedback && selectedAnswer === key && key !== currentQuestion.correctAnswer && (
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {showFeedback && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-red-500/10 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <p className="font-semibold text-foreground">
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </p>
                    </div>
                    {!isCorrect && (
                      <Button 
                        onClick={handleGotIt}
                        size="sm"
                        variant={isCorrect ? "default" : "outline"}
                      >
                        Got it!
                      </Button>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="mt-3 text-sm text-foreground">
                      The correct answer is: <span className="font-semibold">{currentQuestion.correctAnswer}. {currentQuestion.options[currentQuestion.correctAnswer]}</span>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-4">
                {studyMode === 'practice' && (
                  <div className="text-sm text-muted-foreground">
                    {userAnswers.filter(a => a.isCorrect).length} correct answers
                  </div>
                )}
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentQuestionIndex(prev => prev - 1);
                      const prevQuestion = questions[currentQuestionIndex - 1];
                      const savedAnswer = userAnswers.find(a => a.questionId === prevQuestion.id);
                      setSelectedAnswer(savedAnswer?.selectedAnswer || '');
                      setShowFeedback(false);
                    }}
                    size="sm"
                  >
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                {studyMode === 'test' ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    className="min-w-32"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Test'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer || showFeedback}
                    className="min-w-32"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const { correct, total, percentage } = calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Final Results</CardTitle>
              <CardDescription className="text-lg">
                You completed the quiz!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
                <div className="text-6xl font-bold text-primary">
                  {percentage}%
                </div>
                <p className="text-xl text-foreground">
                  {correct} of {total} questions correct
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-muted-foreground">{correct} correct</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-muted-foreground">{total - correct} incorrect</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Question Review</h3>
                {questions.map((question, index) => {
                  const userAnswer = userAnswers.find(a => a.questionId === question.id);
                  return (
                    <Card key={question.id} className={`border-2 ${userAnswer?.isCorrect ? 'border-green-500/30' : 'border-red-500/30'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base font-semibold text-foreground flex-1">
                            {index + 1}. {question.question}
                          </CardTitle>
                          {userAnswer?.isCorrect ? (
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                          ) : (
                            <X className="w-5 h-5 text-red-600 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <span className="text-muted-foreground font-semibold min-w-24">Your answer:</span>
                          <span className={userAnswer?.isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {userAnswer?.selectedAnswer}. {question.options[userAnswer?.selectedAnswer || 'A']}
                          </span>
                        </div>
                        {!userAnswer?.isCorrect && (
                          <div className="flex items-start space-x-2">
                            <span className="text-muted-foreground font-semibold min-w-24">Correct answer:</span>
                            <span className="text-green-600 font-semibold">
                              {question.correctAnswer}. {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              {studyMode === 'test' ? (
                <>
                  <Button onClick={handleGoHome} variant="outline" size="lg">
                    <Brain className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <Button onClick={handleRestart} variant="outline" size="lg">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Test
                  </Button>
                  <Button onClick={handleTakeNewTest} size="lg">
                    <Trophy className="w-4 h-4 mr-2" />
                    Take a New Test
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={handleGoHome} variant="outline" size="lg">
                    <Brain className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                  <Button onClick={handleRestart} variant="outline" size="lg">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
