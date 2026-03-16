import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuizResult {
    difficulty: Difficulty;
    score: bigint;
    timestamp: Time;
    playerName: string;
}
export type Time = bigint;
export enum Difficulty {
    Easy = "Easy",
    Hard = "Hard",
    Medium = "Medium"
}
export interface backendInterface {
    getLeaderboard(difficulty: Difficulty): Promise<Array<QuizResult>>;
    submitScore(playerName: string, score: bigint, difficulty: Difficulty): Promise<void>;
}
