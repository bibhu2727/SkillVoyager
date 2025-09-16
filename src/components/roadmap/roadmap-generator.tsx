"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, BookOpen, Clock } from "lucide-react";
import {
  PersonalizedLearningRoadmapInput,
  PersonalizedLearningRoadmapOutput,
} from "@/ai/flows/personalized-learning-roadmap";
import { generateRoadmapAction } from "@/lib/actions";
import { userProfile } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  targetJobRole: z.string().min(3, "Please enter a valid job role."),
});

export function RoadmapGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PersonalizedLearningRoadmapOutput | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Use authenticated user's name, fallback to userProfile if not logged in
  const displayName = user?.name && user.name.trim() ? user.name : userProfile.name;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetJobRole: userProfile.careerAspirations,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const input: PersonalizedLearningRoadmapInput = {
      userInfo: {
        name: displayName,
        age: userProfile.age,
        educationLevel: userProfile.educationLevel,
        fieldOfInterest: userProfile.fieldOfInterest,
        currentSkills: userProfile.currentSkills.map((s) => s.name),
        proficiencyLevels: userProfile.currentSkills.map((s) => s.proficiency),
        careerAspirations: userProfile.careerAspirations,
      },
      targetJobRoles: values.targetJobRole,
    };

    const response = await generateRoadmapAction(input);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="targetJobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Job Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Data Scientist"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Roadmap
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Generating your personalized roadmap...</p>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Roadmap for {form.getValues("targetJobRole")}</CardTitle>
            <CardDescription>A step-by-step guide to help you achieve your career goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.learningRoadmap.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold">
                    Step {index + 1}: {item.step}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 size-4" />
                      <div className="text-gray-800 dark:text-gray-300">Timeline: {item.timeline}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <BookOpen className="mr-2 size-4" />
                        Suggested Resources
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        {item.resources.map((resource, rIndex) => (
                          <li key={rIndex}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
