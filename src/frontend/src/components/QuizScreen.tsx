import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Difficulty } from "../backend";
import { type Question, checkAnswer } from "../lib/quiz";

interface Props {
  questions: Question[];
  difficulty: Difficulty;
  playerName: string;
  onComplete: (score: number) => void;
}

const difficultyLabel: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Easy",
  [Difficulty.Medium]: "Medium",
  [Difficulty.Hard]: "Hard",
};

const difficultyColor: Record<Difficulty, string> = {
  [Difficulty.Easy]: "text-success",
  [Difficulty.Medium]: "text-secondary-foreground",
  [Difficulty.Hard]: "text-primary-foreground",
};

export default function QuizScreen({
  questions,
  difficulty,
  playerName,
  onComplete,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = questions[currentIndex];
  const progress =
    ((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100;

  useEffect(() => {
    if (!submitted) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleSubmit = () => {
    if (!userAnswer.trim() || submitted) return;
    const correct = checkAnswer(userAnswer, currentQuestion);
    const newScore = correct ? score + 1 : score;
    setScore(newScore);
    setFeedback(correct ? "correct" : "incorrect");
    setSubmitted(true);

    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        onComplete(newScore);
      } else {
        setCurrentIndex(nextIndex);
        setUserAnswer("");
        setFeedback(null);
        setSubmitted(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm">Playing as</p>
            <p className="font-bold font-display text-base">{playerName}</p>
          </div>
          <div className="text-center">
            <span
              className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-primary-foreground/10 ${difficultyColor[difficulty]}`}
            >
              {difficultyLabel[difficulty]}
            </span>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/70 text-sm">Score</p>
            <p className="font-bold font-display text-xl">
              {score}
              <span className="text-primary-foreground/50 text-sm">
                /{questions.length}
              </span>
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-3">
          <Progress
            value={progress}
            className="h-2 bg-primary-foreground/20"
            data-ocid="quiz.progress.panel"
          />
          <p className="text-xs text-primary-foreground/60 mt-1">
            Question {Math.min(currentIndex + 1, questions.length)} of{" "}
            {questions.length}
          </p>
        </div>
      </header>

      {/* Quiz card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.28 }}
              className="quiz-bg bg-card rounded-2xl shadow-card border border-border overflow-hidden"
            >
              {/* Question number badge */}
              <div className="bg-primary/5 px-8 py-5 border-b border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-primary-foreground text-lg">
                    {currentIndex + 1}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Question
                  </p>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-tight">
                    {currentQuestion.text}
                  </p>
                </div>
              </div>

              <div className="p-8">
                {!submitted ? (
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="quiz-answer"
                        className="text-sm font-semibold text-muted-foreground mb-2 block"
                      >
                        Your Answer
                      </Label>
                      <Input
                        id="quiz-answer"
                        ref={inputRef}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder={
                          difficulty === Difficulty.Hard
                            ? "e.g. 5 or x = 5"
                            : "Enter number..."
                        }
                        className="text-xl h-14 font-display font-semibold text-center"
                        data-ocid="quiz.answer.input"
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      className="w-full h-12 text-base font-bold font-display bg-primary hover:bg-primary/90"
                      data-ocid="quiz.submit.primary_button"
                    >
                      Submit Answer <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-xl p-5 flex items-center gap-4 ${
                        feedback === "correct"
                          ? "answer-correct"
                          : "answer-incorrect"
                      }`}
                      data-ocid="quiz.feedback.panel"
                    >
                      {feedback === "correct" ? (
                        <CheckCircle2 className="w-8 h-8 flex-shrink-0 text-success" />
                      ) : (
                        <XCircle className="w-8 h-8 flex-shrink-0 text-destructive" />
                      )}
                      <div>
                        <p className="font-bold font-display text-lg">
                          {feedback === "correct"
                            ? "Correct! 🎉"
                            : "Not quite..."}
                        </p>
                        {feedback === "incorrect" && (
                          <p className="text-sm mt-0.5">
                            The answer is{" "}
                            <strong>{currentQuestion.displayAnswer}</strong>
                          </p>
                        )}
                        <p className="text-xs mt-1 opacity-70">
                          Moving to next question...
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
