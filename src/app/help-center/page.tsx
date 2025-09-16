"use client";

import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, MessageCircle, Mail, Phone, Book, Lightbulb, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How does SkillVoyager help with career development?',
    answer: 'SkillVoyager uses AI-powered insights to analyze your skills, create personalized career roadmaps, and provide targeted recommendations for skill development. Our platform offers interview simulation, resume building, and career guidance tailored to your goals.',
    category: 'Getting Started'
  },
  {
    id: '2',
    question: 'Is my personal data secure on SkillVoyager?',
    answer: 'Yes, we take data security seriously. All your personal information is encrypted and stored securely. We comply with GDPR and other privacy regulations. You can review our Privacy Policy for detailed information about how we handle your data.',
    category: 'Privacy & Security'
  },
  {
    id: '3',
    question: 'How accurate is the AI-powered career advice?',
    answer: 'Our AI models are trained on extensive career data and industry trends. While we strive for high accuracy, we recommend using our insights as guidance alongside your own research and professional consultation.',
    category: 'AI & Technology'
  },
  {
    id: '4',
    question: 'Can I use SkillVoyager for free?',
    answer: 'Yes! SkillVoyager offers a comprehensive free tier with access to basic features including career roadmaps, skill assessments, and limited AI consultations. Premium features are available for advanced users.',
    category: 'Pricing & Plans'
  },
  {
    id: '5',
    question: 'How do I update my career profile?',
    answer: 'Navigate to your Profile Settings from the sidebar menu. You can update your skills, experience, career goals, and personal information. Changes are saved automatically.',
    category: 'Account Management'
  },
  {
    id: '6',
    question: 'What makes the Interview Simulator effective?',
    answer: 'Our Interview Simulator uses real-world questions from top companies, provides AI-powered feedback on your responses, and tracks your improvement over time. It supports both technical and behavioral interview preparation.',
    category: 'Features'
  },
  {
    id: '7',
    question: 'How often should I take skill assessments?',
    answer: 'We recommend taking skill assessments every 3-6 months to track your progress and identify new learning opportunities. The platform will notify you when it\'s time for a reassessment.',
    category: 'Skill Development'
  },
  {
    id: '8',
    question: 'Can I export my career roadmap?',
    answer: 'Yes, you can export your personalized career roadmap as a PDF or share it via a unique link. This feature is available in your Roadmap section.',
    category: 'Features'
  }
];

const categories = ['All', 'Getting Started', 'Features', 'Account Management', 'Privacy & Security', 'AI & Technology', 'Pricing & Plans', 'Skill Development'];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
              <Book className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Help Center
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and get the support you need to make the most of SkillVoyager
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Live Chat</CardTitle>
              <CardDescription>Get instant help from our support team</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Email Support</CardTitle>
              <CardDescription>Send us a detailed message</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Community</CardTitle>
              <CardDescription>Connect with other users</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Search through our knowledge base or browse by category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or browse different categories
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-medium text-left">
                        {faq.question}
                      </CardTitle>
                      <Badge variant="outline" className="mt-2">
                        {faq.category}
                      </Badge>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {expandedFAQ === faq.id && (
                  <CardContent>
                    <Separator className="mb-4" />
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Additional Resources
            </CardTitle>
            <CardDescription>
              Explore more ways to get help and improve your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Documentation
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-foreground cursor-pointer">• Getting Started Guide</li>
                  <li className="hover:text-foreground cursor-pointer">• Feature Tutorials</li>
                  <li className="hover:text-foreground cursor-pointer">• API Documentation</li>
                  <li className="hover:text-foreground cursor-pointer">• Best Practices</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Policies & Legal
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-foreground cursor-pointer">• Privacy Policy</li>
                  <li className="hover:text-foreground cursor-pointer">• Terms of Service</li>
                  <li className="hover:text-foreground cursor-pointer">• Cookie Policy</li>
                  <li className="hover:text-foreground cursor-pointer">• Data Protection</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
          <p className="text-muted-foreground mb-6">
            Our support team is here to help you succeed on your career journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}