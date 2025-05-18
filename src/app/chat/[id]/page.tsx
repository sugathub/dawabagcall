
"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MessageSquareOff } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: string;
}

interface ChatSessionDetails {
  id: string;
  doctorName: string;
  doctorAvatarSeed: string;
  userName: string; // Assuming a consistent user for mock data
  userAvatarSeed: string;
  messages: ChatMessage[];
}

// Mock data - In a real app, this would come from a backend
const mockUser = {
  name: "Alex Johnson", // From profile page
  avatarSeed: "userprofile", // From profile page
};

const mockDetailedChatData: Record<string, ChatSessionDetails> = {
  "1": {
    id: "1",
    doctorName: "Dr. Evelyn Reed",
    doctorAvatarSeed: "avatar2",
    userName: mockUser.name,
    userAvatarSeed: mockUser.avatarSeed,
    messages: [
      { id: "m1-1", sender: "user", text: "Hello Dr. Reed, I've been feeling a bit tired lately.", timestamp: "May 10, 9:00 AM" },
      { id: "m1-2", sender: "doctor", text: "Hello Alex, thanks for reaching out. Can you tell me more about your symptoms?", timestamp: "May 10, 9:01 AM" },
      { id: "m1-3", sender: "user", text: "It's mostly fatigue and occasional headaches. Nothing too severe, but persistent.", timestamp: "May 10, 9:03 AM" },
      { id: "m1-4", sender: "doctor", text: "I see. Let's discuss this further. Have you noticed any other changes?", timestamp: "May 10, 9:04 AM" },
      { id: "m1-5", sender: "user", text: "Thank you doctor! Now I feel good.", timestamp: "May 10, 9:05 AM" },
    ],
  },
  "2": {
    id: "2",
    doctorName: "Dr. Anya Sharma",
    doctorAvatarSeed: "avatar3",
    userName: mockUser.name,
    userAvatarSeed: mockUser.avatarSeed,
    messages: [
      { id: "m2-1", sender: "user", text: "Hi Dr. Sharma, I need a refill for my prescription.", timestamp: "May 8, 2:30 PM" },
      { id: "m2-2", sender: "doctor", text: "Certainly, Alex. Please remember to take your medication as prescribed. I've sent the refill to your pharmacy.", timestamp: "May 8, 2:31 PM" },
      { id: "m2-3", sender: "user", text: "Thank you so much!", timestamp: "May 8, 2:32 PM" },
    ],
  },
  "3": {
    id: "3",
    doctorName: "Dr. Ben Carter",
    doctorAvatarSeed: "avatar4",
    userName: mockUser.name,
    userAvatarSeed: mockUser.avatarSeed,
    messages: [
      { id: "m3-1", sender: "user", text: "Dr. Carter, I'm concerned about my child's persistent cough.", timestamp: "May 5, 11:00 AM" },
      { id: "m3-2", sender: "doctor", text: "Okay, Alex. Let's schedule a video call to discuss this. How about tomorrow afternoon?", timestamp: "May 5, 11:02 AM" },
      { id: "m3-3", sender: "user", text: "That works for me. We can schedule a follow-up next week.", timestamp: "May 5, 11:03 AM" },
    ],
  },
  "4": {
    id: "4",
    doctorName: "Dr. Olivia Chen",
    doctorAvatarSeed: "avatar5",
    userName: mockUser.name,
    userAvatarSeed: mockUser.avatarSeed,
    messages: [
      { id: "m4-1", sender: "user", text: "Good morning, Dr. Chen. Just checking in on my recent test results.", timestamp: "May 1, 10:15 AM" },
      { id: "m4-2", sender: "doctor", text: "Morning Alex! Your test results are back and look normal. Everything seems fine.", timestamp: "May 1, 10:17 AM" },
      { id: "m4-3", sender: "user", text: "That's great news, thank you!", timestamp: "May 1, 10:18 AM" },
    ],
  },
};


export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = typeof params.id === 'string' ? params.id : undefined;
  const chatSession = chatId ? mockDetailedChatData[chatId] : undefined;

  if (!chatSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <MessageSquareOff className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Chat Not Found</h1>
        <p className="text-muted-foreground">The chat session you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push('/chat')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chat History
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]"> {/* Adjust height to fill available space */}
      <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
        <CardHeader className="border-b p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push('/chat')}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Chat History</span>
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://picsum.photos/seed/${chatSession.doctorAvatarSeed}/40/40`} alt={chatSession.doctorName} data-ai-hint="doctor avatar" />
              <AvatarFallback>{chatSession.doctorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{chatSession.doctorName}</CardTitle>
              {/* <p className="text-xs text-muted-foreground">Online</p> Could add status if needed */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
           <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {chatSession.messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'doctor' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://picsum.photos/seed/${chatSession.doctorAvatarSeed}/32/32`} alt={chatSession.doctorName} data-ai-hint="doctor avatar small" />
                      <AvatarFallback>{chatSession.doctorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-3 shadow-sm text-sm
                      ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1.5 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://picsum.photos/seed/${chatSession.userAvatarSeed}/32/32`} alt={chatSession.userName} data-ai-hint="user avatar small" />
                      <AvatarFallback>{chatSession.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        {/* No chat input for history view */}
      </Card>
    </div>
  );
}
