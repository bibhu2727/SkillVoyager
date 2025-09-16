"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, TrendingUp, Shuffle, BarChart } from "lucide-react";
import {
  JobMarketInsightsInput,
  JobMarketInsightsOutput,
} from "@/ai/flows/job-market-insights";
import { getInsightsAction } from "@/lib/actions";
import { userProfile } from "@/lib/data";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  careerAspiration: z.string().min(3, "Please enter a valid career aspiration."),
});

export function InsightsGenerator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMarketInsightsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      careerAspiration: userProfile.careerAspirations,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const input: JobMarketInsightsInput = {
      careerAspiration: values.careerAspiration,
    };

    const response = await getInsightsAction(input);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: "Error",
        description: response.success === false ? response.error : "An unknown error occurred",
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Get Market Insights</CardTitle>
          <CardDescription>Enter a career to analyze current market trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="careerAspiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Aspiration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Market
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Analyzing the job market...</p>
        </div>
      )}

      {result && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 text-primary" />
                Trending Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.trendingSkills.split(',').map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill.trim()}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shuffle className="mr-2 text-primary" />
                Alternative Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex flex-wrap gap-2">
                {result.alternativeCareerPaths.split(',').map((path, index) => (
                  <Badge key={index} variant="outline">{path.trim()}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 text-primary" />
                Demand Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.demandOutlook}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
