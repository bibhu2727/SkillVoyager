'use server';

/**
 * @fileOverview AI-powered resume builder that tailors the resume to a specific job role and highlights missing keywords based on an ATS scan.
 *
 * - buildResume - A function that handles the resume building process.
 * - BuildResumeInput - The input type for the buildResume function.
 * - BuildResumeOutput - The return type for the buildResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BuildResumeInputSchema = z.object({
  jobRole: z.string().describe('The target job role for the resume.'),
  userSkills: z.array(z.string()).describe('The user current skills.'),
  userExperience: z.string().describe('The user work experience.'),
  userEducation: z.string().describe('The user education background.'),
  userProjects: z.array(z.string()).describe('The user personal projects.'),
  userAwards: z.array(z.string()).describe('The user awards and certifications.'),
});

export type BuildResumeInput = z.infer<typeof BuildResumeInputSchema>;

const BuildResumeOutputSchema = z.object({
  resume: z.string().describe('The tailored resume for the job role.'),
  missingKeywords: z.array(z.string()).describe('The missing keywords based on ATS scan.'),
});

export type BuildResumeOutput = z.infer<typeof BuildResumeOutputSchema>;

export async function buildResume(input: BuildResumeInput): Promise<BuildResumeOutput> {
  return buildResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildResumePrompt',
  input: {schema: BuildResumeInputSchema},
  output: {schema: BuildResumeOutputSchema},
  prompt: `You are an AI-powered resume builder. Please create a resume tailored for the following job role: {{{jobRole}}}.

Consider the user's skills, experience, education, projects and awards to create the best possible resume.

Current Skills:
{{#if userSkills}}{{#each userSkills}}- {{{this}}}
{{/each}}{{else}}No skills listed.{{/if}}

Work Experience: {{{userExperience}}}

Education: {{{userEducation}}}

Projects:
{{#if userProjects}}{{#each userProjects}}- {{{this}}}
{{/each}}{{else}}No projects listed.{{/if}}

Awards:
{{#if userAwards}}{{#each userAwards}}- {{{this}}}
{{/each}}{{else}}No awards listed.{{/if}}

Include a watermark "BkSp TECH" at the end of the resume.

Also, based on an ATS scan, highlight the missing keywords that the user should add to their resume to make it stand out to recruiters.

Output the resume and the missing keywords in JSON format.
`,
});

const buildResumeFlow = ai.defineFlow(
  {
    name: 'buildResumeFlow',
    inputSchema: BuildResumeInputSchema,
    outputSchema: BuildResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
