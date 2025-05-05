
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Chat History</h1>
      <p className="text-muted-foreground">Review your past conversations.</p>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p>The chat history feature is currently under development.</p>
            <p>You'll soon be able to access your past chat logs here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
