import { NextResponse } from 'next/server';

export async function POST(req: Request) {
console.log('API endpoint hit'); // Add this line
  const { winner, loser, winnerScore, loserScore, inProgress, yetToPlay } = await req.json();
  console.log('Received data:', { winner, loser, winnerScore, loserScore, inProgress, yetToPlay }); // Add this line

  const prompt = `As Hunter S. Thompson, write a one-sentence commentary about this fantasy football matchup:
Winner: ${winner} (${winnerScore} points)
Loser: ${loser} (${loserScore} points)
${inProgress ? 'Game in progress' : 'Game completed'}
${yetToPlay.winner > 0 ? `Winner has ${yetToPlay.winner} players left` : ''}
${yetToPlay.loser > 0 ? `Loser has ${yetToPlay.loser} players left` : ''}

Make it gonzo journalism style - excessive, outrageous, and with dark humor. Reference the team names if possible. One sentence only.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY as string
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 1024 // This is optional
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ commentary: data.content[0].text });
  } catch (error) {
    console.error('Error generating commentary:', error);
    return NextResponse.json({ error: 'Failed to generate commentary' }, { status: 500 });
  }
}