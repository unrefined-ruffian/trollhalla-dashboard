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

function generateMatchupCommentary(
  winner: string,
  loser: string,
  winnerScore: number,
  loserScore: number,
  inProgress: boolean
): string {
  const scoreDiff = Math.abs(winnerScore - loserScore);
  
  // In progress games
  if (inProgress) {
    if (scoreDiff > 50) {
      return `${winner} is treating ${loser} like a bat treats the windshield of a fast-moving vehicle. Pure, unhinged destruction.`;
    } else if (scoreDiff > 30) {
      return `${winner} holds a lead that would make a Vegas bookie nervous, while ${loser} searches for answers in all the wrong places.`;
    } else if (scoreDiff > 15) {
      return `${winner} maintains a decent lead, but ${loser} still has a few tricks left in their medicine bag.`;
    } else {
      return `${winner} and ${loser} are locked in the kind of struggle that makes you question the fabric of reality itself.`;
    }
  }

  // Completed games
  if (scoreDiff > 50) {
    return `${winner} laid waste to ${loser} with the kind of ruthless efficiency that would make a carpet bomber proud. A pure show of force that will echo through the halls of infamy.`;
  }
  if (scoreDiff > 40) {
    return `${winner} treated ${loser} like a motorcycle gang treats a small-town bar. Complete and utter domination with a side of existential crisis.`;
  }
  if (scoreDiff > 30) {
    return `${winner} dismantled ${loser} with surgical precision, if the surgeon was hopped up on ether and armed with a chainsaw.`;
  }
  if (scoreDiff > 20) {
    return `${winner} emerged victorious in a contest that made ${loser} question their life choices and fantasy football acumen.`;
  }
  if (scoreDiff > 10) {
    return `${winner} stumbled into a win against ${loser} like a drunk finding their car keys in a dark parking lot - not pretty, but effective.`;
  }
  return `${winner} barely escaped with a win over ${loser} in the kind of nail-biter that sends commissioners reaching for the hard stuff.`;
}

export default function WeeksCasualties({ data }: WeeksCasualtiesProps) {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    function processScores() {
      if (data?.games) {
        const formattedMatchups = data.games
          .filter((game) => 
            game.homeScore?.score?.formatted !== undefined && 
            game.awayScore?.score?.formatted !== undefined
          )
          .map((game) => {
            const homeScore = parseFloat(game.homeScore.score.formatted);
            const awayScore = parseFloat(game.awayScore.score.formatted);
            const isHomeWinner = homeScore > awayScore;
            
            const homeTeam = game.home.name;
            const awayTeam = game.away.name;
            const yetToPlay = {
              winner: isHomeWinner ? game.homeScore.yetToPlay : game.awayScore.yetToPlay,
              loser: isHomeWinner ? game.awayScore.yetToPlay : game.homeScore.yetToPlay
            };

            return {
              winner: isHomeWinner ? homeTeam : awayTeam,
              winnerScore: isHomeWinner ? homeScore : awayScore,
              loser: isHomeWinner ? awayTeam : homeTeam,
              loserScore: isHomeWinner ? awayScore : homeScore,
              comment: generateMatchupCommentary(
                isHomeWinner ? homeTeam : awayTeam,
                isHomeWinner ? awayTeam : homeTeam,
                isHomeWinner ? homeScore : awayScore,
                isHomeWinner ? awayScore : homeScore,
                game.isInProgress
              ),
              inProgress: game.isInProgress,
              yetToPlay
            };
          });
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