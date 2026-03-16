import { Difficulty } from "../backend";

export interface Question {
  text: string;
  answer: number;
  displayAnswer: string;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEasy(): Question {
  const type = rand(0, 1);
  if (type === 0) {
    const a = rand(1, 50);
    const b = rand(1, 50);
    return {
      text: `${a} + ${b} = ?`,
      answer: a + b,
      displayAnswer: `${a + b}`,
    };
  }
  const a = rand(10, 50);
  const b = rand(1, a);
  return {
    text: `${a} − ${b} = ?`,
    answer: a - b,
    displayAnswer: `${a - b}`,
  };
}

function generateMedium(): Question {
  const type = rand(0, 2);
  if (type === 0) {
    const a = rand(2, 12);
    const b = rand(2, 12);
    return {
      text: `${a} × ${b} = ?`,
      answer: a * b,
      displayAnswer: `${a * b}`,
    };
  }
  if (type === 1) {
    const b = rand(2, 12);
    const result = rand(2, 12);
    const a = b * result;
    return {
      text: `${a} ÷ ${b} = ?`,
      answer: result,
      displayAnswer: `${result}`,
    };
  }
  const fractions: Array<[number, number]> = [
    [1, 2],
    [1, 4],
    [3, 4],
    [1, 3],
    [2, 3],
    [1, 5],
    [2, 5],
    [3, 5],
  ];
  const [p, q] = fractions[rand(0, fractions.length - 1)];
  const multiplier = rand(2, 10);
  const n = q * multiplier;
  const answer = (p * n) / q;
  return {
    text: `What is ${p}/${q} of ${n}?`,
    answer,
    displayAnswer: `${answer}`,
  };
}

function generateHard(): Question {
  const type = rand(0, 1);
  if (type === 0) {
    const a = rand(2, 8);
    const x = rand(1, 12);
    const b = rand(1, 20);
    const c = a * x + b;
    return {
      text: `Solve: ${a}x + ${b} = ${c}`,
      answer: x,
      displayAnswer: `x = ${x}`,
    };
  }
  const percents = [10, 20, 25, 50, 75, 5, 15, 30, 40];
  const pct = percents[rand(0, percents.length - 1)];
  const base = rand(2, 20) * 10;
  const answer = (pct * base) / 100;
  return {
    text: `What is ${pct}% of ${base}?`,
    answer,
    displayAnswer: `${answer}`,
  };
}

export function generateQuestions(
  difficulty: Difficulty,
  count = 10,
): Question[] {
  const gen =
    difficulty === Difficulty.Easy
      ? generateEasy
      : difficulty === Difficulty.Medium
        ? generateMedium
        : generateHard;

  return Array.from({ length: count }, () => gen());
}

export function checkAnswer(userAnswer: string, question: Question): boolean {
  const trimmed = userAnswer.trim().toLowerCase();
  const num = Number.parseFloat(trimmed.replace(/x\s*=\s*/, ""));
  return !Number.isNaN(num) && Math.abs(num - question.answer) < 0.001;
}
