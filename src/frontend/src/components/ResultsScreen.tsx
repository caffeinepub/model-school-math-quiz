import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Medal, RotateCcw, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Difficulty } from "../backend";
import { useLeaderboard, useSubmitScore } from "../hooks/useQueries";

interface Props {
  score: number;
  totalQuestions: number;
  playerName: string;
  difficulty: Difficulty;
  onPlayAgain: () => void;
}

const difficultyLabel: Record<Difficulty, string> = {
  [Difficulty.Easy]: "Easy",
  [Difficulty.Medium]: "Medium",
  [Difficulty.Hard]: "Hard",
};

function getMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "Perfect score! You're a math champion! 🏆";
  if (pct >= 0.8) return "Excellent work! Almost there! ⭐";
  if (pct >= 0.6) return "Good effort! Keep practicing! 💪";
  if (pct >= 0.4) return "Not bad! Review and try again! 📚";
  return "Keep practicing — you'll get it! 🌱";
}

const medalColors = ["text-yellow-500", "text-slate-400", "text-amber-700"];

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ResultsScreen({
  score,
  totalQuestions,
  playerName,
  difficulty,
  onPlayAgain,
}: Props) {
  const { mutate: submitScore } = useSubmitScore();
  const { data: leaderboard, isLoading, isError } = useLeaderboard(difficulty);
  const submitted = useRef(false);

  useEffect(() => {
    if (!submitted.current) {
      submitted.current = true;
      submitScore({ playerName, score, difficulty });
    }
  }, [difficulty, playerName, score, submitScore]);

  const pct = Math.round((score / totalQuestions) * 100);
  const scoreColor =
    pct === 100
      ? "text-success"
      : pct >= 70
        ? "text-secondary-foreground"
        : pct >= 40
          ? "text-primary"
          : "text-destructive";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground px-4 py-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-secondary" />
          <span className="font-display font-semibold text-lg">
            Quiz Complete!
          </span>
        </div>
        <p className="text-primary-foreground/70 text-sm">
          {difficultyLabel[difficulty]} · {playerName}
        </p>
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full space-y-6">
        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl shadow-card border border-border p-8 text-center"
          data-ocid="results.score.panel"
        >
          <div className={`font-display text-7xl font-bold ${scoreColor}`}>
            {score}
            <span className="text-muted-foreground text-3xl">
              /{totalQuestions}
            </span>
          </div>
          <p className="text-lg font-semibold mt-2 text-muted-foreground">
            {pct}% correct
          </p>
          <p className="mt-3 text-foreground font-medium">
            {getMessage(score, totalQuestions)}
          </p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <Medal className="w-5 h-5 text-secondary" />
            <h2 className="font-display font-bold text-lg">
              Top 10 — {difficultyLabel[difficulty]}
            </h2>
          </div>

          {isLoading && (
            <div
              className="p-6 space-y-3"
              data-ocid="leaderboard.loading_state"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="w-12 h-4" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div
              className="p-6 flex items-center gap-3 text-destructive"
              data-ocid="leaderboard.error_state"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">
                Could not load leaderboard. Try again later.
              </p>
            </div>
          )}

          {!isLoading &&
            !isError &&
            leaderboard &&
            leaderboard.length === 0 && (
              <div
                className="p-8 text-center"
                data-ocid="leaderboard.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No scores yet. Be the first!
                </p>
              </div>
            )}

          {!isLoading && !isError && leaderboard && leaderboard.length > 0 && (
            <div data-ocid="results.leaderboard.table">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard
                    .slice()
                    .sort((a, b) => Number(b.score) - Number(a.score))
                    .slice(0, 10)
                    .map((entry, i) => (
                      <TableRow
                        key={`${entry.playerName}-${String(entry.score)}-${i}`}
                        className={`${
                          entry.playerName === playerName
                            ? "bg-secondary/10"
                            : ""
                        }`}
                      >
                        <TableCell className="text-center font-bold">
                          {i < 3 ? (
                            <Medal
                              className={`w-4 h-4 inline ${medalColors[i]}`}
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {i + 1}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {entry.playerName}
                          {entry.playerName === playerName && (
                            <span className="ml-1.5 text-xs text-secondary-foreground bg-secondary/20 px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-bold font-display">
                          {String(entry.score)}/{totalQuestions}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                          {formatTimestamp(entry.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        <Button
          onClick={onPlayAgain}
          className="w-full h-12 text-base font-bold font-display bg-primary hover:bg-primary/90"
          data-ocid="results.play_again.primary_button"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Play Again
        </Button>
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
