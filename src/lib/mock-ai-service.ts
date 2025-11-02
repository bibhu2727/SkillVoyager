/**
 * Mock AI Service for Development
 * Provides offline functionality without requiring API keys
 */

export interface MockInterviewQuestion {
  id: string;
  text: string;
  category: 'behavioral' | 'technical' | 'situational' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MockInterviewResponse {
  question: string;
  response: string;
  analysis: {
    confidence: number;
    clarity: number;
    relevance: number;
    suggestions: string[];
  };
}

export interface MockPerformanceMetrics {
  eyeContact: number;
  speechClarity: number;
  confidence: number;
  bodyLanguage: number;
  overallScore: number;
}

export interface MockFeedback {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

class MockAIService {
  private mockQuestions: MockInterviewQuestion[] = [
    {
      id: '1',
      text: 'Tell me about yourself and your background.',
      category: 'general',
      difficulty: 'easy'
    },
    {
      id: '2',
      text: 'Why are you interested in this position?',
      category: 'general',
      difficulty: 'easy'
    },
    {
      id: '3',
      text: 'Describe a challenging project you worked on and how you overcame obstacles.',
      category: 'behavioral',
      difficulty: 'medium'
    },
    {
      id: '4',
      text: 'How do you handle working under pressure and tight deadlines?',
      category: 'behavioral',
      difficulty: 'medium'
    },
    {
      id: '5',
      text: 'Where do you see yourself in 5 years?',
      category: 'general',
      difficulty: 'easy'
    },
    {
      id: '6',
      text: 'Describe a time when you had to work with a difficult team member.',
      category: 'behavioral',
      difficulty: 'medium'
    },
    {
      id: '7',
      text: 'What is your greatest strength and how does it apply to this role?',
      category: 'general',
      difficulty: 'easy'
    },
    {
      id: '8',
      text: 'Tell me about a time when you failed and what you learned from it.',
      category: 'behavioral',
      difficulty: 'hard'
    },
    {
      id: '9',
      text: 'How do you stay updated with industry trends and technologies?',
      category: 'technical',
      difficulty: 'medium'
    },
    {
      id: '10',
      text: 'Describe your ideal work environment.',
      category: 'situational',
      difficulty: 'easy'
    }
  ];

  private mockFeedbackTemplates = {
    strengths: [
      'Clear and articulate communication',
      'Strong problem-solving approach',
      'Good understanding of the role requirements',
      'Confident presentation style',
      'Relevant experience and examples',
      'Professional demeanor',
      'Good eye contact and body language',
      'Thoughtful responses to questions',
      'Shows enthusiasm for the position',
      'Demonstrates leadership qualities'
    ],
    improvements: [
      'Could provide more specific examples',
      'Consider elaborating on technical details',
      'Work on reducing filler words',
      'Maintain consistent eye contact',
      'Speak with more confidence',
      'Provide more quantifiable results',
      'Better structure for complex answers',
      'Show more enthusiasm in responses',
      'Improve posture and body language',
      'Practice active listening skills'
    ],
    recommendations: [
      'Practice the STAR method for behavioral questions',
      'Research the company and role more thoroughly',
      'Prepare specific examples from your experience',
      'Work on your elevator pitch',
      'Practice mock interviews regularly',
      'Improve your technical vocabulary',
      'Work on your presentation skills',
      'Develop better storytelling techniques',
      'Practice answering questions concisely',
      'Improve your non-verbal communication'
    ]
  };

  /**
   * Generate a random interview question
   */
  generateQuestion(category?: string, difficulty?: string): MockInterviewQuestion {
    let filteredQuestions = this.mockQuestions;
    
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex] || this.mockQuestions[0];
  }

  /**
   * Analyze a response (mock analysis)
   */
  async analyzeResponse(question: string, response: string): Promise<MockInterviewResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate mock analysis based on response length and content
    const wordCount = response.split(' ').length;
    const hasExamples = response.toLowerCase().includes('example') || response.toLowerCase().includes('experience');
    const isConfident = !response.toLowerCase().includes('um') && !response.toLowerCase().includes('uh');
    
    const confidence = Math.min(95, Math.max(60, 70 + (wordCount > 50 ? 15 : 0) + (hasExamples ? 10 : 0)));
    const clarity = Math.min(95, Math.max(65, 75 + (isConfident ? 15 : 0) + (wordCount > 30 && wordCount < 200 ? 10 : 0)));
    const relevance = Math.min(95, Math.max(70, 80 + (hasExamples ? 10 : 0) + (wordCount > 40 ? 5 : 0)));
    
    const suggestions = [];
    if (wordCount < 30) suggestions.push('Try to provide more detailed responses');
    if (!hasExamples) suggestions.push('Include specific examples from your experience');
    if (!isConfident) suggestions.push('Reduce filler words like "um" and "uh"');
    if (wordCount > 200) suggestions.push('Keep responses more concise and focused');
    
    return {
      question,
      response,
      analysis: {
        confidence,
        clarity,
        relevance,
        suggestions: suggestions.length > 0 ? suggestions : ['Great response! Keep up the good work.']
      }
    };
  }

  /**
   * Generate mock performance metrics
   */
  generatePerformanceMetrics(responses: MockInterviewResponse[]): MockPerformanceMetrics {
    if (responses.length === 0) {
      return {
        eyeContact: 75,
        speechClarity: 75,
        confidence: 75,
        bodyLanguage: 75,
        overallScore: 75
      };
    }

    // Calculate averages from responses
    const avgConfidence = responses.reduce((sum, r) => sum + r.analysis.confidence, 0) / responses.length;
    const avgClarity = responses.reduce((sum, r) => sum + r.analysis.clarity, 0) / responses.length;
    const avgRelevance = responses.reduce((sum, r) => sum + r.analysis.relevance, 0) / responses.length;
    
    // Generate related metrics with some randomness
    const eyeContact = Math.min(95, Math.max(60, avgConfidence + (Math.random() - 0.5) * 20));
    const speechClarity = Math.min(95, Math.max(60, avgClarity + (Math.random() - 0.5) * 15));
    const confidence = Math.min(95, Math.max(60, avgConfidence + (Math.random() - 0.5) * 10));
    const bodyLanguage = Math.min(95, Math.max(60, (avgConfidence + avgClarity) / 2 + (Math.random() - 0.5) * 20));
    const overallScore = Math.min(95, Math.max(60, (eyeContact + speechClarity + confidence + bodyLanguage + avgRelevance) / 5));

    return {
      eyeContact: Math.round(eyeContact),
      speechClarity: Math.round(speechClarity),
      confidence: Math.round(confidence),
      bodyLanguage: Math.round(bodyLanguage),
      overallScore: Math.round(overallScore)
    };
  }

  /**
   * Generate mock feedback
   */
  generateFeedback(responses: MockInterviewResponse[], metrics: MockPerformanceMetrics): MockFeedback {
    const getRandomItems = (array: string[], count: number) => {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    // Adjust feedback based on performance
    const strengthCount = metrics.overallScore > 80 ? 4 : metrics.overallScore > 70 ? 3 : 2;
    const improvementCount = metrics.overallScore < 70 ? 4 : metrics.overallScore < 80 ? 3 : 2;
    const recommendationCount = 3;

    return {
      strengths: getRandomItems(this.mockFeedbackTemplates.strengths, strengthCount),
      improvements: getRandomItems(this.mockFeedbackTemplates.improvements, improvementCount),
      recommendations: getRandomItems(this.mockFeedbackTemplates.recommendations, recommendationCount)
    };
  }

  /**
   * Simulate a complete interview analysis
   */
  async analyzeInterview(questions: string[], responses: string[]): Promise<{
    responseAnalyses: MockInterviewResponse[];
    performanceMetrics: MockPerformanceMetrics;
    feedback: MockFeedback;
  }> {
    // Analyze each response
    const responseAnalyses: MockInterviewResponse[] = [];
    for (let i = 0; i < Math.min(questions.length, responses.length); i++) {
      const analysis = await this.analyzeResponse(questions[i], responses[i]);
      responseAnalyses.push(analysis);
    }

    // Generate overall metrics and feedback
    const performanceMetrics = this.generatePerformanceMetrics(responseAnalyses);
    const feedback = this.generateFeedback(responseAnalyses, performanceMetrics);

    return {
      responseAnalyses,
      performanceMetrics,
      feedback
    };
  }
}

// Export singleton instance
export const mockAIService = new MockAIService();
export default mockAIService;