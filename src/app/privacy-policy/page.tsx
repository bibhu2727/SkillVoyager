"use client";

import { Shield, Eye, Lock, Users, Database, Globe, Calendar, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Shield className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Calendar className="h-3 w-3 mr-1" />
              Last Updated: January 2025
            </Badge>
          </div>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy at a Glance
            </CardTitle>
            <CardDescription>
              Here's what you need to know about how we handle your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600 dark:text-green-400">✓ What we do</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Encrypt all your personal data</li>
                  <li>• Use data only to improve your experience</li>
                  <li>• Give you full control over your information</li>
                  <li>• Comply with GDPR and privacy laws</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600 dark:text-red-400">✗ What we don't do</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Sell your personal information</li>
                  <li>• Share data without your consent</li>
                  <li>• Track you across other websites</li>
                  <li>• Store unnecessary personal data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Personal Information</h4>
                <p className="text-muted-foreground mb-3">
                  When you create an account or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Name and email address</li>
                  <li>Professional information (job title, company, experience level)</li>
                  <li>Career goals and skill assessments</li>
                  <li>Resume and portfolio information (if uploaded)</li>
                  <li>Profile picture and preferences</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Usage Information</h4>
                <p className="text-muted-foreground mb-3">
                  We automatically collect information about how you use SkillVoyager:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Pages visited and features used</li>
                  <li>Time spent on different sections</li>
                  <li>Device information and browser type</li>
                  <li>IP address and general location</li>
                  <li>Performance and error logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Service Delivery</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Provide personalized career recommendations</li>
                      <li>• Generate AI-powered insights</li>
                      <li>• Track your progress and achievements</li>
                      <li>• Customize your learning experience</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Communication</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Send important account updates</li>
                      <li>• Provide customer support</li>
                      <li>• Share relevant career opportunities</li>
                      <li>• Notify about new features (optional)</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Improvement</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Analyze usage patterns</li>
                      <li>• Improve AI algorithms</li>
                      <li>• Fix bugs and enhance performance</li>
                      <li>• Develop new features</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">Legal Compliance</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Comply with applicable laws</li>
                      <li>• Respond to legal requests</li>
                      <li>• Protect against fraud</li>
                      <li>• Enforce our terms of service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Lock className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Encryption</h4>
                  <p className="text-xs text-muted-foreground">All data is encrypted in transit and at rest using AES-256 encryption</p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 mb-2" />
                  <h4 className="font-semibold mb-1">Access Control</h4>
                  <p className="text-xs text-muted-foreground">Strict access controls and regular security audits</p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Database className="h-6 w-6 text-purple-600 mb-2" />
                  <h4 className="font-semibold mb-1">Data Minimization</h4>
                  <p className="text-xs text-muted-foreground">We only collect and store data necessary for our services</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Privacy Rights
              </CardTitle>
              <CardDescription>
                Under GDPR and other privacy laws, you have the following rights:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Eye className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Right to Access</h4>
                      <p className="text-xs text-muted-foreground">Request a copy of your personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Database className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Right to Rectification</h4>
                      <p className="text-xs text-muted-foreground">Correct inaccurate personal data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lock className="h-3 w-3 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Right to Erasure</h4>
                      <p className="text-xs text-muted-foreground">Request deletion of your data</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="h-3 w-3 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Right to Portability</h4>
                      <p className="text-xs text-muted-foreground">Export your data in a portable format</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Right to Object</h4>
                      <p className="text-xs text-muted-foreground">Object to processing of your data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="h-3 w-3 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Right to Restrict</h4>
                      <p className="text-xs text-muted-foreground">Limit how we process your data</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us About Privacy
              </CardTitle>
              <CardDescription>
                Have questions about your privacy or want to exercise your rights?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> privacy@skillvoyager.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@skillvoyager.com</p>
                    <p><strong>Response Time:</strong> We'll respond within 30 days</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Privacy Team
                  </Button>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Download Privacy Policy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy from time to time. When we do, we'll notify you by:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                <li>Sending an email notification to your registered email address</li>
                <li>Displaying a prominent notice on our website</li>
                <li>Updating the "Last Updated" date at the top of this policy</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                Continued use of SkillVoyager after any changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}