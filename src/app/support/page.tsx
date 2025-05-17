
"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Headset, Mail, Phone, Clock, MessageSquare, Send, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const supportFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name must be 50 characters or less." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }).max(100, { message: "Subject must be 100 characters or less." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000, { message: "Message must be 1000 characters or less." }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function SupportPage() {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: SupportFormValues) {
    console.log("Support Form Submitted:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Support Request Sent",
      description: "Thank you for contacting us! We'll get back to you shortly.",
      variant: "default", // or a custom success variant if you have one
    });
    setFormSubmitted(true);
    form.reset(); // Reset form fields
    // Could redirect or show a success message inline
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Support Center</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Need assistance? Find contact information, submit a support request, or visit our FAQ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Headset className="mr-3 h-6 w-6 text-primary" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Reach out to us through the following channels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start">
              <Mail className="mr-4 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <a href="mailto:support@medicall.app" className="text-accent hover:underline">
                  support@medicall.app
                </a>
                <p className="text-xs text-muted-foreground">Best for non-urgent inquiries.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="mr-4 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-accent">1-800-MED-CALL</p>
                 <p className="text-xs text-muted-foreground">(1-800-633-2255)</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="mr-4 h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold">Our Hours</h3>
                <p className="text-muted-foreground">Monday - Friday</p>
                <p className="text-muted-foreground">9:00 AM - 6:00 PM (EST)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <MessageSquare className="mr-3 h-6 w-6 text-primary" />
              Send us a Message
            </CardTitle>
            <CardDescription>
              Fill out the form below to submit a support ticket.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formSubmitted ? (
                 <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800 dark:text-green-200">Message Sent!</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-400">
                    Thank you for your message. We will get back to you as soon as possible.
                    </AlertDescription>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setFormSubmitted(false)}>
                        Send Another Message
                    </Button>
                 </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="e.g. jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Issue with video call" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue in detail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                        </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            Have a common question? Check out our FAQ page for quick answers to common issues and platform usage.
          </CardDescription>
          <Button variant="outline" asChild>
            <Link href="/faq">Visit FAQ Page</Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
