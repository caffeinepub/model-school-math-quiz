import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Difficulty } from "./backend";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import { type Question, generateQuestions } from "./lib/quiz";

const queryClient = new QueryClient();

type Screen = "home" | "quiz" | "results";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [finalScore, setFinalScore] = useState(0);

  const handleStart = (name: string, diff: Difficulty) => {
    setPlayerName(name);
    setDifficulty(diff);
    setQuestions(generateQuestions(diff, 10));
    setScreen("quiz");
  };

  const handleComplete = (score: number) => {
    setFinalScore(score);
    setScreen("results");
  };

  const handlePlayAgain = () => {
    setScreen("home");
    setFinalScore(0);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {screen === "home" && <HomeScreen onStart={handleStart} />}
      {screen === "quiz" && (
        <QuizScreen
          questions={questions}
          difficulty={difficulty}
          playerName={playerName}
          onComplete={handleComplete}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          score={finalScore}
          totalQuestions={10}
          playerName={playerName}
          difficulty={difficulty}
          onPlayAgain={handlePlayAgain}
        />
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
