
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Clock, Circle, Send, Smile, Paperclip, MoreHorizontal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock doctor data
const mockDoctor = {
  name: "Dr. Evelyn Reed",
  specialization: "Cardiology",
  avatar: "https://picsum.photos/seed/avatar2/40/40", // Placeholder
};

// Mock user data (replace with actual user data)
const mockUser = {
    name: "Steve",
    avatar: "https://picsum.photos/seed/avatar1/40/40", // Placeholder
};

// Mock chat messages
const initialMessages = [
    { id: 1, sender: mockUser.name, senderAvatar: mockUser.avatar, text: "Hello Doctor!", timestamp: "6:30 PM" },
    { id: 2, sender: mockDoctor.name, senderAvatar: mockDoctor.avatar, text: `Hi ${mockUser.name}, how can I help you today?`, timestamp: "6:31 PM" },
     { id: 3, sender: mockDoctor.name, senderAvatar: mockDoctor.avatar, text: `Steve you are doing it incorrectly\n1. Breathe in for 4 counts.\n2. Hold for 4 counts.\n3. Exhale for 4 counts.\n\nRepeat this for a couple of minutes`, timestamp: "6:32 PM" },
     { id: 4, sender: mockUser.name, senderAvatar: mockUser.avatar, text: `Thank you doctor!\nNow I feel good.`, timestamp: "6:32 PM" },
];


export default function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [callDuration, setCallDuration] = useState(16 * 60); // Start from 16:00 as per image
  const [showCallEndedAlert, setShowCallEndedAlert] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate connection and start timer
  useEffect(() => {
    const connectTimeout = setTimeout(() => {
      setCallStatus("connected");
    }, 2000); // Simulate connection delay

    return () => clearTimeout(connectTimeout);
  }, []);

  // Start call timer when connected
  useEffect(() => {
    if (callStatus === "connected") {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [callStatus]);

   // Simulate getting video streams
   useEffect(() => {
    if (callStatus === 'connected') {
      console.log("Attempting to access media devices...");
       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          console.log("Local media stream acquired.");

           // Simulate doctor's video (remote) - Using a placeholder image for now
           if (remoteVideoRef.current) {
               // In a real app, this would be the WebRTC remote stream
               // For demo, we just show a static image or simple canvas
                const canvas = document.createElement('canvas');
                canvas.width = 640; // Match aspect ratio
                canvas.height = 480;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#e2e8f0'; // bg-muted color
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#64748b'; // text-muted-foreground
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Doctor Video Feed', canvas.width / 2, canvas.height / 2);
                }
                 // @ts-ignore
                const placeholderStream = canvas.captureStream ? canvas.captureStream() : null;
                if (placeholderStream) remoteVideoRef.current.srcObject = placeholderStream;
           }
           console.log("Simulating remote media stream.");
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
          // Display error to user - using Alert component
           setCallStatus("disconnected"); // Or a specific 'media_error' state
           // Maybe add a specific error message state here
        });
    } else if (callStatus === 'disconnected') {
       // Clean up streams
       const stopTracks = (videoRef: React.RefObject<HTMLVideoElement>) => {
           if (videoRef.current && videoRef.current.srcObject) {
             (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
             videoRef.current.srcObject = null;
           }
       };
       stopTracks(localVideoRef);
       stopTracks(remoteVideoRef);
    }
   }, [callStatus]);


  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    console.log(isMuted ? "Unmuting" : "Muting");
     if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach(track => {
         track.enabled = isMuted;
      });
    }
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);
    console.log(isVideoOff ? "Turning video on" : "Turning video off");
     if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach(track => {
         track.enabled = isVideoOff;
      });
    }
  };

  const handleEndCall = () => {
    setCallStatus("disconnected");
    setShowCallEndedAlert(true);
    console.log("Ending call");
  };

   const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const now = new Date();
    const newMsg = {
      id: messages.length + 1,
      sender: mockUser.name, // Assuming user sends message
      senderAvatar: mockUser.avatar,
      text: newMessage,
      timestamp: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate doctor's reply after a short delay
    setTimeout(() => {
        const replyMsg = {
          id: messages.length + 2,
          sender: mockDoctor.name,
          senderAvatar: mockDoctor.avatar,
          text: "Okay, understood.", // Simple reply
          timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        };
         setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8rem)]"> {/* Adjusted height calculation */}

      {/* Video Consultation Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg shadow-lg overflow-hidden border">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
           <div>
             <h2 className="text-lg font-semibold">Steve's Video Consultation</h2>
             <p className="text-sm text-muted-foreground">12 April 6:30 PM</p>
           </div>
           <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-2 py-1 rounded-md text-sm font-medium">
             <Circle className="h-2 w-2 fill-current" />
            <span>{formatDuration(callDuration)}</span>
           </div>
         </div>

        {/* Video Feeds */}
        <div className="flex-1 bg-muted relative flex items-center justify-center">
          {callStatus === "connecting" && <Skeleton className="absolute inset-0" />}
          {callStatus === "connected" && (
             <>
             {/* Main Video (Patient - local) */}
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
               {/* Picture-in-Picture (Doctor - remote) */}
               <div className="absolute bottom-4 right-4 w-40 h-30 rounded-md overflow-hidden border-2 border-white shadow-md bg-pink-500"> {/* Pink background as per image */}
                 <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {/* Name Tag for PiP */}
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 rounded text-xs flex items-center">
                    <Mic className="w-3 h-3 mr-1" /> You
                  </div>
               </div>
                {/* Name Tag for Main Video */}
               <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                 <Mic className="w-4 h-4 mr-1" /> Steve
               </div>
             </>
          )}
           {callStatus === "disconnected" && (
            <div className="text-center text-muted-foreground">
               <PhoneOff className="w-16 h-16 mx-auto mb-4" />
               <p>Call ended</p>
             </div>
           )}
        </div>

        {/* Call Controls */}
        <div className="bg-background border-t p-3 flex items-center justify-center space-x-3">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              onClick={handleMuteToggle}
              disabled={callStatus !== "connected"}
              className="rounded-full w-12 h-12"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button
              variant={isVideoOff ? "destructive" : "outline"}
              size="icon"
              onClick={handleVideoToggle}
              disabled={callStatus !== "connected"}
              className="rounded-full w-12 h-12"
              aria-label={isVideoOff ? "Turn video on" : "Turn video off"}
            >
              {isVideoOff ? <VideoOff /> : <Video />}
            </Button>
            {/* Placeholder buttons based on image */}
             <Button variant="outline" size="icon" disabled={callStatus !== "connected"} className="rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90">
               <User /> {/* Assuming screen share or similar */}
               <span className="sr-only">Screen Share</span>
            </Button>
             <Button variant="outline" size="icon" disabled={callStatus !== "connected"} className="rounded-full w-12 h-12">
               <MessageSquare /> {/* Assuming chat toggle or similar */}
                <span className="sr-only">Chat</span>
            </Button>
            <Button variant="outline" size="icon" disabled={callStatus !== "connected"} className="rounded-full w-12 h-12">
               <MoreHorizontal /> {/* More options */}
               <span className="sr-only">More Options</span>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
              disabled={callStatus === "disconnected"}
              className="rounded-full w-14 h-14 bg-red-600 hover:bg-red-700" // Slightly larger red button
              aria-label="End call"
            >
              <PhoneOff />
            </Button>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="w-full lg:w-80 xl:w-96 shadow-lg flex flex-col border"> {/* Adjusted width */}
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[calc(100%-4rem)] p-4"> {/* Adjust height accounting for input */}
                <div className="space-y-4">
                    {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === mockUser.name ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender !== mockUser.name && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.senderAvatar} alt={msg.sender} data-ai-hint="person avatar" />
                                <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                         <div className={`max-w-[75%] rounded-lg p-3 ${msg.sender === mockUser.name ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
                           <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                           <p className={`text-xs mt-1 ${msg.sender === mockUser.name ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                                {msg.timestamp} {msg.sender === mockUser.name && '✓'} {/* Add checkmark for user sent */}
                           </p>
                         </div>
                         {msg.sender === mockUser.name && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.senderAvatar} alt={msg.sender} data-ai-hint="person avatar"/>
                                <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                    ))}
                </div>
             </ScrollArea>
        </CardContent>
         {/* Chat Input */}
        <div className="border-t p-3 bg-background">
            <div className="relative">
                <Input
                type="text"
                placeholder="Type a message..."
                className="pr-28 pl-10" // Make space for icons
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={callStatus !== "connected"}
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={callStatus !== "connected"}>
                        <Paperclip className="h-4 w-4" />
                         <span className="sr-only">Attach file</span>
                    </Button>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={callStatus !== "connected"}>
                        <Smile className="h-4 w-4" />
                        <span className="sr-only">Emoji</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSendMessage} disabled={callStatus !== "connected" || newMessage.trim() === ""}>
                        <Send className="h-4 w-4" />
                         <span className="sr-only">Send</span>
                    </Button>
                </div>
             </div>
        </div>
      </Card>

       {/* Call Ended Alert - Overlay or separate modal */}
        {showCallEndedAlert && (
            <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto z-50">
                <AlertTitle>Call Ended</AlertTitle>
                <AlertDescription>The video call has finished.</AlertDescription>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowCallEndedAlert(false)}>Close</Button>
            </Alert>
        )}
    </div>
  );
}
