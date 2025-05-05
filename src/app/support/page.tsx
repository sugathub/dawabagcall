
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headset } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Support</h1>
      <p className="text-muted-foreground">Get help and support.</p>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
            <Headset className="w-12 h-12 mb-4" />
            <p>The support page is currently under development.</p>
            <p>You'll soon find resources and contact information here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
