import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input/Output schemas for the AI flows
const InterviewQuestionGenerationInput = z.object({
  jobRole: z.string(),
  difficulty: z.enum(['entry', 'mid', 'senior']),
  questionCount: z.number().min(1).max(15).default(5),
  categories: z.array(z.string()).optional(),
  companyType: z.string().optional(),
  specificSkills: z.array(z.string()).optional(),
  previousQuestions: z.array(z.string()).optional(), // Anti-repetition: avoid similar questions
  focusAreas: z.array(z.string()).optional(), // Specific areas to emphasize
  interviewStyle: z.enum(['traditional', 'behavioral', 'technical', 'mixed']).default('mixed'),
  industryContext: z.string().optional() // Industry-specific context
});

const InterviewQuestionOutput = z.object({
  questions: z.array(z.object({
    id: z.string(),
    category: z.enum([
      'technical-deep-dive',
      'behavioral-stories', 
      'problem-solving',
      'situational-judgment',
      'leadership-influence',
      'communication',
      'innovation-creativity',
      'performance-metrics',
      'industry-specific',
      'culture-fit'
    ]),
    question: z.string(),
    expectedKeywords: z.array(z.string()),
    followUpQuestions: z.array(z.string()).optional(),
    timeLimit: z.number(),
    difficulty: z.enum(['entry', 'mid', 'senior']),
    tips: z.string().optional(),
    questionType: z.enum(['open-ended', 'scenario-based', 'experience-based', 'hypothetical']),
    complexity: z.enum(['quick-response', 'detailed-analysis', 'deep-dive']),
    evaluationCriteria: z.array(z.string()).optional(), // What to look for in answers
    commonMistakes: z.array(z.string()).optional() // What candidates often get wrong
  }))
});

const ResponseAnalysisInput = z.object({
  question: z.string(),
  response: z.string(),
  expectedKeywords: z.array(z.string()),
  jobRole: z.string(),
  difficulty: z.enum(['entry', 'mid', 'senior']),
  speechAnalysis: z.object({
    wordsPerMinute: z.number(),
    pauseFrequency: z.number(),
    fillerWords: z.number(),
    clarity: z.number(),
    volume: z.number(),
    tone: z.string()
  })
});

const ResponseAnalysisOutput = z.object({
  confidence: z.number(),
  keywordUsage: z.array(z.string()),
  improvementAreas: z.array(z.string()),
  strengths: z.array(z.string()),
  technicalScore: z.number(),
  communicationScore: z.number(),
  problemSolvingScore: z.number(),
  overallFeedback: z.string(),
  specificTips: z.array(z.string())
});

const ComprehensiveAnalysisInput = z.object({
  jobRole: z.string(),
  difficulty: z.enum(['entry', 'mid', 'senior']),
  responses: z.array(z.object({
    question: z.string(),
    response: z.string(),
    duration: z.number(),
    speechAnalysis: z.object({
      wordsPerMinute: z.number(),
      pauseFrequency: z.number(),
      fillerWords: z.number(),
      clarity: z.number(),
      volume: z.number(),
      tone: z.string()
    })
  }))
});

const ComprehensiveAnalysisOutput = z.object({
  overallScore: z.number(),
  speechPattern: z.string(),
  confidence: z.number(),
  keywordUsage: z.array(z.string()),
  improvementAreas: z.array(z.string()),
  strengths: z.array(z.string()),
  detailedFeedback: z.object({
    technical: z.number(),
    communication: z.number(),
    problemSolving: z.number(),
    leadership: z.number()
  }),
  recommendations: z.array(z.string()),
  nextSteps: z.array(z.string())
});

// AI Flow for generating interview questions
export const generateInterviewQuestions = ai.defineFlow(
  {
    name: 'generateInterviewQuestions',
    inputSchema: InterviewQuestionGenerationInput,
    outputSchema: InterviewQuestionOutput,
  },
  async (input) => {
    const { 
      jobRole, 
      difficulty, 
      questionCount, 
      categories, 
      companyType, 
      specificSkills,
      previousQuestions,
      focusAreas,
      interviewStyle,
      industryContext
    } = input;
    
    const categoryFilter = categories && categories.length > 0 
      ? `🎯 **PRIORITY CATEGORIES**: Focus heavily on: ${categories.join(', ')}.` 
      : '🎯 **BALANCED DISTRIBUTION**: Distribute questions evenly across all available categories.';
    
    const skillsFilter = specificSkills && specificSkills.length > 0
      ? `🔧 **KEY SKILLS TO ASSESS**: ${specificSkills.join(', ')}.`
      : '';
    
    const companyContext = companyType 
      ? `🏢 **COMPANY CONTEXT**: This is for a ${companyType} company - tailor questions accordingly.`
      : '';
      
    const antiRepetitionFilter = previousQuestions && previousQuestions.length > 0
      ? `🚫 **AVOID REPETITION**: DO NOT create questions similar to these previously asked: ${previousQuestions.join(' | ')}`
      : '';
      
    const focusFilter = focusAreas && focusAreas.length > 0
      ? `🎪 **SPECIAL FOCUS**: Emphasize these areas: ${focusAreas.join(', ')}.`
      : '';
      
    const styleFilter = `🎭 **INTERVIEW STYLE**: ${interviewStyle} - adjust question mix accordingly.`;
    
    const industryFilter = industryContext
      ? `🏭 **INDUSTRY CONTEXT**: ${industryContext} - include relevant domain knowledge.`
      : '';

    const prompt = `
You are an expert technical interviewer and career coach with 15+ years of experience. Generate ${questionCount} DIVERSE, NON-REPETITIVE interview questions for a ${difficulty}-level ${jobRole} position.

**CRITICAL REQUIREMENTS:**
🎯 **VARIETY IS KEY**: Each question MUST be unique in approach, style, and focus area
🚫 **NO REPETITION**: Avoid similar phrasing, concepts, or question structures
🔥 **ENGAGING**: Make questions thought-provoking and realistic to actual interviews
📊 **BALANCED MIX**: Distribute across ALL categories below (not just technical)

${categoryFilter}
${skillsFilter}
${companyContext}
${antiRepetitionFilter}
${focusFilter}
${styleFilter}
${industryFilter}

**ENHANCED QUESTION CATEGORIES (Mix Required):**
🔧 **Technical Deep-Dive**: Architecture, system design, code review scenarios
🎭 **Behavioral Stories**: STAR method situations, conflict resolution, growth mindset
🧩 **Problem-Solving**: Real-world challenges, debugging scenarios, optimization
🎯 **Situational Judgment**: "What would you do if..." scenarios
🏆 **Leadership & Influence**: Team dynamics, mentoring, decision-making (mid/senior)
💬 **Communication**: Explaining complex topics, stakeholder management
🚀 **Innovation & Creativity**: Process improvement, new technology adoption
📈 **Performance & Metrics**: KPIs, success measurement, goal setting
🔍 **Industry-Specific**: Domain knowledge, trends, best practices
🎪 **Culture Fit**: Values alignment, work style, collaboration preferences

**DIFFICULTY SCALING:**
🟢 **Entry**: Fundamentals + learning agility + basic scenarios
🟡 **Mid**: Experience-based + complex problem-solving + some leadership
🔴 **Senior**: Strategic thinking + architecture + team leadership + mentoring

**QUESTION VARIETY TECHNIQUES:**
- Mix open-ended vs. specific scenarios
- Include "Tell me about a time..." vs. "How would you..." vs. "What's your approach to..."
- Vary time requirements (quick 2-min vs. deep 7-min responses)
- Include both positive and challenging scenarios
- Add follow-up questions for deeper exploration

**OUTPUT REQUIREMENTS:**
✅ Each question must have unique ID: {role_abbrev}_{difficulty}_{category_abbrev}_{number}
✅ Distribute across different categories (no category dominance)
✅ Include 3-7 specific expected keywords per question
✅ Time limits: 120-420 seconds (vary based on complexity)
✅ Actionable tips that help candidates structure their answers
✅ Optional follow-up questions for deeper exploration

**EXAMPLES OF VARIETY:**
- Instead of "What is your experience with X?", ask "Walk me through a challenging project where X was critical to success"
- Instead of "How do you handle stress?", ask "Describe a time when multiple urgent priorities collided - how did you navigate that?"
- Instead of "What are your strengths?", ask "What's a skill you've developed that colleagues often come to you for help with?"

Generate questions that make candidates think, reflect, and showcase their unique value proposition!
`;

    // Create a unique prompt for generating interview questions (cached to avoid registry conflicts)
    const promptName = `generateQuestionsPrompt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const questionPrompt = ai.definePrompt({
      name: promptName,
      input: { schema: InterviewQuestionGenerationInput },
      output: { schema: InterviewQuestionOutput },
      prompt
    });

    try {
      const { output } = await questionPrompt(input);
      return output!;
    } catch (error) {
      // Fallback: create structured response if AI generation fails
      return {
        questions: [
          {
            id: `${jobRole.toLowerCase().replace(/\s+/g, '_')}_${difficulty}_tech_001`,
            category: 'technical-deep-dive' as const,
            question: `Walk me through your approach to solving complex technical challenges in a ${difficulty}-level ${jobRole} role.`,
            expectedKeywords: ['problem-solving', 'methodology', 'technical analysis', 'debugging', 'optimization'],
            timeLimit: 300,
            questionType: 'experience-based' as const,
            complexity: 'detailed-analysis' as const,
            evaluationCriteria: ['Structured thinking', 'Technical depth', 'Real examples'],
            commonMistakes: ['Being too vague', 'Not providing specific examples'],
            difficulty,
            tips: 'Focus on specific examples and demonstrate your knowledge clearly.'
          }
        ]
      };
    }
  }
);

// AI Flow for analyzing individual responses
export const analyzeInterviewResponse = ai.defineFlow(
  {
    name: 'analyzeInterviewResponse',
    inputSchema: ResponseAnalysisInput,
    outputSchema: ResponseAnalysisOutput,
  },
  async (input) => {
    const { question, response, expectedKeywords, jobRole, difficulty, speechAnalysis } = input;

    const prompt = `
You are an expert interview coach analyzing a candidate's response. Provide detailed, constructive feedback.

**Interview Context:**
- Position: ${difficulty}-level ${jobRole}
- Question: "${question}"
- Expected Keywords: ${expectedKeywords.join(', ')}

**Candidate's Response:**
"${response}"

**Speech Analysis Data:**
- Words per minute: ${speechAnalysis.wordsPerMinute}
- Pause frequency: ${speechAnalysis.pauseFrequency}
- Filler words: ${speechAnalysis.fillerWords}
- Clarity: ${speechAnalysis.clarity}%
- Volume: ${speechAnalysis.volume}%
- Tone: ${speechAnalysis.tone}

**Analysis Requirements:**
1. **Confidence Score (0-100)**: Based on content quality, keyword usage, and speech patterns
2. **Keyword Usage**: List which expected keywords were mentioned
3. **Improvement Areas**: 2-4 specific areas for improvement
4. **Strengths**: 2-3 positive aspects of the response
5. **Scoring (0-100 each)**:
   - Technical: Accuracy and depth of technical content
   - Communication: Clarity, structure, and articulation
   - Problem-solving: Logical thinking and approach
6. **Overall Feedback**: 2-3 sentences of constructive feedback
7. **Specific Tips**: 3-5 actionable tips for improvement

**Evaluation Criteria:**
- Content relevance and accuracy
- Use of expected keywords naturally
- Clear structure and logical flow
- Specific examples and evidence
- Appropriate depth for ${difficulty} level
- Speech quality and confidence

Provide honest, constructive feedback that helps the candidate improve. Be encouraging but realistic.

Return response in the exact JSON format specified.
`;

    // Create a prompt for analyzing interview responses
    const analysisPrompt = ai.definePrompt({
      name: 'analyzeResponsePrompt',
      input: { schema: ResponseAnalysisInput },
      output: { schema: ResponseAnalysisOutput },
      prompt
    });

    try {
      const { output } = await analysisPrompt(input);
      return output!;
    } catch (error) {
      // Fallback analysis
      const keywordMatches = expectedKeywords.filter(keyword => 
        response.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return {
        confidence: Math.min(keywordMatches.length * 15 + speechAnalysis.clarity, 100),
        keywordUsage: keywordMatches,
        improvementAreas: ['Provide more specific examples', 'Use more technical terminology'],
        strengths: ['Clear communication', 'Good structure'],
        technicalScore: Math.min(keywordMatches.length * 20, 100),
        communicationScore: speechAnalysis.clarity,
        problemSolvingScore: response.length > 100 ? 70 : 50,
        overallFeedback: 'Good response with room for improvement in technical depth.',
        specificTips: [
          'Include more specific examples',
          'Use industry terminology',
          'Structure your answer with clear points'
        ]
      };
    }
  }
);

// AI Flow for comprehensive analysis of all responses
export const generateComprehensiveAnalysis = ai.defineFlow(
  {
    name: 'generateComprehensiveAnalysis',
    inputSchema: ComprehensiveAnalysisInput,
    outputSchema: ComprehensiveAnalysisOutput,
  },
  async (input) => {
    const { jobRole, difficulty, responses } = input;

    const responsesSummary = responses.map((r, index) => 
      `Q${index + 1}: "${r.question}"\nA${index + 1}: "${r.response}"\nDuration: ${r.duration}s, WPM: ${r.speechAnalysis.wordsPerMinute}, Clarity: ${r.speechAnalysis.clarity}%\n`
    ).join('\n');

    const prompt = `
You are a senior interview coach providing comprehensive feedback after a complete interview session.

**Interview Summary:**
- Position: ${difficulty}-level ${jobRole}
- Total Questions: ${responses.length}
- Interview Type: Technical Interview Simulation

**Complete Interview Transcript:**
${responsesSummary}

**Comprehensive Analysis Requirements:**

1. **Overall Score (0-100)**: Holistic assessment of interview performance
2. **Speech Pattern Analysis**: Describe overall communication style and patterns
3. **Confidence Level (0-100)**: Based on content and delivery across all responses
4. **Keyword Usage**: All technical/relevant keywords used throughout
5. **Top 3-5 Improvement Areas**: Most critical areas for development
6. **Top 3-5 Strengths**: Candidate's strongest points
7. **Detailed Scoring (0-100 each)**:
   - Technical: Overall technical knowledge and accuracy
   - Communication: Clarity, structure, and articulation
   - Problem-solving: Analytical thinking and methodology
   - Leadership: Leadership potential and team skills (if applicable)
8. **Recommendations**: 4-6 specific recommendations for improvement
9. **Next Steps**: 3-5 actionable next steps for career development

**Analysis Guidelines:**
- Consider the ${difficulty} level expectations
- Look for consistency across responses
- Evaluate growth potential and learning ability
- Assess cultural fit and soft skills
- Provide balanced, constructive feedback
- Focus on actionable insights

**Scoring Benchmarks:**
- 90-100: Exceptional, ready for promotion
- 80-89: Strong performer, minor improvements needed
- 70-79: Good potential, moderate development required
- 60-69: Adequate, significant improvement needed
- Below 60: Needs substantial development

Provide thorough, professional feedback that would be valuable for both the candidate and hiring managers.

Return response in the exact JSON format specified.
`;

    // Create a prompt for comprehensive analysis
    const comprehensivePrompt = ai.definePrompt({
      name: 'comprehensiveAnalysisPrompt',
      input: { schema: ComprehensiveAnalysisInput },
      output: { schema: ComprehensiveAnalysisOutput },
      prompt
    });

    try {
      const { output } = await comprehensivePrompt(input);
      return output!;
    } catch (error) {
      // Fallback comprehensive analysis
      const avgClarity = responses.reduce((sum, r) => sum + r.speechAnalysis.clarity, 0) / responses.length;
      const totalWords = responses.reduce((sum, r) => sum + r.response.split(' ').length, 0);
      const avgWPM = responses.reduce((sum, r) => sum + r.speechAnalysis.wordsPerMinute, 0) / responses.length;
      
      return {
        overallScore: Math.min(Math.round(avgClarity * 0.6 + (totalWords / responses.length) * 0.4), 100),
        speechPattern: `Average speaking pace of ${Math.round(avgWPM)} WPM with ${Math.round(avgClarity)}% clarity`,
        confidence: Math.round(avgClarity),
        keywordUsage: ['technical skills', 'problem solving', 'communication'],
        improvementAreas: [
          'Provide more specific examples',
          'Improve technical depth',
          'Enhance communication clarity'
        ],
        strengths: [
          'Good communication skills',
          'Structured responses',
          'Professional demeanor'
        ],
        detailedFeedback: {
          technical: Math.round(avgClarity * 0.8),
          communication: Math.round(avgClarity),
          problemSolving: Math.round(avgClarity * 0.9),
          leadership: Math.round(avgClarity * 0.7)
        },
        recommendations: [
          'Practice with more technical scenarios',
          'Work on providing concrete examples',
          'Improve speaking confidence',
          'Study industry best practices'
        ],
        nextSteps: [
          'Take additional technical courses',
          'Practice mock interviews',
          'Build portfolio projects',
          'Network with industry professionals'
        ]
      };
    }
  }
);

// Export types for use in components
export type {
  InterviewQuestionGenerationInput as GenerateQuestionsInput,
  InterviewQuestionOutput as GenerateQuestionsOutput,
  ResponseAnalysisInput,
  ResponseAnalysisOutput,
  ComprehensiveAnalysisInput,
  ComprehensiveAnalysisOutput
};