'use server';

/**
 * @fileOverview Provides insights into trending skills and alternative career paths.
 *
 * - getJobMarketInsights - A function that retrieves job market insights based on user's career aspirations.
 * - JobMarketInsightsInput - The input type for the getJobMarketInsights function.
 * - JobMarketInsightsOutput - The return type for the getJobMarketInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobMarketInsightsInputSchema = z.object({
  careerAspiration: z
    .string()
    .describe('The user\'s primary career aspiration.'),
});
export type JobMarketInsightsInput = z.infer<typeof JobMarketInsightsInputSchema>;

const JobMarketInsightsOutputSchema = z.object({
  trendingSkills: z
    .string()
    .describe('A list of trending skills relevant to the user\'s career aspiration.'),
  alternativeCareerPaths: z
    .string()
    .describe(
      'Suggestions for alternative career paths if the demand for the initial career aspiration is low.'
    ),
  demandOutlook: z
    .string()
    .describe('The job market demand outlook for the career aspiration.'),
});
export type JobMarketInsightsOutput = z.infer<typeof JobMarketInsightsOutputSchema>;

export async function getJobMarketInsights(
  input: JobMarketInsightsInput
): Promise<JobMarketInsightsOutput> {
  return jobMarketInsightsFlow(input);
}

const jobMarketInsightsPrompt = ai.definePrompt({
  name: 'jobMarketInsightsPrompt',
  input: {schema: JobMarketInsightsInputSchema},
  output: {schema: JobMarketInsightsOutputSchema},
  prompt: `You are a career advisor providing insights into the job market.

  Provide trending skills, alternative career paths, and demand outlook based on the user's career aspiration.

  Career Aspiration: {{{careerAspiration}}}

  Format the response as a JSON object.
  `,
});

const jobMarketInsightsFlow = ai.defineFlow(
  {
    name: 'jobMarketInsightsFlow',
    inputSchema: JobMarketInsightsInputSchema,
    outputSchema: JobMarketInsightsOutputSchema,
  },
  async input => {
    const {output} = await jobMarketInsightsPrompt(input);
    return output!;
  }
);
