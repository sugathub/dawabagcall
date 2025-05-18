
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ChatSession {
  id: string;
  doctorName: string;
  doctorAvatarSeed: string; // Seed for picsum.photos
  date: string;
  lastMessageSnippet: string;
  unread?: boolean;
}

// Consistent user for chat history context
const mockUser = {
  name: "Alex Johnson", // From profile page
  avatarSeed: "userprofile", // From profile page
};

const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    doctorName: "Dr. Evelyn Reed",
    doctorAvatarSeed: "avatar2",
    date: "2024-05-10",
    lastMessageSnippet: "Thank you doctor! Now I feel good.",
    unread: false,
  },
  {
    id: "2",
    doctorName: "Dr. Anya Sharma",
    doctorAvatarSeed: "avatar3",
    date: "2024-05-08",
    lastMessageSnippet: "Please remember to take your medication...",
    unread: true,
  },
  {
    id: "3",
    doctorName: "Dr. Ben Carter",
    doctorAvatarSeed: "avatar4",
    date: "2024-05-05",
    lastMessageSnippet: "We can schedule a follow-up next week.",
    unread: false,
  },
  {
    id: "4",
    doctorName: "Dr. Olivia Chen",
    doctorAvatarSeed: "avatar5",
    date: "2024-05-01",
    lastMessageSnippet: "Your test results are back and look normal.",
  },
];

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat History</h1>
          <p className="text-muted-foreground">Review your past conversations with doctors.</p>
        </div>
      </div>

      {mockChatSessions.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Past Consultations</CardTitle>
            <CardDescription>Select a conversation to view the details.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {mockChatSessions.map((session) => (
                <li key={session.id}>
                  <Link href={`/chat/${session.id}`} className="flex items-center p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage 
                          src={`https://picsum.photos/seed/${session.doctorAvatarSeed}/40/40`} 
                          alt={session.doctorName} 
                          data-ai-hint="doctor avatar"
                        />
                        <AvatarFallback>{session.doctorName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-sm md:text-base">{session.doctorName}</h3>
                          <span className="text-xs text-muted-foreground">{session.date}</span>
                        </div>
                        <p className={`text-sm ${session.unread ? 'text-foreground font-medium' : 'text-muted-foreground'} truncate`}>
                          {session.lastMessageSnippet}
                        </p>
                      </div>
                      {session.unread && (
                        <div aria-label="Unread messages" className="ml-3 w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                      <ChevronRight className="ml-3 h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Chat History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
              <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
              <p>You have no past chat conversations.</p>
              <p>Completed video consultations will appear here.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
