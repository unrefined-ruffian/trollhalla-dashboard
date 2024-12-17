export const LEAGUE_ID = 91436;
export const BASE_URL = "https://www.fleaflicker.com/api";

// Define more specific interfaces for the data structures
interface Team {
  id: number;
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

export interface LeagueStandings {
  divisions: Division[];
  teams: Team[];
  league: {
    id: number;
    name: string;
  };
}

interface Score {
  score: {
    value: number;
    formatted: string;
  };
  yetToPlay: number;
}

export interface Scoreboard {
  games: Array<{
    home: { 
      name: string; 
      id: number;
      recordOverall: {
        wins: number;
        losses: number;
      };
    };
    away: { 
      name: string; 
      id: number;
      recordOverall: {
        wins: number;
        losses: number;
      };
    };
    homeScore: Score;
    awayScore: Score;
    isInProgress: boolean;
  }>;
}

export async function fetchLeagueData() {
  console.log('fetchLeagueData called');
  try {
    const standingsUrl = `${BASE_URL}/FetchLeagueStandings?sport=NFL&league_id=${LEAGUE_ID}`;
    console.log('Fetching standings from:', standingsUrl);
    
    const standingsResponse = await fetch(standingsUrl);
    const standings = await standingsResponse.json();
    console.log('Standings response:', standings);
    return { standings };
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function fetchScoreboard() {
  try {
    const scoreboardUrl = `${BASE_URL}/FetchLeagueScoreboard?sport=NFL&league_id=${LEAGUE_ID}`;
    const response = await fetch(scoreboardUrl);
    return await response.json();
  } catch (error) {
    console.error('Scoreboard fetch error:', error);
    throw error;
  }
}