
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <p className="text-muted-foreground">View and manage your profile information.</p>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
            <User className="w-12 h-12 mb-4" />
            <p>The profile page is currently under development.</p>
            <p>You'll soon be able to view and edit your details here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
