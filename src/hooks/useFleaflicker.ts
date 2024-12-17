'use client'
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

// Add interfaces for standings data
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

interface StandingsData {
  divisions: Division[];
}

interface ScoreboardData {
  games: Game[];
}

// Create a union type for the possible data shapes
type LeagueData = StandingsData | ScoreboardData;

export function useFleaflicker(endpoint: 'standings' | 'scoreboard' = 'standings') {
  const [data, setData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(`Fetching ${endpoint} data...`);
        const response = await fetch(`/api/fleaflicker?endpoint=${endpoint}`);
        console.log('Response received:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data parsed successfully');
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error in useFleaflicker:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}