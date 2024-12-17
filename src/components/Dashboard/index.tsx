'use client'
import { useFleaflicker } from '@/hooks/useFleaflicker';
import WeeksCasualties from '@/components/WeeksCasualties';
import HallOfInfamy from '@/components/HallOfInfamy';
import PowerIndex from '@/components/PowerIndex';

// Interface for Game (consolidated duplicate definitions)
interface Game {
  home: {
    name: string;
    recordOverall: {
      wins: number;
      losses: number;
    };
  };
  away: {
    name: string;
    recordOverall: {
      wins: number;
      losses: number;
    };
  };
  homeScore: {
    score: {
      value: number;
      formatted: string;
    };
    yetToPlay: number;
  };
  awayScore: {
    score: {
      value: number;
      formatted: string;
    };
    yetToPlay: number;
  };
  isInProgress: boolean;
}

interface ScoreboardData {
  games: Game[];
}

// Interfaces for PowerIndex
interface TeamScore {
  team: string;
  score: number;
  record?: string;
}

interface MatchupData {
  highScore: TeamScore;
  closestGame: {
    winner: TeamScore;
    loser: TeamScore;
    margin: number;
  };
  biggestUpset: {
    winner: TeamScore;
    loser: TeamScore;
  };
  lowestScore: TeamScore;
}

interface PowerIndexData {
  matchupData: MatchupData;
}

export default function GonzoDashboard() {
  const { data: scoreboardData, loading: scoreboardLoading, error: scoreboardError } = 
    useFleaflicker('scoreboard') as { data: ScoreboardData | null, loading: boolean, error: Error | null };

  // Remove 'data' since we're not using it from standings
  const { loading: powerLoading, error: powerError } = 
    useFleaflicker('standings') as { data: PowerIndexData | null, loading: boolean, error: Error | null };

  // Rest of the code stays the same

  if (scoreboardLoading || powerLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-purple-400">
          The cosmic gears of this digital circus are still turning...
        </h1>
      </div>
    );
  }

  if (scoreboardError || powerError) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-400">
          The bats have interfered with our transmission... Dear God, what have we done?
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="border-b border-purple-500 pb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Fear & Loathing in Fantasy Football
          </h1>
          <p className="text-lg italic text-purple-300 mb-8 border-b border-purple-700 pb-4">
            &quot;We were somewhere around the playoff bubble, on the edge of vicotry, when the drugs began to take hold...&quot;
          </p>
        </header>

        {scoreboardData && <WeeksCasualties data={scoreboardData} />}
        {scoreboardData && <HallOfInfamy data={scoreboardData} />}
        <PowerIndex />
      </div>
    </div>
  );
}