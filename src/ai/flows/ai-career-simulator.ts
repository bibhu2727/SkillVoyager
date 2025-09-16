// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Predicts potential career paths, roles, and salaries in the future based on the chosen path.
 *
 * - aiCareerSimulator - A function that predicts future career paths.
 * - AiCareerSimulatorInput - The input type for the aiCareerSimulator function.
 * - AiCareerSimulatorOutput - The return type for the aiCareerSimulator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCareerSimulatorInputSchema = z.object({
  chosenPath: z.string().describe('The career path chosen by the user (e.g., AI, Finance, Marketing).'),
  currentSkills: z.string().describe('A comma-separated list of the user\u2019s current skills (e.g., Python, SQL, Communication).'),
  years: z.enum(['1', '3', '5']).describe('The number of years into the future to predict.'),
});

export type AiCareerSimulatorInput = z.infer<typeof AiCareerSimulatorInputSchema>;

const AiCareerSimulatorOutputSchema = z.object({
  predictedRole: z.string().describe('The predicted job role in the specified number of years.'),
  predictedSalary: z.string().describe('The predicted average salary for the job role.'),
  requiredSkills: z.string().describe('A comma-separated list of skills required for the predicted role.'),
});

export type AiCareerSimulatorOutput = z.infer<typeof AiCareerSimulatorOutputSchema>;

export async function aiCareerSimulator(input: AiCareerSimulatorInput): Promise<AiCareerSimulatorOutput> {
  return aiCareerSimulatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCareerSimulatorPrompt',
  input: {schema: AiCareerSimulatorInputSchema},
  output: {schema: AiCareerSimulatorOutputSchema},
  prompt: `You are a career advisor, and your goal is to predict the potential career path, job role, and salary of a user in the future.

Given the user's chosen career path, current skills, and the number of years into the future, predict the user's job role, salary, and the skills they will need.

Chosen Career Path: {{{chosenPath}}}
Current Skills: {{{currentSkills}}}
Years: {{{years}}}

Based on this information, predict:
- Predicted Job Role:
- Predicted Salary:
- Required Skills:`, 
});

const aiCareerSimulatorFlow = ai.defineFlow(
  {
    name: 'aiCareerSimulatorFlow',
    inputSchema: AiCareerSimulatorInputSchema,
    outputSchema: AiCareerSimulatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

