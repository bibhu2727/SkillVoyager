'use server';

/**
 * @fileOverview This file defines a Genkit flow for performing skill gap analysis.
 *
 * It takes a user's current skills and their desired job role as input,
 * and outputs the skills that the user needs to acquire to be qualified for the role.
 *
 * @param {SkillGapAnalysisInput} input - The input for the skill gap analysis.
 * @returns {Promise<SkillGapAnalysisOutput>} - A promise that resolves to the skill gap analysis output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillSchema = z.object({
  name: z.string().describe('The name of the skill'),
  proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The proficiency level of the skill'),
});

const SkillGapAnalysisInputSchema = z.object({
  currentSkills: z.array(SkillSchema).describe('The user\'s current skills and proficiency levels.'),
  desiredJobRole: z.string().describe('The user\'s desired job role (e.g., Data Scientist).'),
});

export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const MissingSkillSchema = z.object({
  name: z.string().describe('The name of the missing skill'),
  importance: z.string().describe('Why the skill is important for the job role')
});

const SkillGapAnalysisOutputSchema = z.object({
  missingSkills: z.array(MissingSkillSchema).describe('The skills missing for the user to be qualified for the desired job role.'),
});

export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function analyzeSkillGap(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  // During build time, return mock data
  if (!ai) {
    return {
      missingSkills: [
        {
          name: 'Python',
          importance: 'Essential for data analysis and machine learning'
        },
        {
          name: 'SQL',
          importance: 'Required for database operations and data querying'
        }
      ]
    };
  }
  return skillGapAnalysisFlow!(input);
}

const skillGapAnalysisPrompt = ai?.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {
    schema: SkillGapAnalysisInputSchema,
  },
  output: {
    schema: SkillGapAnalysisOutputSchema,
  },
  prompt: `You are a career advisor. Your goal is to analyze the skill gap between a user's current skills and the skills required for their desired job role.

Here are the user's current skills:
{{#each currentSkills}}
- {{name}} ({{proficiency}})
{{/each}}

The user's desired job role is: {{desiredJobRole}}

Based on the user's desired job role and current skills, identify the skills that the user needs to acquire to be qualified for the role. For each skill, explain why it is important for the job role.

Return the missing skills in the following format:
{
  "missingSkills": [
    {
      "name": "<skill_name>",
      "importance": "<explanation_of_why_the_skill_is_important>"
    }
  ]
}
`,
});

const skillGapAnalysisFlow = ai?.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await skillGapAnalysisPrompt!(input);
    return output!;
  }
);
