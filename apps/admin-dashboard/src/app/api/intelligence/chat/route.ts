import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

/**
 * Universal Vertical Assistant (RAG Pipeline)
 * Answers queries based on the organization's unique knowledge base.
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { query, orgId } = await req.json();

    // 1. RAG: Retrieve relevant context
    // In a real scenario, this would use a vector similarity search (e.g., pgvector or Pinecone)
    const knowledgeItems = await prisma.knowledgeItem.findMany({
      where: { organizationId: orgId },
      take: 5 // Get the latest/top items for context
    });

    const context = knowledgeItems.map(item => item.content).join("\n\n---\n\n");

    // 2. Generate response with context
    const { text } = await generateText({
      model: google('gemini-1.5-pro'),
      system: `You are the GateFlow Universal Vertical Assistant. 
      You help organization administrators manage their residential and commercial gates using their specific knowledge base.
      
      Your personality is professional, efficient, and domain-aware.
      
      CONTEXT FROM ORGANIZATION KNOWLEDGE BASE:
      ${context || "No specific local knowledge found for this query."}
      
      Instructions:
      1. Prioritize information from the provided context.
      2. If the answer is not in the context, use your general knowledge but mention it is based on standard industry practices.
      3. Be concise and provide actionable steps.`,
      prompt: query,
    });

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('[INTEL_CHAT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
