import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if we're in build mode (when Next.js is building the app)
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.NEXTAUTH_URL;

// Only initialize AI during runtime, not build time
export const ai = isBuildTime 
  ? null 
  : genkit({
      plugins: [googleAI()],
      model: 'googleai/gemini-2.5-flash',
    });
