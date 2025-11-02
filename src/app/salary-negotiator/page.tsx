'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingUp, Target, MessageSquare, AlertTriangle, Lightbulb } from 'lucide-react';
import { salaryNegotiator, type SalaryNegotiatorInput, type SalaryNegotiatorOutput } from '@/ai/flows/salary-negotiator';

export default function SalaryNegotiatorPage() {
  const [formData, setFormData] = useState<SalaryNegotiatorInput>({
    currentSalary: '',
    targetRole: '',
    company: '',
    location: '',
    experience: '',
    skills: [],
    benefits: [],
    marketData: {
      averageSalary: '',
      percentile25: '',
      percentile75: '',
      percentile90: '',
    }
  });

  const [result, setResult] = useState<SalaryNegotiatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  const handleInputChange = (field: keyof SalaryNegotiatorInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMarketDataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      marketData: {
        ...prev.marketData,
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !formData.benefits?.includes(benefitInput.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...(prev.benefits || []), benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits?.filter(b => b !== benefit) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const negotiationResult = await salaryNegotiator(formData);
      setResult(negotiationResult);
    } catch (error) {
      console.error('Error getting salary negotiation advice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Salary Negotiator</h1>
            <p className="text-muted-foreground">Get AI-powered strategic advice for your salary negotiations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Negotiation Details</CardTitle>
              <CardDescription>
                Provide your current situation and target role information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentSalary">Current Salary</Label>
                    <Input
                      id="currentSalary"
                      placeholder="e.g., $75,000"
                      value={formData.currentSalary}
                      onChange={(e) => handleInputChange('currentSalary', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      placeholder="e.g., 5"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.targetRole}
                    onChange={(e) => handleInputChange('targetRole', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="e.g., Google"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <Label>Key Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits Section */}
                <div>
                  <Label>Current Benefits</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add a benefit"
                      value={benefitInput}
                      onChange={(e) => setBenefitInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                    />
                    <Button type="button" onClick={addBenefit} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.benefits?.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="cursor-pointer" onClick={() => removeBenefit(benefit)}>
                        {benefit} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Market Data Section */}
                <div>
                  <Label className="text-base font-semibold">Market Data (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Provide salary data if you have market research
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="averageSalary">Average Salary</Label>
                      <Input
                        id="averageSalary"
                        placeholder="e.g., $95,000"
                        value={formData.marketData?.averageSalary || ''}
                        onChange={(e) => handleMarketDataChange('averageSalary', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="percentile25">25th Percentile</Label>
                      <Input
                        id="percentile25"
                        placeholder="e.g., $80,000"
                        value={formData.marketData?.percentile25 || ''}
                        onChange={(e) => handleMarketDataChange('percentile25', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="percentile75">75th Percentile</Label>
                      <Input
                        id="percentile75"
                        placeholder="e.g., $110,000"
                        value={formData.marketData?.percentile75 || ''}
                        onChange={(e) => handleMarketDataChange('percentile75', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="percentile90">90th Percentile</Label>
                      <Input
                        id="percentile90"
                        placeholder="e.g., $130,000"
                        value={formData.marketData?.percentile90 || ''}
                        onChange={(e) => handleMarketDataChange('percentile90', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Analyzing...' : 'Get Negotiation Strategy'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Strategy Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Negotiation Strategy
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Confidence Level:</span>
                    <Badge variant={result.confidence > 0.7 ? 'default' : result.confidence > 0.4 ? 'secondary' : 'destructive'}>
                      {Math.round(result.confidence * 100)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{result.negotiationStrategy}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Target Salary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Target Salary Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.targetSalary}
                  </div>
                </CardContent>
              </Card>

              {/* Talking Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Key Talking Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.talkingPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </div>
                        <p className="text-sm">{point}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Counter Offer Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Counter Offer Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{result.counterOfferStrategy}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Red Flags */}
              {result.redFlags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Warning Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.redFlags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{flag}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!result && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fill out the form to get your personalized salary negotiation strategy
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}