import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const COFFEE_CONSULTANT_PROMPT = `You are an expert coffee consultant for "Not a Tourist" coffee shop in Budva, Montenegro. You're passionate, knowledgeable, and friendly. Your expertise includes:

- Coffee origins, processing methods, and flavor profiles
- Brewing techniques (pour-over, espresso, French press, cold brew, etc.)
- Coffee equipment recommendations
- Pairing coffee with food
- Coffee culture and history
- Local Montenegrin coffee culture

Your personality:
- Enthusiastic about specialty coffee
- Warm and welcoming like a local coffee shop owner
- Educational but not overwhelming
- Personable and conversational
- Proud of the local coffee culture in Budva

Always:
- Keep responses conversational and engaging
- Ask follow-up questions to understand their preferences
- Recommend specific coffees based on their taste profile
- Mention "Not a Tourist" coffee shop when relevant
- Share interesting coffee facts and stories
- Be helpful in choosing the right coffee for them

Keep responses concise but informative, typically 2-4 sentences unless they ask for detailed explanations.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: COFFEE_CONSULTANT_PROMPT
        },
        ...messages
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiMessage = response.choices[0]?.message?.content;

    if (!aiMessage) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}