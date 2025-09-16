"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/data";
import { PlusCircle, Trash2, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from '@/contexts/auth-context';
import { clearAuthData, debugAuthState } from '@/lib/auth-utils';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(16, { message: "You must be at least 16." }),
  educationLevel: z.string().min(1, { message: "Education level is required." }),
  fieldOfInterest: z.string().min(1, { message: "Field of interest is required." }),
  careerAspirations: z.string().min(1, { message: "Career aspirations are required." }),
  experience: z.string(),
  currentSkills: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Skill name cannot be empty." }),
        proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ userProfile }: { userProfile: UserProfile }) {
  const { user, logout, updateProfile } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...userProfile,
      name: user?.name || userProfile.name, // Use authenticated user's name
      careerAspirations: user?.careerAspirations || userProfile.careerAspirations,
      currentSkills: userProfile.currentSkills || [],
    },
    mode: "onChange",
  });

  // Watch for changes in name and careerAspirations fields
  const watchedName = form.watch("name");
  const watchedCareerAspirations = form.watch("careerAspirations");

  // Update user profile in real-time when name or career aspirations change
  useEffect(() => {
    if (watchedName && watchedName !== user?.name) {
      updateProfile({ name: watchedName });
    }
  }, [watchedName, user?.name, updateProfile]);

  useEffect(() => {
    if (watchedCareerAspirations && watchedCareerAspirations !== user?.careerAspirations) {
      updateProfile({ careerAspirations: watchedCareerAspirations });
    }
  }, [watchedCareerAspirations, user?.careerAspirations, updateProfile]);

  const { fields, append, remove } = useFieldArray({
    name: "currentSkills",
    control: form.control,
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved successfully.",
    });
    console.log(data);
  }

  const handleClearAuthData = () => {
    clearAuthData();
    toast({
      title: "Authentication Data Cleared",
      description: "Please refresh the page and log in again.",
    });
  };

  const handleDebugAuth = () => {
    debugAuthState();
    toast({
      title: "Debug Info Logged",
      description: "Check the browser console for authentication details.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="educationLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor's in CS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fieldOfInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field of Interest</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Artificial Intelligence" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
            control={form.control}
            name="careerAspirations"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Career Aspirations</FormLabel>
                <FormControl>
                <Input placeholder="e.g., Senior AI Engineer" {...field} />
                </FormControl>
                <FormDescription>
                What is your target job role?
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Work Experience</FormLabel>
                <FormControl>
                <Textarea placeholder="Describe your work experience..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <div>
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4 mb-4 p-4 border rounded-lg">
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
                  <FormItem  className="flex-1">
                    <FormLabel>Proficiency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="size-5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ name: "", proficiency: "Beginner" })}
          >
            <PlusCircle className="mr-2 size-4" />
            Add Skill
          </Button>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button type="submit">Update Profile</Button>
          {user && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleDebugAuth}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Debug Auth
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleClearAuthData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Auth Data
          </Button>
        </div>
      </form>
    </Form>
  );
}
