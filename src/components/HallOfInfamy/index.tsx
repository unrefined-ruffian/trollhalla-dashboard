'use client'
import { Crown, Calculator, Zap, Skull } from 'lucide-react';
import { useState, useEffect } from 'react';

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
    };
  };
  awayScore: {
    score: {
      value: number;
    };
  };
}

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

interface HallOfInfamyProps {
  data: {
    games: Game[];
  };
}

export default function HallOfInfamy({ data }: HallOfInfamyProps) {
  const [matchupData, setMatchupData] = useState<MatchupData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processScoreboard() {
      try {
        console.log('Processing scoreboard:', data);

        if (!data?.games) {
          console.log('No games found in scoreboard');
          setError('No games data available');
          return;
        }

        const games = data.games;
        console.log('Games found:', games.length);
      
      // Create array of all teams and their scores this week
      const weeklyScores: TeamScore[] = [];
      games.forEach(game => {
        if (game.homeScore?.score?.value !== undefined) {
          weeklyScores.push({
            team: game.home.name,
            score: game.homeScore.score.value,
            record: `${game.home.recordOverall.wins}-${game.home.recordOverall.losses}`
          });
        }
        if (game.awayScore?.score?.value !== undefined) {
          weeklyScores.push({
            team: game.away.name,
            score: game.awayScore.score.value,
            record: `${game.away.recordOverall.wins}-${game.away.recordOverall.losses}`
          });
        }
      });

      // Rest of the processing logic remains the same
      // Find highest score
      const highScore = weeklyScores.reduce((prev, current) => 
        (current.score > prev.score) ? current : prev
      );

      // Find closest game
      let closestGame = {
        winner: weeklyScores[0],
        loser: weeklyScores[1],
        margin: 999999
      };

      games.forEach(game => {
        if (game.homeScore?.score?.value !== undefined && game.awayScore?.score?.value !== undefined) {
          const margin = Math.abs(game.homeScore.score.value - game.awayScore.score.value);
          if (margin < closestGame.margin) {
            closestGame = {
              winner: game.homeScore.score.value > game.awayScore.score.value 
                ? { team: game.home.name, score: game.homeScore.score.value }
                : { team: game.away.name, score: game.awayScore.score.value },
              loser: game.homeScore.score.value > game.awayScore.score.value
                ? { team: game.away.name, score: game.awayScore.score.value }
                : { team: game.home.name, score: game.homeScore.score.value },
              margin
            };
          }
        }
      });

      // Find biggest upset
      let biggestUpset = {
        winner: weeklyScores[0],
        loser: weeklyScores[1]
      };
      games.forEach(game => {
        if (game.homeScore?.score?.value !== undefined && game.awayScore?.score?.value !== undefined) {
          const homeWinPct = game.home.recordOverall.wins / (game.home.recordOverall.wins + game.home.recordOverall.losses);
          const awayWinPct = game.away.recordOverall.wins / (game.away.recordOverall.wins + game.away.recordOverall.losses);
          
          if ((game.homeScore.score.value > game.awayScore.score.value && homeWinPct < awayWinPct) ||
              (game.awayScore.score.value > game.homeScore.score.value && awayWinPct < homeWinPct)) {
            biggestUpset = {
              winner: game.homeScore.score.value > game.awayScore.score.value
                ? { 
                    team: game.home.name, 
                    score: game.homeScore.score.value,
                    record: `${game.home.recordOverall.wins}-${game.home.recordOverall.losses}`
                  }
                : { 
                    team: game.away.name, 
                    score: game.awayScore.score.value,
                    record: `${game.away.recordOverall.wins}-${game.away.recordOverall.losses}`
                  },
              loser: game.homeScore.score.value > game.awayScore.score.value
                ? { 
                    team: game.away.name, 
                    score: game.awayScore.score.value,
                    record: `${game.away.recordOverall.wins}-${game.away.recordOverall.losses}`
                  }
                : { 
                    team: game.home.name, 
                    score: game.homeScore.score.value,
                    record: `${game.home.recordOverall.wins}-${game.home.recordOverall.losses}`
                  }
            };
          }
        }
      });

      // Find lowest score
      const lowestScore = weeklyScores.reduce((prev, current) => 
        (current.score < prev.score) ? current : prev
      );

      setMatchupData({
        highScore,
        closestGame,
        biggestUpset,
        lowestScore
      });

    } catch (error) {
      console.error('Error in processScoreboard:', error);
      setError('Failed to process scoreboard data');
    }
  }

  processScoreboard();
}, [data]);

  if (!matchupData) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">THE HALL OF INFAMY AND GLORY</h2>
        <p className="text-gray-400">Calculating the damage...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">THE HALL OF INFAMY AND GLORY</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Rest of the JSX remains the same */}
        {/* The High Roller */}
        <div className="bg-gray-700 p-4 rounded-lg col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h3 className="text-base font-bold text-yellow-500">THE HIGH ROLLER</h3>
          </div>
          <p className="text-xl font-bold text-gray-100">{matchupData.highScore.team}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-400">{matchupData.highScore.score.toFixed(1)} points</span>
            <span className="text-sm text-gray-500 italic">"When the going gets weird..."</span>
          </div>
        </div>

        {/* The Vegas Line */}
        <div className="bg-gray-700 p-4 rounded-lg col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-blue-400">THE VEGAS LINE</h3>
          </div>
          <p className="text-xl font-bold text-gray-100">{matchupData.closestGame.winner.team} vs {matchupData.closestGame.loser.team}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-400">
              {matchupData.closestGame.winner.score.toFixed(1)} - {matchupData.closestGame.loser.score.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 italic">{matchupData.closestGame.margin.toFixed(1)} point margin</span>
          </div>
        </div>

        {/* Revolt of the Underdogs */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-500" />
            <h3 className="text-base font-bold text-green-500">REVOLT OF THE UNDERDOGS</h3>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-100 font-bold">
              {matchupData.biggestUpset.winner.team} ({matchupData.biggestUpset.winner.record})
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-400">over {matchupData.biggestUpset.loser.team} ({matchupData.biggestUpset.loser.record})</span>
              <span className="text-sm text-gray-500 italic">chaos reigns</span>
            </div>
          </div>
        </div>

        {/* Bottom of the Barrel */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Skull className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-red-500">BOTTOM OF THE BARREL</h3>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-100 font-bold">{matchupData.lowestScore.team}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-400">{matchupData.lowestScore.score.toFixed(1)} points</span>
              <span className="text-sm text-gray-500 italic">pure ether</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}