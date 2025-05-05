
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
      <p className="text-muted-foreground">Manage your upcoming appointments.</p>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
            <Calendar className="w-12 h-12 mb-4" />
            <p>The scheduling feature is currently under development.</p>
            <p>You'll soon be able to view and manage your appointments here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
