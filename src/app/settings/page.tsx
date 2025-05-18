
"use client"; // Mark as client component

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { Bell, Palette, Languages, UserCog, ShieldCheck } from "lucide-react"; // Icons

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Mock states for switches - in a real app, these would come from user preferences
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [smsReminders, setSmsReminders] = React.useState(true);

  const handlePlaceholderAction = (actionName: string) => {
    toast({
      title: "Feature Placeholder",
      description: `${actionName} functionality is not yet implemented.`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application and account preferences.</p>
      </div>

      {/* Notification Settings */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Bell className="mr-3 h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>Control how you receive notifications from us.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
            <div>
              <Label htmlFor="email-notifications" className="font-medium text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates and alerts via email.</p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              aria-label="Toggle email notifications"
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
            <div>
              <Label htmlFor="push-notifications" className="font-medium text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Get real-time alerts on your device.</p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
              aria-label="Toggle push notifications"
            />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
            <div>
              <Label htmlFor="sms-reminders" className="font-medium text-base">SMS Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive appointment reminders via SMS.</p>
            </div>
            <Switch
              id="sms-reminders"
              checked={smsReminders}
              onCheckedChange={setSmsReminders}
              aria-label="Toggle SMS reminders"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Palette className="mr-3 h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="theme-select" className="font-medium text-base">Theme</Label>
            <Select value={theme} onValueChange={(value) => setTheme(value)}>
              <SelectTrigger id="theme-select" className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Languages className="mr-3 h-5 w-5 text-primary" />
            Language & Region
          </CardTitle>
          <CardDescription>Choose your preferred language and region settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="language-select" className="font-medium text-base">Language</Label>
            <Select defaultValue="en" onValueChange={(value) => handlePlaceholderAction(`Set language to ${value}`)}>
              <SelectTrigger id="language-select" className="w-[200px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (United States)</SelectItem>
                <SelectItem value="es">Español (España) (mock)</SelectItem>
                <SelectItem value="fr">Français (France) (mock)</SelectItem>
                <SelectItem value="de">Deutsch (Deutschland) (mock)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="timezone-select" className="font-medium text-base">Timezone</Label>
            <Select defaultValue="utc" onValueChange={(value) => handlePlaceholderAction(`Set timezone to ${value}`)}>
              <SelectTrigger id="timezone-select" className="w-[280px]">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                <SelectItem value="est">EST (Eastern Standard Time) (mock)</SelectItem>
                <SelectItem value="pst">PST (Pacific Standard Time) (mock)</SelectItem>
                <SelectItem value="gmt">GMT (Greenwich Mean Time) (mock)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Management */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <UserCog className="mr-3 h-5 w-5 text-primary" />
            Account Management
          </CardTitle>
          <CardDescription>Manage your account details and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <Button variant="outline" className="w-full justify-center sm:justify-start" onClick={() => handlePlaceholderAction('Change Password')}>
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-center sm:justify-start" onClick={() => handlePlaceholderAction('Manage Subscription')}>
            Manage Subscription
          </Button>
           <Button variant="outline" className="w-full justify-center sm:justify-start" onClick={() => handlePlaceholderAction('View Payment History')}>
            Payment History
          </Button>
          <Button variant="destructive" className="w-full justify-center sm:justify-start sm:col-span-2" onClick={() => handlePlaceholderAction('Delete Account')}>
            Delete Account
          </Button>
        </CardContent>
      </Card>

       {/* Data & Privacy */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <ShieldCheck className="mr-3 h-5 w-5 text-primary" />
            Data & Privacy
          </CardTitle>
          <CardDescription>Control how your data is used and managed by our service.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
           <Button variant="link" className="p-0 h-auto text-base" onClick={() => handlePlaceholderAction('View Privacy Policy')}>
            View Privacy Policy
          </Button>
           <br />
           <Button variant="link" className="p-0 h-auto text-base" onClick={() => handlePlaceholderAction('Download Your Data')}>
            Download Your Data
          </Button>
           <br />
           <Button variant="link" className="p-0 h-auto text-base" onClick={() => handlePlaceholderAction('Manage Data Sharing Preferences')}>
            Manage Data Sharing Preferences
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
