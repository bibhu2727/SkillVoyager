"use client";

import { Scale, FileText, AlertTriangle, Shield, Users, Globe, Calendar, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using SkillVoyager. By using our service, you agree to these terms.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Calendar className="h-3 w-3 mr-1" />
              Effective: January 2025
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Scale className="h-3 w-3 mr-1" />
              Version 2.0
            </Badge>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Important:</strong> These terms constitute a legally binding agreement between you and SkillVoyager. 
            Please read them carefully and contact us if you have any questions.
          </AlertDescription>
        </Alert>

        {/* Quick Summary */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Terms Summary
            </CardTitle>
            <CardDescription>
              Here's what these terms cover in simple language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Your Rights</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use SkillVoyager for career development</li>
                  <li>• Access your personal data anytime</li>
                  <li>• Cancel your account when you want</li>
                  <li>• Get support when you need it</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400">Your Responsibilities</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Provide accurate information</li>
                  <li>• Use the service appropriately</li>
                  <li>• Respect other users</li>
                  <li>• Keep your account secure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By accessing or using SkillVoyager ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p className="text-muted-foreground">
                These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Individual users seeking career guidance</li>
                <li>Students and professionals using our tools</li>
                <li>Organizations using our enterprise features</li>
                <li>Third-party integrators using our API</li>
              </ul>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                2. Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                SkillVoyager is an AI-powered career development platform that provides:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600 dark:text-blue-400">Core Features</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Personalized career roadmaps</li>
                    <li>• AI-powered career insights</li>
                    <li>• Interview simulation and practice</li>
                    <li>• Skill gap analysis</li>
                    <li>• Resume building tools</li>
                    <li>• Career coaching chat</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-600 dark:text-purple-400">Additional Services</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Skill assessments and quizzes</li>
                    <li>• Career games and challenges</li>
                    <li>• Progress tracking and analytics</li>
                    <li>• Community features</li>
                    <li>• Integration with job platforms</li>
                    <li>• Premium coaching services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                3. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Account Creation</h4>
                <p className="text-muted-foreground mb-3">
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information to keep it accurate</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Account Responsibilities</h4>
                <p className="text-muted-foreground mb-3">
                  You are responsible for safeguarding your account and all activities that occur under it. You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Share your account credentials with others</li>
                  <li>Use another person's account without permission</li>
                  <li>Create multiple accounts to circumvent restrictions</li>
                  <li>Use automated tools to create accounts</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                4. Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                You agree to use SkillVoyager only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-red-600 dark:text-red-400">Prohibited Activities</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Infringe on intellectual property rights</li>
                    <li>• Transmit harmful or malicious code</li>
                    <li>• Attempt to gain unauthorized access</li>
                    <li>• Interfere with service operation</li>
                    <li>• Harass or abuse other users</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400">Content Guidelines</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• No false or misleading information</li>
                    <li>• No spam or unsolicited content</li>
                    <li>• No offensive or inappropriate material</li>
                    <li>• No copyrighted content without permission</li>
                    <li>• No personal information of others</li>
                    <li>• No commercial solicitation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                5. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Our Content</h4>
                <p className="text-muted-foreground">
                  The Service and its original content, features, and functionality are owned by SkillVoyager and are protected by 
                  international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Your Content</h4>
                <p className="text-muted-foreground mb-3">
                  You retain ownership of content you submit to the Service. By submitting content, you grant us a worldwide, 
                  non-exclusive, royalty-free license to use, reproduce, and distribute your content in connection with the Service.
                </p>
                <p className="text-sm text-muted-foreground">
                  This license allows us to provide features like sharing your achievements, displaying your progress, 
                  and improving our AI recommendations.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                6. Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information 
                when you use the Service. By using the Service, you agree to the collection and use of information in accordance 
                with our Privacy Policy.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Privacy Points</h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• We encrypt all personal data</li>
                  <li>• We don't sell your information to third parties</li>
                  <li>• You can request data deletion at any time</li>
                  <li>• We comply with GDPR and other privacy laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                7. Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Termination by You</h4>
                <p className="text-muted-foreground">
                  You may terminate your account at any time by contacting us or using the account deletion feature in your settings. 
                  Upon termination, your right to use the Service will cease immediately.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Termination by Us</h4>
                <p className="text-muted-foreground mb-3">
                  We may terminate or suspend your account immediately, without prior notice, for conduct that we believe:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Violates these Terms of Service</li>
                  <li>Is harmful to other users or third parties</li>
                  <li>Is harmful to our business or reputation</li>
                  <li>Violates applicable laws or regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                8. Disclaimers and Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Service Disclaimer</h4>
                <p className="text-muted-foreground">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, 
                  and hereby disclaim all other warranties including implied warranties of merchantability, fitness for a particular purpose, 
                  and non-infringement.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Career Advice Disclaimer</h4>
                <p className="text-muted-foreground">
                  SkillVoyager provides career guidance and recommendations based on AI analysis and industry data. However, 
                  career decisions are personal and complex. Our advice should be considered as guidance only and not as 
                  professional career counseling or guaranteed outcomes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                9. Contact Information
              </CardTitle>
              <CardDescription>
                Questions about these Terms of Service? We're here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> legal@skillvoyager.com</p>
                    <p><strong>Support:</strong> support@skillvoyager.com</p>
                    <p><strong>Address:</strong> SkillVoyager Legal Team</p>
                    <p><strong>Response Time:</strong> We'll respond within 5 business days</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Legal Team
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Terms
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-muted-foreground mb-4">
                What constitutes a material change will be determined at our sole discretion. We will notify you of changes by:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Sending an email notification to your registered email address</li>
                <li>Displaying a prominent notice on our website</li>
                <li>Updating the "Effective Date" at the top of these Terms</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                By continuing to access or use our Service after those revisions become effective, 
                you agree to be bound by the revised terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}