import { NextResponse } from 'next/server';

const LEAGUE_ID = 91436;
const BASE_URL = "https://www.fleaflicker.com/api";

export async function GET(request: Request) {
  try {
    // Get the searchParams
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'standings';

    let url = '';
    switch (endpoint) {
      case 'scoreboard':
        url = `${BASE_URL}/FetchLeagueScoreboard?sport=NFL&league_id=${LEAGUE_ID}`;
        break;
      case 'standings':
      default:
        url = `${BASE_URL}/FetchLeagueStandings?sport=NFL&league_id=${LEAGUE_ID}`;
        break;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch league data' },
      { status: 500 }
    );
  }
}