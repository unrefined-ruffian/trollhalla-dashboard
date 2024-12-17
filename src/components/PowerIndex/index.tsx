'use client'
import { Radar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFleaflicker } from '../../hooks/useFleaflicker';

const POWER_RANK_CONTENT = {
  1: {
    status: "THE KING IN THE HIGH CASTLE",
    tagLine: "Sitting on a throne made of your broken dreams, they rule with absolute arrogance.",
    commentary: "Top of the heap, undisputed champion (for now). Everyone hates them, but they're too busy basking in glory to notice."
  },
  2: {
    status: "THE HEIR APPARENT",
    tagLine: "One misstep away from the throne, yet close enough to taste it.",
    commentary: "Second place is just first loser, but don't tell them that. Their time might come, if the stars align."
  },
  3: {
    status: "THE APEX PREDATOR",
    tagLine: "Lurking in the shadows, waiting for their moment to strike.",
    commentary: "Not quite royalty, but dangerous enough to make the nobility nervous. A few lucky breaks could change everything."
  },
  4: {
    status: "THE CONTENDER",
    tagLine: "Too good to ignore, too inconsistent to trust.",
    commentary: "They've got the tools to make a run, but something always seems to go wrong at the worst possible moment."
  },
  5: {
    status: "THE WILD CARD",
    tagLine: "Chaos incarnate, capable of brilliance or disaster.",
    commentary: "Nobody knows what to expect from them, least of all themselves."
  },
  6: {
    status: "THE GATEKEEPER",
    tagLine: "Standing at the threshold between glory and mediocrity.",
    commentary: "The last line of defense before the playoff bubble. Cross them at your own risk."
  },
  7: {
    status: "THE BUBBLE DWELLER",
    tagLine: "Living life on the edge of relevance.",
    commentary: "Every week is do-or-die. One false move and it's all over but the crying."
  },
  8: {
    status: "THE HOT MESS EXPRESS",
    tagLine: "Terrible draft, missed waiver deadlines, and starting players on bye week. All aboard!",
    commentary: "They're a walking disaster, but somehow still hanging on. Chaos is their co-pilot, and we're all here for the ride."
  },
  9: {
    status: "THE COLLAPSING STAR",
    tagLine: "How the mighty have tumbled into mediocrity.",
    commentary: "The playoffs are becoming a distant memory. Time to start planning for next year."
  },
  10: {
    status: "THE LOST CAUSE",
    tagLine: "Abandoned by luck, skill, and the fantasy gods themselves.",
    commentary: "They're not officially eliminated yet, but they can hear the fat lady warming up."
  },
  11: {
    status: "THE BOTTOM FEEDER",
    tagLine: "Rock bottom is just a state of mind... and their current address.",
    commentary: "At least they're consistent - consistently terrible. There's always next year."
  },
  12: {
    status: "THE CELLAR DWELLER",
    tagLine: "In a downward spiral that would make Dr. Thompson proud.",
    commentary: "A season that could only be described as one expanding circular fuck up."
  }
} as const;

interface Team {
  name: string;
  recordOverall: {
    wins: number;
    losses: number;
  };
  pointsFor: {
    value: number;
  };
  streak: {
    value: number;
  };
}

interface Division {
  id: number;
  name: string;
  teams: Team[];
}

interface FleaflickerResponse {
  divisions?: Division[];
}

interface PowerRankingTeam {
  rank: number;
  team: string;
  record: string;
  playoffOdds?: number;
  eliminationOdds?: number;
  status: string;
  tagLine: string;
  commentary: string;
  pointsFor: number;
  streak: number;
}

// Change this function
function calculatePlayoffOdds(rank: number): number {  // removed unused totalTeams parameter
  const playoffSpots = 6;
  if (rank <= playoffSpots) {
    return Math.round(100 - ((rank - 1) * 15));
  }
  return Math.round(100 - ((rank - playoffSpots) * 20));
}

export default function PowerIndex() {
  const { data } = useFleaflicker() as { data: FleaflickerResponse | null };
  const [rankings, setRankings] = useState<PowerRankingTeam[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!data || !mounted) return;

    try {
      const divisions = data.divisions;
      if (!divisions || divisions.length === 0) return;

      const teams = divisions.flatMap((div: Division) => div.teams || []);
      if (teams.length === 0) return;

      const sortedTeams = [...teams].sort((a: Team, b: Team) => {
        const winDiff = (b.recordOverall?.wins || 0) - (a.recordOverall?.wins || 0);
        if (winDiff !== 0) return winDiff;
        return (b.pointsFor?.value || 0) - (a.pointsFor?.value || 0);
      });

      const formattedRankings = sortedTeams.map((team, index) => {
        const rank = index + 1;
        const rankContent = POWER_RANK_CONTENT[rank as keyof typeof POWER_RANK_CONTENT];
        // In the formattedRankings calculation
const odds = calculatePlayoffOdds(rank);  // removed teams.length argument

        return {
          rank,
          team: team.name,
          record: `${team.recordOverall.wins}-${team.recordOverall.losses}`,
          ...(rank <= 8 
            ? { playoffOdds: odds }
            : { eliminationOdds: 100 - odds }
          ),
          status: rankContent.status,
          tagLine: rankContent.tagLine,
          commentary: rankContent.commentary,
          pointsFor: team.pointsFor.value,
          streak: team.streak.value
        };
      });

      setRankings(formattedRankings);
    } catch (error) {
      console.error('Error processing rankings:', error);
    }
  }, [data, mounted]);

  if (!mounted) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Radar className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-purple-400">THE FEAR & LOATHING POWER INDEX</h2>
        </div>
        <p className="text-gray-400">Summoning the spirits of chaos...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-purple-400">THE FEAR & LOATHING POWER INDEX</h2>
      </div>
      {rankings.length === 0 ? (
        <p className="text-gray-400 italic mb-6">Processing the madness...</p>
      ) : (
        <>
          <p className="text-gray-400 italic mb-6">
            Let me lay out the twisted hierarchy of this degenerate enterprise, these rankings that keep honest people awake at night, clutching their phones like rosary beads...
          </p>
          <div className="space-y-6">
            {rankings.map((team) => (
              <div key={team.rank} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl font-bold text-purple-400">#{team.rank}</span>
                  <span className="text-lg font-bold text-gray-200">{team.team}</span>
                  <span className="text-gray-400 ml-auto">{team.record}</span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
                  {team.playoffOdds ? (
                    <div 
                      className="h-2.5 rounded-full bg-green-500"
                      style={{ width: `${Math.min(team.playoffOdds, 100)}%` }}
                    />
                  ) : (
                    <div 
                      className="h-2.5 rounded-full bg-red-500"
                      style={{ width: `${Math.min(team.eliminationOdds || 0, 100)}%` }}
                    />
                  )}
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="text-sm">
                    <span className={team.playoffOdds ? "text-green-400" : "text-red-400"}>
                      {team.playoffOdds 
                        ? `Playoff Odds: ${team.playoffOdds}%`
                        : `Elimination Risk: ${team.eliminationOdds}%`
                      }
                    </span>
                  </div>
                  <div className="text-md text-purple-300 font-bold">{team.status}</div>
                  <p className="text-gray-300 italic">{team.tagLine}</p>
                  <p className="text-gray-200 mt-2">{team.commentary}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}