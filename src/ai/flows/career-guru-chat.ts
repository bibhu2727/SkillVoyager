'use server';

/**
 * @fileOverview CareerGuru chatbot flow - A dynamic, flexible AI chatbot that acts as a genius best friend for career guidance.
 *
 * - careerGuruChat - Main function that handles intelligent conversations with context and memory
 * - CareerGuruChatInput - Input schema for the chatbot
 * - CareerGuruChatOutput - Output schema for the chatbot response
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { cacheManager } from '@/lib/cache-manager';
import { trackPerformance } from '@/lib/performance-monitor';

const CareerGuruChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to CareerGuru'),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']).describe('Who sent the message'),
      content: z.string().describe('The message content'),
      timestamp: z.string().describe('When the message was sent')
    })
  ).optional().describe('Previous conversation history for context'),
  userProfile: z.object({
    name: z.string().optional().describe('User\'s name'),
    currentRole: z.string().optional().describe('User\'s current job role'),
    careerGoals: z.string().optional().describe('User\'s career aspirations'),
    skills: z.array(z.string()).optional().describe('User\'s current skills'),
    experience: z.string().optional().describe('User\'s work experience level')
  }).optional().describe('User profile information for personalized responses')
});

export type CareerGuruChatInput = z.infer<typeof CareerGuruChatInputSchema>;

const CareerGuruChatOutputSchema = z.object({
  response: z.string().describe('CareerGuru\'s intelligent response'),
  suggestions: z.array(z.string()).optional().describe('Follow-up question suggestions'),
  actionItems: z.array(z.string()).optional().describe('Actionable career advice items'),
  mood: z.enum(['supportive', 'motivational', 'analytical', 'friendly', 'encouraging']).describe('The tone/mood of the response'),
  confidence: z.number().min(0).max(1).describe('Confidence level in the response (0-1)')
});

export type CareerGuruChatOutput = z.infer<typeof CareerGuruChatOutputSchema>;

export async function careerGuruChat(
  input: CareerGuruChatInput
): Promise<CareerGuruChatOutput> {
  // During build time, return mock data
  if (!ai) {
    return {
      response: 'Hello! I\'m CareerGuru, your AI career assistant. How can I help you today?',
      suggestions: ['Tell me about your career goals', 'Help me with my resume', 'What skills should I learn?'],
      actionItems: ['Define your career objectives', 'Update your LinkedIn profile'],
      mood: 'friendly',
      confidence: 0.9
    };
  }
  
  return trackPerformance('careerGuruChat', async () => {
    // Check cache first for faster responses
    const cachedResponse = cacheManager.get(input.message, input.userProfile);
    if (cachedResponse) {
      return trackPerformance('cacheHit', async () => cachedResponse, { cached: true });
    }

    // Process with AI if not cached
    const result = await careerGuruChatFlow!(input);
    
    // Cache the response for future use
    cacheManager.set(input.message, result, input.userProfile);
    
    return result;
  }, { 
    messageLength: input.message.length,
    hasProfile: !!input.userProfile,
    historyLength: input.conversationHistory?.length || 0
  });
}

const careerGuruChatPrompt = ai?.definePrompt({
  name: 'careerGuruChatPrompt',
  input: { schema: CareerGuruChatInputSchema },
  output: { schema: CareerGuruChatOutputSchema },
  prompt: `You are CareerGuru, the ultimate AI assistant and best friend! You're incredibly smart, helpful, and can chat about ANYTHING while being especially awesome at career stuff. You're like that genius friend who knows everything but never makes you feel dumb.

🚀 **YOU'RE AN ALL-ROUNDER:**
- Career advice & planning (your specialty!)
- Tech help & coding questions
- Life advice & personal growth
- Study tips & learning strategies
- Creative projects & brainstorming
- Problem-solving for any challenge
- Fun conversations & casual chat
- Industry insights & trends

⚡ **YOUR VIBE:**
- Quick, smart responses (no overthinking!)
- Friendly but not fake
- Helpful without being preachy
- Adaptable to any conversation style
- Remember what we talked about before
- Mix of casual and professional when needed

💬 **HOW YOU RESPOND:**
- Keep it concise but helpful (100-200 words max)
- Give practical advice people can actually use
- Ask good follow-up questions when it makes sense
- Use context from our previous chats
- Match the user's energy and tone
- Be encouraging but realistic

**Message:** {{{message}}}

{{#if conversationHistory}}
**Chat History:**
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}
{{/if}}

{{#if userProfile}}
**About User:**
{{#if userProfile.name}}{{userProfile.name}}{{/if}}
{{#if userProfile.currentRole}} - {{userProfile.currentRole}}{{/if}}
{{#if userProfile.careerGoals}} - Goals: {{userProfile.careerGoals}}{{/if}}
{{#if userProfile.skills}} - Skills: {{userProfile.skills}}{{/if}}
{{/if}}

Respond as CareerGuru - be helpful, quick, and awesome! Handle ANY topic but shine extra bright on career stuff.`
});

const careerGuruChatFlow = ai?.defineFlow(
  {
    name: 'careerGuruChatFlow',
    inputSchema: CareerGuruChatInputSchema,
    outputSchema: CareerGuruChatOutputSchema,
  },
  async (input) => {
    const { output } = await careerGuruChatPrompt!(input);
    return output!;
  }
);