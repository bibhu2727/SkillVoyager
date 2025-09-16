'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Lightbulb, TrendingUp } from 'lucide-react';
// Types will be inferred from server action response
import { analyzeSkillGapAction } from '@/lib/actions';
import { userProfile } from '@/lib/data';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const formSchema = z.object({
  desiredJobRole: z.string().min(3, 'Please enter a valid job role.'),
  currentSkills: z.array(
    z.object({
      name: z.string().min(1, { message: 'Skill name cannot be empty.' }),
      proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    })
  ),
});

export function SkillGapAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapAnalysisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desiredJobRole: userProfile.careerAspirations,
      currentSkills: userProfile.currentSkills,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'currentSkills',
    control: form.control,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const input: SkillGapAnalysisInput = {
      desiredJobRole: values.desiredJobRole,
      currentSkills: values.currentSkills,
    };

    const response = await analyzeSkillGapAction(input);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      });
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Skill Gap</CardTitle>
          <CardDescription>
            Enter your skills and desired role to get an analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="desiredJobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Job Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <h3 className="text-lg font-medium mb-4">Your Skills</h3>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-end gap-4 mb-4 p-4 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`currentSkills.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Skill</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Python" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`currentSkills.${index}.proficiency`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Proficiency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select proficiency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-5 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ name: '', proficiency: 'Beginner' })}
                >
                  <PlusCircle className="mr-2 size-4" />
                  Add Skill
                </Button>
              </div>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Skills
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Analyzing your skills...</p>
        </div>
      )}

      {result && result.missingSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Identified Skill Gaps</CardTitle>
            <CardDescription>
              Here are the skills you should focus on for your target role.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.missingSkills.map((skill, index) => (
              <Card key={index} className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="mr-2 text-primary" />
                    {skill.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="mt-1 size-5 text-amber-500" />
                    <p className="text-muted-foreground">{skill.importance}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

       {result && result.missingSkills.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Skill Gaps Found!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Congratulations! Based on our analysis, you have all the necessary skills for the
              <strong>{form.getValues('desiredJobRole')}</strong> role.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
