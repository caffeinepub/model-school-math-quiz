import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Difficulty } from "../backend";
import { useActor } from "./useActor";

export function useLeaderboard(difficulty: Difficulty, enabled = true) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard", difficulty],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(difficulty);
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerName,
      score,
      difficulty,
    }: {
      playerName: string;
      score: number;
      difficulty: Difficulty;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.submitScore(playerName, BigInt(score), difficulty);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["leaderboard", vars.difficulty],
      });
    },
  });
}
