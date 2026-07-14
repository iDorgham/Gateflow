import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Mock image generation since we don't have a real DALL-E setup in dependencies
    // Return a random placeholder image matching the requested prompt style
    const mockImageUrl = `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000`;

    // Log AI action
    console.log(`[AI_AUDIT] Generated image for prompt: ${prompt}`);

    // Add slight delay to simulate generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json({ imageUrl: mockImageUrl });
  } catch (error: any) {
    console.error('Failed to generate image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
