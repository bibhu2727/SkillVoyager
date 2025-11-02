'use server';

import {
  personalizedLearningRoadmap,
  PersonalizedLearningRoadmapInput,
  PersonalizedLearningRoadmapOutput,
} from '@/ai/flows/personalized-learning-roadmap';
import {
  buildResume,
  BuildResumeInput,
  BuildResumeOutput,
} from '@/ai/flows/ai-resume-builder';
import {
  aiCareerSimulator,
  AiCareerSimulatorInput,
  AiCareerSimulatorOutput,
} from '@/ai/flows/ai-career-simulator';
import {
  getJobMarketInsights,
  JobMarketInsightsInput,
  JobMarketInsightsOutput,
} from '@/ai/flows/job-market-insights';
import {
  analyzeSkillGap,
  SkillGapAnalysisInput,
  SkillGapAnalysisOutput,
} from '@/ai/flows/skill-gap-analysis';
import {
  careerGuruChat,
  CareerGuruChatInput,
  CareerGuruChatOutput,
} from '@/ai/flows/career-guru-chat';
import {
  generateInterviewQuestions,
  analyzeInterviewResponse,
  generateComprehensiveAnalysis,
} from '@/ai/flows/interview-simulator';


type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export async function generateRoadmapAction(
  input: PersonalizedLearningRoadmapInput
): Promise<ActionResult<PersonalizedLearningRoadmapOutput>> {
  try {
    const output = await personalizedLearningRoadmap(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate roadmap. Please try again.',
    };
  }
}

export async function buildResumeAction(
  input: BuildResumeInput
): Promise<ActionResult<BuildResumeOutput>> {
  try {
    const output = await buildResume(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to build resume. Please try again.' };
  }
}

export async function simulateCareerAction(
  input: AiCareerSimulatorInput
): Promise<ActionResult<AiCareerSimulatorOutput>> {
  try {
    const output = await aiCareerSimulator(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to run simulation. Please try again.',
    };
  }
}

export async function getInsightsAction(
  input: JobMarketInsightsInput
): Promise<ActionResult<JobMarketInsightsOutput>> {
  try {
    const output = await getJobMarketInsights(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to get insights. Please try again.',
    };
  }
}

export async function analyzeSkillGapAction(
  input: SkillGapAnalysisInput
): Promise<ActionResult<SkillGapAnalysisOutput>> {
  try {
    const output = await analyzeSkillGap(input);
    return { success: true, data: output };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Failed to analyze skills. Please try again.',
    };
  }
}

export async function careerGuruChatAction(
  input: CareerGuruChatInput
): Promise<ActionResult<CareerGuruChatOutput>> {
  try {
    const data = await careerGuruChat(input);
    return { success: true, data };
  } catch (error) {
    console.error('Error in CareerGuru chat:', error);
    return {
      success: false,
      error: 'CareerGuru is having trouble right now. Please try again!',
    };
  }
}

export async function generateInterviewQuestionsAction(
  input: any
): Promise<ActionResult<any>> {
  try {
    const output = await generateInterviewQuestions(input);
    return { success: true, data: output };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function analyzeInterviewResponseAction(
  input: any
): Promise<ActionResult<any>> {
  try {
    const output = await analyzeInterviewResponse(input);
    return { success: true, data: output };
  } catch (error) {
    console.error('Error analyzing interview response:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function generateComprehensiveAnalysisAction(
  input: any
): Promise<ActionResult<any>> {
  try {
    const output = await generateComprehensiveAnalysis(input);
    return { success: true, data: output };
  } catch (error) {
    console.error('Error generating comprehensive analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}



export async function processCounterOfferAction(
  input: any
): Promise<ActionResult<any>> {
  try {
    const output = await processCounterOfferAction(input);
    return { success: true, data: output };
  } catch (error) {
    console.error('Error processing counter offer:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
