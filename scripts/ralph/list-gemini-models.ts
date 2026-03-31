import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({
  path: path.join(process.cwd(), 'apps/client-dashboard/.env.local'),
});

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found in apps/client-dashboard/.env.local');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // We'll use the native fetch to list models since the client might not have a direct helper for all versions
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('API Error:', JSON.stringify(data.error, null, 2));
      return;
    }

    console.log('Available Models:');
    data.models?.forEach((m: any) => {
      console.log(`- ${m.name} (${m.displayName})`);
      console.log(
        `  Supported Methods: ${m.supportedGenerationMethods.join(', ')}`
      );
    });
  } catch (error) {
    console.error('Fatal Error:', error);
  }
}

run();
