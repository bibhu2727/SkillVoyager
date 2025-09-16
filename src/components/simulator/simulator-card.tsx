"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Rocket, Briefcase, DollarSign, Wrench } from "lucide-react";
import {
  AiCareerSimulatorInput,
  AiCareerSimulatorOutput,
} from "@/ai/flows/ai-career-simulator";
import { simulateCareerAction } from "@/lib/actions";
import { userProfile } from "@/lib/data";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  years: z.enum(["1", "3", "5"]),
});

export function SimulatorCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCareerSimulatorOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      years: "3",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const input: AiCareerSimulatorInput = {
      chosenPath: userProfile.careerAspirations,
      currentSkills: userProfile.currentSkills.map(s => s.name).join(", "),
      years: values.years,
    };

    const response = await simulateCareerAction(input);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: "Error",
        description: response.success === false ? response.error : 'An unknown error occurred',
        variant: "destructive",
      });
    }

    setLoading(false);
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Simulate Your Future</CardTitle>
        <CardDescription>Select a time frame to see a prediction of your career growth.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="years"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Frame</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Rocket className="mr-2 size-4"/>
              Simulate
            </Button>
          </form>
        </Form>
        {loading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Consulting the oracle of careers...</p>
          </div>
        )}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Prediction for {form.getValues("years")} Years:</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <Briefcase className="size-6 text-primary mt-1"/>
                <div>
                  <h4 className="font-semibold">Predicted Role</h4>
                  <p className="text-muted-foreground">{result.predictedRole}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <DollarSign className="size-6 text-primary mt-1"/>
                <div>
                  <h4 className="font-semibold">Predicted Salary</h4>
                  <p className="text-muted-foreground">{result.predictedSalary}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <Wrench className="size-6 text-primary mt-1"/>
                <div>
                  <h4 className="font-semibold">Required Skills to Get There</h4>
                   <div className="flex flex-wrap gap-2 mt-2">
                    {result.requiredSkills.split(',').map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
