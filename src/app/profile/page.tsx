
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { User, Edit3, MapPin, Phone, Mail, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const mockUserProfile = {
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

export default function ProfilePage() {
  const { toast } = useToast();

  const handleEditProfile = () => {
    toast({
      title: "Feature Placeholder",
      description: "Editing profile functionality is not yet implemented.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>
        <Button onClick={handleEditProfile}>
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border">
              <AvatarImage src={mockUserProfile.avatarUrl} alt={mockUserProfile.name} data-ai-hint="person avatar" />
              <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{mockUserProfile.name}</CardTitle>
              <CardDescription>Member since: {new Date(mockUserProfile.memberSince).toLocaleDateString()}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <Separator />

          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={mockUserProfile.name} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={mockUserProfile.email} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={mockUserProfile.phone} readOnly className="mt-1" />
              </div>
            </div>
          </section>

          <Separator />

          {/* Address Information */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Address</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{mockUserProfile.address.street}, {mockUserProfile.address.city}, {mockUserProfile.address.state} {mockUserProfile.address.zip}, {mockUserProfile.address.country}</span>
                </div>
            </div>
             {/* In a real app, you'd have input fields for address if editable */}
          </section>

          <Separator />

          {/* Medical Summary */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Medical Summary</h2>
             <div className="p-4 bg-muted/50 rounded-md border">
                <div className="flex items-start text-sm">
                    <ShieldAlert className="mr-3 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{mockUserProfile.medicalSummary}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This is a brief summary. For detailed information, please consult your records or speak with a healthcare provider.</p>
            </div>
          </section>
          
        </CardContent>
        <CardFooter className="border-t pt-6">
            <p className="text-xs text-muted-foreground">
                For any changes to your critical medical information, please contact support or schedule a consultation.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
