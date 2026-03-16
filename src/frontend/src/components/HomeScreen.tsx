import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Star, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Difficulty } from "../backend";

interface Props {
  onStart: (playerName: string, difficulty: Difficulty) => void;
}

const difficultyInfo = {
  [Difficulty.Easy]: {
    label: "Easy",
    desc: "Addition & Subtraction",
    icon: Star,
    color: "border-success bg-success/10 text-success",
    selectedColor: "border-success bg-success/20",
  },
  [Difficulty.Medium]: {
    label: "Medium",
    desc: "Multiplication, Division & Fractions",
    icon: Zap,
    color: "border-secondary bg-secondary/10 text-secondary-foreground",
    selectedColor: "border-secondary bg-secondary/30",
  },
  [Difficulty.Hard]: {
    label: "Hard",
    desc: "Algebra & Percentages",
    icon: Trophy,
    color: "border-primary bg-primary/10 text-primary",
    selectedColor: "border-primary bg-primary/20",
  },
};

export default function HomeScreen({ onStart }: Props) {
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);

  const handleStart = () => {
    if (playerName.trim()) {
      onStart(playerName.trim(), difficulty);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/math-hero.dim_1200x400.jpg"
          alt="Model School Math Quiz"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 justify-center mb-2">
              <BookOpen className="w-7 h-7 text-secondary" />
              <span className="text-secondary font-display font-semibold text-lg tracking-wide uppercase">
                Model School
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white drop-shadow-lg">
              Math<span className="text-secondary"> Quiz</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Main card */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-card border border-border p-8"
        >
          <div className="mb-6">
            <Label
              htmlFor="player-name"
              className="text-base font-semibold text-foreground mb-2 block"
            >
              Your Name
            </Label>
            <Input
              id="player-name"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              className="text-base h-11"
              data-ocid="home.player_name.input"
            />
          </div>

          <div className="mb-8">
            <Label className="text-base font-semibold text-foreground mb-3 block">
              Select Difficulty
            </Label>
            <div
              className="grid grid-cols-1 gap-3"
              data-ocid="home.difficulty.select"
            >
              {(Object.values(Difficulty) as Difficulty[]).map((diff) => {
                const info = difficultyInfo[diff];
                const Icon = info.icon;
                const isSelected = difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? `${info.selectedColor} shadow-xs`
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? info.color
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {info.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {info.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!playerName.trim()}
            className="w-full h-12 text-base font-bold font-display bg-primary hover:bg-primary/90 text-primary-foreground"
            data-ocid="home.start_quiz.primary_button"
          >
            Start Quiz →
          </Button>
          {!playerName.trim() && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Enter your name to begin
            </p>
          )}
        </motion.div>
      </main>

      <footer className="text-center text-xs text-muted-foreground pb-6">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Built with ♥ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
