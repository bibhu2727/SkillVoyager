'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized learning roadmaps.
 *
 * The flow takes user information and target job roles as input, and outputs a step-by-step learning path
 * with a timeline and suggestions for free and paid courses.
 *
 * @interface PersonalizedLearningRoadmapInput - Defines the input schema for the personalized learning roadmap flow.
 * @interface PersonalizedLearningRoadmapOutput - Defines the output schema for the personalized learning roadmap flow.
 * @function personalizedLearningRoadmap - The main function to generate the personalized learning roadmap.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedLearningRoadmapInputSchema = z.object({
  userInfo: z
    .object({
      name: z.string().describe('The name of the user.'),
      age: z.number().describe('The age of the user.'),
      educationLevel: z.string().describe('The education level of the user.'),
      fieldOfInterest: z.string().describe('The field of interest of the user.'),
      currentSkills: z
        .array(z.string())
        .describe('A list of the user current skills.'),
      proficiencyLevels: z
        .array(z.string())
        .describe('A list of the user proficiency levels for each skill.'),
      careerAspirations: z
        .string()
        .describe('The career aspirations or job role preferences of the user.'),
    })
    .describe('User profile information including name, age, education, etc.'),
  targetJobRoles: z
    .string()
    .describe('The target job roles for which to generate the roadmap.'),
});

export type PersonalizedLearningRoadmapInput = z.infer<
  typeof PersonalizedLearningRoadmapInputSchema
>;

const PersonalizedLearningRoadmapOutputSchema = z.object({
  learningRoadmap: z
    .array(
      z.object({
        step: z.string().describe('A step in the learning roadmap.'),
        timeline: z.string().describe('The estimated timeline for the step.'),
        resources: z
          .array(z.string())
          .describe('Suggested resources for the step, including free and paid courses.'),
      })
    )
    .describe('A step-by-step learning roadmap with timelines and resources.'),
});

export type PersonalizedLearningRoadmapOutput = z.infer<
  typeof PersonalizedLearningRoadmapOutputSchema
>;

export async function personalizedLearningRoadmap(
  input: PersonalizedLearningRoadmapInput
): Promise<PersonalizedLearningRoadmapOutput> {
  return personalizedLearningRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedLearningRoadmapPrompt',
  input: {schema: PersonalizedLearningRoadmapInputSchema},
  output: {schema: PersonalizedLearningRoadmapOutputSchema},
  prompt: `You are a career advisor that helps users create learning roadmaps to achieve their career aspirations.

  Generate a personalized learning roadmap for the user based on their profile and target job roles.
  The roadmap should include step-by-step instructions with timelines and suggestions for free and paid courses from Coursera, Udemy, and Khan Academy.

  User Profile:
  Name: {{{userInfo.name}}}
  Age: {{{userInfo.age}}}
  Education Level: {{{userInfo.educationLevel}}}
  Field of Interest: {{{userInfo.fieldOfInterest}}}
  Current Skills: {{#each userInfo.currentSkills}}- {{{this}}}{{/each}}
  Career Aspirations: {{{userInfo.careerAspirations}}}

  Target Job Roles: {{{targetJobRoles}}}

  The roadmap should include a JSON array of steps, timeline and resources.
  `,
});

const personalizedLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'personalizedLearningRoadmapFlow',
    inputSchema: PersonalizedLearningRoadmapInputSchema,
    outputSchema: PersonalizedLearningRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
