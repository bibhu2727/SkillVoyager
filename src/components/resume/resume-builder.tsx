"use client";

import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, FileText, Search, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { BuildResumeInput, BuildResumeOutput } from "@/ai/flows/ai-resume-builder";
import { buildResumeAction } from "@/lib/actions";
import { userProfile } from "@/lib/data";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  jobRole: z.string().min(3, "Please enter a valid job role."),
});

export function ResumeBuilder() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BuildResumeOutput | null>(null);
  const { toast } = useToast();
  const resumeRef = useRef<HTMLPreElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobRole: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const input: BuildResumeInput = {
      jobRole: values.jobRole,
      userSkills: userProfile.currentSkills.map(s => s.name),
      userExperience: userProfile.experience,
      userEducation: userProfile.educationLevel,
      userProjects: userProfile.projects,
      userAwards: userProfile.awards,
    };

    const response = await buildResumeAction(input);
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

  const handleDownload = () => {
    if (resumeRef.current) {
      html2canvas(resumeRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth - 20; // with margin
        const height = width / ratio;

        let position = 10;
        
        pdf.addImage(imgData, "PNG", 10, position, width, height);
        
        pdf.save("resume.pdf");
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Your Resume</CardTitle>
          <CardDescription>Enter a job role to tailor your resume with AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Job Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Machine Learning Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Build Resume
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Building your tailored resume...</p>
        </div>
      )}

      {result && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center"><FileText className="mr-2" /> Generated Resume</CardTitle>
                 <CardDescription>
                  This resume was generated for the role: <strong>{form.getValues("jobRole")}</strong>
                </CardDescription>
              </div>
              <Button variant="outline" size="icon" onClick={handleDownload} disabled={!result}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Download Resume</span>
              </Button>
            </CardHeader>
            <CardContent>
              <pre ref={resumeRef} className="whitespace-pre-wrap font-sans text-sm bg-muted p-4 rounded-md">{result.resume}</pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Search className="mr-2" /> ATS Keyword Check</CardTitle>
              <CardDescription>Keywords missing from your resume.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">{keyword}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
