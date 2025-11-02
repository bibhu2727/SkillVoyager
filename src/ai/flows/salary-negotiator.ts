'use server';

/**
 * @fileOverview AI-powered salary negotiation assistant
 * Provides strategic advice for salary negotiations with market data and tactics
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SalaryNegotiatorInputSchema = z.object({
  currentSalary: z.string().describe('Current annual salary'),
  targetRole: z.string().describe('Target job role'),
  company: z.string().describe('Company name'),
  location: z.string().optional().describe('Location of the job'),
  experience: z.string().describe('Years of experience'),
  skills: z.array(z.string()).optional().describe('Key skills'),
  benefits: z.array(z.string()).optional().describe('Current benefits'),
  marketData: z.object({
    averageSalary: z.string().optional().describe('Market average salary'),
    percentile25: z.string().optional().describe('25th percentile salary'),
    percentile75: z.string().optional().describe('75th percentile salary'),
    percentile90: z.string().optional().describe('90th percentile salary'),
  }).optional().describe('Market salary data')
});

export type SalaryNegotiatorInput = z.infer<typeof SalaryNegotiatorInputSchema>;

const SalaryNegotiatorOutputSchema = z.object({
  negotiationStrategy: z.string().describe('Comprehensive negotiation strategy'),
  targetSalary: z.string().describe('Recommended target salary range'),
  talkingPoints: z.array(z.string()).describe('Key talking points for negotiation'),
  counterOfferStrategy: z.string().describe('How to handle counter offers'),
  redFlags: z.array(z.string()).describe('Warning signs to watch for'),
  confidence: z.number().min(0).max(1).describe('Confidence level in the strategy')
});

export type SalaryNegotiatorOutput = z.infer<typeof SalaryNegotiatorOutputSchema>;

export async function salaryNegotiator(
  input: SalaryNegotiatorInput
): Promise<SalaryNegotiatorOutput> {
  // During build time, return mock data
  if (!ai) {
    return {
      negotiationStrategy: 'Mock negotiation strategy',
      targetSalary: '$80,000 - $100,000',
      talkingPoints: ['Market research', 'Experience', 'Skills'],
      counterOfferStrategy: 'Mock counter offer strategy',
      redFlags: ['Low initial offer', 'No room for negotiation'],
      confidence: 0.8
    };
  }
  return salaryNegotiatorFlow!(input);
}

const salaryNegotiatorPrompt = ai?.definePrompt({
  name: 'salaryNegotiatorPrompt',
  input: { schema: SalaryNegotiatorInputSchema },
  output: { schema: SalaryNegotiatorOutputSchema },
  prompt: `You are an expert salary negotiation consultant with decades of experience in corporate compensation and HR strategy. Provide strategic, data-driven advice for salary negotiations.

**NEGOTIATION CONTEXT:**
- Current Salary: {{{currentSalary}}}
- Target Role: {{{targetRole}}}
- Company: {{{company}}}
{{#if location}}- Location: {{{location}}}{{/if}}
- Experience: {{{experience}}} years
{{#if skills}}- Key Skills: {{#each skills}}{{#if @index}}, {{/if}}{{{this}}}{{/each}}{{/if}}
{{#if benefits}}- Current Benefits: {{#each benefits}}{{#if @index}}, {{/if}}{{{this}}}{{/each}}{{/if}}

{{#if marketData}}
**MARKET DATA:**
{{#if marketData.averageSalary}}- Average Salary: {{{marketData.averageSalary}}}{{/if}}
{{#if marketData.percentile25}}- 25th Percentile: {{{marketData.percentile25}}}{{/if}}
{{#if marketData.percentile75}}- 75th Percentile: {{{marketData.percentile75}}}{{/if}}
{{#if marketData.percentile90}}- 90th Percentile: {{{marketData.percentile90}}}{{/if}}
{{/if}}

**YOUR EXPERT ANALYSIS SHOULD INCLUDE:**

1. **Negotiation Strategy**: A comprehensive plan considering market data, experience, and company factors
2. **Target Salary Range**: Realistic salary range based on market data and qualifications
3. **Talking Points**: 5-7 specific, compelling arguments for higher compensation
4. **Counter Offer Strategy**: How to respond to initial offers and counteroffers
5. **Red Flags**: Warning signs that might indicate poor negotiation positioning

**STRATEGIC PRINCIPLES TO FOLLOW:**
- Base recommendations on market data when available
- Consider total compensation (salary + benefits + equity)
- Factor in cost of living differences
- Account for company size, industry, and growth stage
- Emphasize value creation and ROI for the employer
- Prepare for multiple negotiation rounds
- Know when to walk away

**CONFIDENCE LEVEL**: Rate your confidence in this strategy from 0-1 based on data availability and market clarity.

Provide actionable, professional advice that maximizes compensation while maintaining positive relationships.`
});

const salaryNegotiatorFlow = ai?.defineFlow(
  {
    name: 'salaryNegotiatorFlow',
    inputSchema: SalaryNegotiatorInputSchema,
    outputSchema: SalaryNegotiatorOutputSchema,
  },
  async (input) => {
    const { output } = await salaryNegotiatorPrompt!(input);
    return output!;
  }
);
