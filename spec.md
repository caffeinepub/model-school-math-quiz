# Model School Math Quiz

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Math quiz app for model school students (middle/high school level)
- Multiple difficulty levels: Easy (arithmetic), Medium (fractions, decimals), Hard (algebra, word problems)
- Quiz flow: select difficulty -> answer 10 questions -> see score
- Instant feedback after each answer (correct/incorrect)
- Score tracking: save high scores with player name
- Leaderboard showing top scores per difficulty
- Questions generated dynamically (random numbers within appropriate ranges)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store player scores (name, score, difficulty, timestamp); query leaderboard per difficulty
2. Frontend: Home screen with difficulty selector, Quiz screen with question + answer input, Results screen with score + leaderboard
3. Questions generated client-side for variety; scores saved to backend
