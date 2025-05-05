
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function FaqPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
      <p className="text-muted-foreground">Frequently Asked Questions.</p>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
            <HelpCircle className="w-12 h-12 mb-4" />
            <p>The FAQ page is currently under development.</p>
            <p>Common questions and answers will be available here soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
