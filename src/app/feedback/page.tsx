"use client";

import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send, Heart, Lightbulb, Bug, Zap, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const feedbackCategories = [
  { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'blue' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'yellow' },
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'red' },
  { value: 'improvement', label: 'Improvement Suggestion', icon: TrendingUp, color: 'green' },
  { value: 'ui', label: 'User Interface', icon: Zap, color: 'purple' },
  { value: 'community', label: 'Community', icon: Users, color: 'pink' }
];

const quickFeedbackOptions = [
  { id: 'easy', label: 'Easy to use', icon: ThumbsUp, type: 'positive' },
  { id: 'helpful', label: 'Very helpful', icon: Heart, type: 'positive' },
  { id: 'fast', label: 'Fast responses', icon: Zap, type: 'positive' },
  { id: 'accurate', label: 'Accurate advice', icon: TrendingUp, type: 'positive' },
  { id: 'confusing', label: 'Confusing interface', icon: ThumbsDown, type: 'negative' },
  { id: 'slow', label: 'Slow performance', icon: ThumbsDown, type: 'negative' },
  { id: 'inaccurate', label: 'Inaccurate results', icon: ThumbsDown, type: 'negative' },
  { id: 'missing', label: 'Missing features', icon: ThumbsDown, type: 'negative' }
];

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('detailed');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    anonymous: false
  });
  const [quickFeedback, setQuickFeedback] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickFeedbackToggle = (optionId: string) => {
    setQuickFeedback(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        anonymous: false
      });
      setRating(0);
      setQuickFeedback([]);
    }, 3000);
  };

  const handleQuickSubmit = async () => {
    if (quickFeedback.length === 0 && rating === 0) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setQuickFeedback([]);
      setRating(0);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Share Your Feedback
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your feedback helps us improve SkillVoyager. Share your thoughts, suggestions, or report issues to make our platform better for everyone.
          </p>
        </div>

        {isSubmitted ? (
          <div className="max-w-2xl mx-auto">
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>Thank you for your feedback!</strong> We appreciate you taking the time to help us improve SkillVoyager. Your input is valuable to us.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="quick" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Feedback
                </TabsTrigger>
                <TabsTrigger value="detailed" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Detailed Feedback
                </TabsTrigger>
              </TabsList>

              {/* Quick Feedback Tab */}
              <TabsContent value="quick" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Feedback
                    </CardTitle>
                    <CardDescription>
                      Rate your experience and select what applies to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Star Rating */}
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold">How would you rate your experience?</h3>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="transition-all duration-200 hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoverRating || rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {rating === 1 && "We're sorry to hear that. Please let us know how we can improve."}
                          {rating === 2 && "We appreciate your feedback. How can we do better?"}
                          {rating === 3 && "Thank you for the feedback. What can we improve?"}
                          {rating === 4 && "Great! We're glad you had a good experience."}
                          {rating === 5 && "Awesome! We're thrilled you love SkillVoyager!"}
                        </p>
                      )}
                    </div>

                    <Separator />

                    {/* Quick Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">What describes your experience? (Select all that apply)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {quickFeedbackOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleQuickFeedbackToggle(option.id)}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                              quickFeedback.includes(option.id)
                                ? option.type === 'positive'
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              option.type === 'positive' 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }`}>
                              <option.icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                      <Button
                        onClick={handleQuickSubmit}
                        disabled={isSubmitting || (quickFeedback.length === 0 && rating === 0)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Quick Feedback
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Detailed Feedback Tab */}
              <TabsContent value="detailed" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Detailed Feedback Form
                    </CardTitle>
                    <CardDescription>
                      Provide detailed feedback to help us understand your experience better
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Rating Section */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium">Overall Rating *</label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="transition-all duration-200 hover:scale-110"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= (hoverRating || rating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300 dark:text-gray-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {rating > 0 && (
                            <Badge variant="secondary" className="ml-2">
                              {rating} star{rating !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            placeholder="Your name (optional)"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            placeholder="Your email (optional)"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Category and Subject */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Feedback Category *</label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {feedbackCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center gap-2">
                                    <category.icon className="h-4 w-4" />
                                    {category.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Subject *</label>
                          <Input
                            placeholder="Brief summary of your feedback"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Feedback *</label>
                        <Textarea
                          placeholder="Please share your detailed feedback, suggestions, or report any issues you've encountered..."
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          rows={6}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Be as specific as possible to help us understand and address your feedback effectively.
                        </p>
                      </div>

                      {/* Anonymous Option */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={formData.anonymous}
                          onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="anonymous" className="text-sm">
                          Submit this feedback anonymously
                        </label>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.category || !formData.subject || !formData.message || rating === 0}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-1 md:flex-none"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Feedback
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              name: '',
                              email: '',
                              category: '',
                              subject: '',
                              message: '',
                              anonymous: false
                            });
                            setRating(0);
                          }}
                        >
                          Clear Form
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Feedback Stats */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Community Feedback
            </CardTitle>
            <CardDescription>
              See what our community is saying about SkillVoyager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">4.8</div>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">2,847</div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">94%</div>
                <p className="text-sm text-muted-foreground">Positive Feedback</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-pink-600">156</div>
                <p className="text-sm text-muted-foreground">Features Requested</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}