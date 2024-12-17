'use client'
import React, { useState, useEffect } from 'react';

interface Game {
  home: {
    name: string;
  };
  away: {
    name: string;
  };
  homeScore: {
    score: {
      formatted: string;
    };
    yetToPlay: number;
  };
  awayScore: {
    score: {
      formatted: string;
    };
    yetToPlay: number;
  };
  isInProgress: boolean;
}

interface Matchup {
  winner: string;
  winnerScore: number;
  loser: string;
  loserScore: number;
  comment: string;
  inProgress: boolean;
  yetToPlay: {
    winner: number;
    loser: number;
  };
}

interface WeeksCasualtiesProps {
  data: {
    games: Game[];
  };
}

async function generateAICommentary(matchData: {
  winner: string;
  loser: string;
  winnerScore: number;
  loserScore: number;
  inProgress: boolean;
  yetToPlay: {
    winner: number;
    loser: number;
  };
}) {
  try {
    const response = await fetch('/api/generate-commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData),
    });
    
    const data = await response.json();
    return data.commentary || 'The chaos continues...';
  } catch (error) {
    console.error('Error fetching AI commentary:', error);
    return `${matchData.winner} ${matchData.inProgress ? 'leads' : 'defeated'} ${matchData.loser} in a game that defies description.`;
  }
}

export default function WeeksCasualties({ data }: WeeksCasualtiesProps) {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function processScores() {
      if (data?.games) {
        const formattedMatchups = await Promise.all(data.games
          .filter((game) => 
            game.homeScore?.score?.formatted !== undefined && 
            game.awayScore?.score?.formatted !== undefined
          )
          .map(async (game) => {
            const homeScore = parseFloat(game.homeScore.score.formatted);
            const awayScore = parseFloat(game.awayScore.score.formatted);
            const isHomeWinner = homeScore > awayScore;
            
            const homeTeam = game.home.name;
            const awayTeam = game.away.name;
            const yetToPlay = {
              winner: isHomeWinner ? game.homeScore.yetToPlay : game.awayScore.yetToPlay,
              loser: isHomeWinner ? game.awayScore.yetToPlay : game.homeScore.yetToPlay
            };

            const matchData = {
              winner: isHomeWinner ? homeTeam : awayTeam,
              winnerScore: isHomeWinner ? homeScore : awayScore,
              loser: isHomeWinner ? awayTeam : homeTeam,
              loserScore: isHomeWinner ? awayScore : homeScore,
              inProgress: game.isInProgress,
              yetToPlay
            };

            const comment = await generateAICommentary(matchData);

            return {
              ...matchData,
              comment
            };
          }));
        setMatchups(formattedMatchups);
      }
      setLoading(false);
    }

    processScores();
  }, [data]);

  if (loading) {
    return (
      <div className="bg-slate-900 p-8">
        <h2 className="text-2xl font-bold text-purple-400 mb-6">THE WEEK&apos;S CASUALTIES</h2>
        <p className="text-gray-400">Loading the carnage report...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">THE WEEK&apos;S CASUALTIES</h2>
      
      <div className="space-y-4">
        {matchups.map((match, index) => (
          <div key={index} className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <div className="text-xl">
                <span className="text-emerald-400 font-semibold">
                  {match.winner}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-gray-100">
                  {match.winnerScore.toFixed(1)}
                </span>
                {match.inProgress && match.yetToPlay.winner > 0 && (
                  <span className="text-yellow-400 text-sm">
                    ({match.yetToPlay.winner} to play)
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl">
                <span className="text-red-400">
                  {match.loser}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-mono text-gray-100">
                  {match.loserScore.toFixed(1)}
                </span>
                {match.inProgress && match.yetToPlay.loser > 0 && (
                  <span className="text-yellow-400 text-sm">
                    ({match.yetToPlay.loser} to play)
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-400 italic text-sm">
              {match.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}