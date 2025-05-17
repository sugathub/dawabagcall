
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User, Edit3, MapPin, Save, X, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Mock user data type
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  medicalSummary: string;
  memberSince: string;
}

const mockUserProfile: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  avatarUrl: "https://picsum.photos/seed/userprofile/100/100",
  address: {
    street: "123 Health St",
    city: "Wellnessville",
    state: "CA",
    zip: "90210",
    country: "USA",
  },
  medicalSummary: "Generally healthy. Allergic to penicillin. Annual check-ups are up to date.",
  memberSince: "2023-01-15",
};

// Zod schema for profile validation
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name cannot exceed 50 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number seems too short.").max(20, "Phone number seems too long."),
  address: z.object({
    street: z.string().min(3, "Street address seems too short.").max(100),
    city: z.string().min(2, "City name seems too short.").max(50),
    state: z.string().min(2, "State seems too short.").max(50),
    zip: z.string().min(3, "ZIP code seems too short.").max(10),
    country: z.string().min(2, "Country name seems too short.").max(50),
  }),
  medicalSummary: z.string().max(500, "Medical summary cannot exceed 500 characters.").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState<UserProfile>(mockUserProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: { ...profileData.address },
      medicalSummary: profileData.medicalSummary,
    },
    mode: "onChange", // Validate on change when editing
  });

  React.useEffect(() => {
    // Reset form when profileData changes (e.g. after save or cancel)
    // or when toggling edit mode.
    form.reset({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      address: { ...profileData.address },
      medicalSummary: profileData.medicalSummary,
    });
  }, [profileData, isEditing, form]);


  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) { // Was editing, now viewing (Cancel)
        form.reset(profileData); // Reset form to original data
    }
    // If switching to edit, useEffect will reset form with current profileData
  };

  const onSubmit = (data: ProfileFormValues) => {
    // Simulate saving data
    console.log("Saving profile data:", data);
    const updatedProfile: UserProfile = {
      ...profileData, // Keep memberSince and avatarUrl
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: { ...data.address },
      medicalSummary: data.medicalSummary || "",
    };
    setProfileData(updatedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={form.handleSubmit(onSubmit)} variant="default">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={handleToggleEdit} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleToggleEdit}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border">
                  <AvatarImage src={profileData.avatarUrl} alt={profileData.name} data-ai-hint="person avatar" />
                  <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                  <CardDescription>Member since: {new Date(profileData.memberSince).toLocaleDateString()}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <Separator />

              {/* Personal Information */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} readOnly={!isEditing} className="mt-1" />
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
                          <Input type="email" {...field} readOnly={!isEditing} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} readOnly={!isEditing} className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              {/* Address Information */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Address</h2>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{profileData.address.street}, {profileData.address.city}, {profileData.address.state} {profileData.address.zip}, {profileData.address.country}</span>
                    </div>
                  </div>
                )}
              </section>

              <Separator />

              {/* Medical Summary */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Medical Summary</h2>
                {isEditing ? (
                   <FormField
                    control={form.control}
                    name="medicalSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea {...field} className="min-h-[100px]" placeholder="Enter a brief medical summary..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="p-4 bg-muted/50 rounded-md border">
                    <div className="flex items-start text-sm">
                      <ShieldAlert className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground whitespace-pre-wrap">{profileData.medicalSummary || "No medical summary provided."}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">This is a brief summary. For detailed information, please consult your records or speak with a healthcare provider.</p>
                  </div>
                )}
              </section>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <p className="text-xs text-muted-foreground">
                For any changes to your critical medical information, please contact support or schedule a consultation.
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

    