
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Clock, Circle, Send, Smile, Paperclip, MoreHorizontal, MessageSquare, ScreenShare } from "lucide-react"; // Added ScreenShare
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast"; // Import useToast

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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null); // Track camera permission

  const localVideoRef = useRef<HTMLVideoElement>(null); // User's video (PiP)
  const remoteVideoRef = useRef<HTMLVideoElement>(null); // Doctor's video (Main)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast(); // Initialize useToast

  // Get Camera Permissions and Streams
   useEffect(() => {
    const getMedia = async () => {
        console.log("Attempting to access media devices...");
        setHasCameraPermission(null); // Reset permission state on attempt
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            // Assign user's stream to the local video element (PiP)
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
            console.log("Local media stream acquired.");
            setCallStatus("connected"); // Move to connected only after getting media

            // Simulate doctor's video (remote) - Assign placeholder stream to the remote video element (Main)
            if (remoteVideoRef.current) {
                // In a real app, this would be the WebRTC remote stream
                const canvas = document.createElement('canvas');
                canvas.width = 640;
                canvas.height = 480;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = '#e2e8f0'; // bg-muted
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#64748b'; // text-muted-foreground
                    ctx.font = '20px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Doctor Video Feed', canvas.width / 2, canvas.height / 2);
                }
                // @ts-ignore
                const placeholderStream = canvas.captureStream ? canvas.captureStream() : null;
                if (placeholderStream) remoteVideoRef.current.srcObject = placeholderStream;
                console.log("Simulating remote media stream.");
            }

        } catch (err) {
            console.error("Error accessing media devices:", err);
            setHasCameraPermission(false);
            setCallStatus("disconnected"); // Or a specific 'media_error' state
            toast({
              variant: 'destructive',
              title: 'Media Access Error',
              description: 'Could not access camera or microphone. Please check permissions.',
            });
        }
    };

    // Only attempt to get media if connecting
    if (callStatus === 'connecting') {
       getMedia();
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
       console.log("Media streams stopped.");
    }

    // Cleanup function to stop tracks when component unmounts or call ends
    return () => {
       if (localVideoRef.current && localVideoRef.current.srcObject) {
           (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
           localVideoRef.current.srcObject = null;
           console.log("Local media stream stopped on cleanup.");
       }
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
           // If it's a placeholder stream, it might not have tracks or need stopping in the same way
            try { // Add try-catch for safety
                 (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                 remoteVideoRef.current.srcObject = null;
                 console.log("Remote media stream stopped on cleanup.");
            } catch (error) {
                console.warn("Could not stop remote stream tracks on cleanup:", error);
            }
       }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus]); // Rerun when callStatus changes

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


  const handleMuteToggle = () => {
    if (callStatus !== "connected") return;
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    console.log(newMutedState ? "Muting" : "Unmuting");
     // Mute/unmute the user's local stream (in PiP)
     if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach(track => {
         track.enabled = !newMutedState; // Enable track if NOT muted
      });
    }
  };

  const handleVideoToggle = () => {
    if (callStatus !== "connected") return;
    const newVideoOffState = !isVideoOff;
    setIsVideoOff(newVideoOffState);
    console.log(newVideoOffState ? "Turning video off" : "Turning video on");
     // Enable/disable the user's local video track (in PiP)
     if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach(track => {
         track.enabled = !newVideoOffState; // Enable track if video is ON
      });
    }
  };

  const handleEndCall = () => {
    setCallStatus("disconnected");
    setShowCallEndedAlert(true);
    console.log("Ending call");
     // Stop timer interval immediately
     if (timerIntervalRef.current) {
       clearInterval(timerIntervalRef.current);
     }
     // Stream cleanup is handled by the useEffect hook watching callStatus
  };

   const handleSendMessage = () => {
    if (newMessage.trim() === "" || callStatus !== "connected") return;

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
          id: messages.length + 2, // Note: this might cause issues if multiple messages are sent quickly
          sender: mockDoctor.name,
          senderAvatar: mockDoctor.avatar,
          text: "Okay, understood.", // Simple reply
          timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        };
         setMessages(prev => [...prev, replyMsg]); // Use functional update
    }, 1500);
  };

  // --- Placeholder Handlers for Other Buttons ---
  const handleScreenShare = () => {
    if (callStatus !== "connected") return;
    console.log("Screen Share button clicked - Feature not implemented.");
    toast({ title: "Info", description: "Screen sharing is not yet implemented." });
  };

  const handleToggleChat = () => {
    // In a real app, this might toggle chat visibility on mobile
    console.log("Chat button clicked - Action not implemented for current layout.");
    toast({ title: "Info", description: "Chat panel is always visible in this layout." });
  };

  const handleMoreOptions = () => {
    if (callStatus !== "connected") return;
    console.log("More Options button clicked - Feature not implemented.");
    toast({ title: "Info", description: "More options are not yet available." });
  };

    const handleAttachFile = () => {
    if (callStatus !== "connected") return;
    console.log("Attach file button clicked - Feature not implemented.");
    toast({ title: "Info", description: "File attachment is not yet implemented." });
    // Potential future implementation: trigger a hidden file input
    // document.getElementById('fileInput')?.click();
  };

  const handleEmoji = () => {
    if (callStatus !== "connected") return;
    console.log("Emoji button clicked - Feature not implemented.");
    toast({ title: "Info", description: "Emoji picker is not yet available." });
  };
  // --- End Placeholder Handlers ---


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
             <h2 className="text-lg font-semibold">{mockDoctor.name} - {mockDoctor.specialization}</h2>
             <p className="text-sm text-muted-foreground">Video Consultation</p>
           </div>
           {callStatus === 'connected' && (
             <div className="flex items-center space-x-2 bg-destructive/10 text-destructive px-2 py-1 rounded-md text-sm font-medium">
               <Circle className="h-2 w-2 fill-current animate-pulse" /> {/* Added pulse */}
              <span>{formatDuration(callDuration)}</span>
             </div>
           )}
            {callStatus === 'connecting' && (
             <div className="flex items-center space-x-2 text-muted-foreground px-2 py-1 rounded-md text-sm font-medium">
               <Circle className="h-2 w-2 fill-current" />
              <span>Connecting...</span>
             </div>
           )}
            {callStatus === 'disconnected' && !showCallEndedAlert && ( // Show if disconnected but alert not shown
             <div className="flex items-center space-x-2 text-muted-foreground px-2 py-1 rounded-md text-sm font-medium">
               <Circle className="h-2 w-2 fill-current" />
              <span>Call Ended</span>
             </div>
           )}
         </div>

        {/* Video Feeds & Status */}
        <div className="flex-1 bg-muted relative flex items-center justify-center overflow-hidden">
          {/* Always render video tags to prevent race conditions */}
          {/* Main Video (Doctor - remote) */}
          <video
             ref={remoteVideoRef}
             autoPlay
             playsInline
             className={`w-full h-full object-cover transition-opacity duration-300 ${callStatus === 'connected' ? 'opacity-100' : 'opacity-0'}`}
           />
            {/* Picture-in-Picture (User - local) */}
            <video
             ref={localVideoRef}
             autoPlay
             playsInline
             muted // Mute local playback to avoid echo
             className={`absolute bottom-4 right-4 w-40 h-30 rounded-md overflow-hidden border-2 border-white shadow-md bg-secondary object-cover transition-opacity duration-300 ${callStatus === 'connected' && hasCameraPermission ? 'opacity-100' : 'opacity-0'}`}
           />

          {/* Status Overlays */}
          {callStatus === "connecting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-foreground">
              <Skeleton className="w-16 h-16 rounded-full mb-4" />
              <p>Connecting to {mockDoctor.name}...</p>
              {hasCameraPermission === null && <p className="text-sm text-muted-foreground mt-2">Requesting camera/mic access...</p>}
            </div>
          )}
           {callStatus === "connected" && !hasCameraPermission && (
              <Alert variant="destructive" className="absolute top-4 left-4 right-4 max-w-md mx-auto z-10">
                  <VideoOff className="h-4 w-4" />
                  <AlertTitle>Camera/Mic Access Denied</AlertTitle>
                  <AlertDescription>
                    Please allow access to your camera and microphone in browser settings to start the video call.
                  </AlertDescription>
              </Alert>
           )}
           {callStatus === "connected" && hasCameraPermission && (
             <>
               {/* Name Tag for Main Video (Doctor) */}
               <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center">
                 <User className="w-4 h-4 mr-1" />
                 {mockDoctor.name}
               </div>

               {/* Picture-in-Picture (You - local) Name Tag */}
               <div className="absolute bottom-4 right-4 w-40 h-30"> {/* Container for PiP video and tag */}
                  {/* Show overlay if local video is off */}
                 {isVideoOff && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white rounded-md">
                        <VideoOff className="w-10 h-10 mb-1" />
                        <p className="text-xs">Video Off</p>
                    </div>
                 )}
                  {/* Name Tag for PiP */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-0.5 rounded text-xs flex items-center whitespace-nowrap">
                    {isMuted ? <MicOff className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1" />}
                    You
                  </div>
               </div>

             </>
           )}
           {callStatus === "disconnected" && showCallEndedAlert && ( // Only show when alert is active
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-foreground">
               <PhoneOff className="w-16 h-16 mx-auto mb-4 text-destructive" />
               <p>Call ended</p>
             </div>
           )}
        </div>

        {/* Call Controls */}
        <div className="bg-background border-t p-3 flex items-center justify-center space-x-2 sm:space-x-3">
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="icon"
              onClick={handleMuteToggle}
              disabled={callStatus !== "connected"}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button
              variant={isVideoOff ? "destructive" : "outline"}
              size="icon"
              onClick={handleVideoToggle}
              disabled={callStatus !== "connected"}
              className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
              aria-label={isVideoOff ? "Turn video on" : "Turn video off"}
            >
              {isVideoOff ? <VideoOff /> : <Video />}
            </Button>
             <Button variant="outline" size="icon" disabled={callStatus !== "connected"} onClick={handleScreenShare} className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground hover:bg-primary/90">
               <ScreenShare /> {/* Use ScreenShare icon */}
               <span className="sr-only">Screen Share</span>
            </Button>
             <Button variant="outline" size="icon" disabled={callStatus !== "connected"} onClick={handleToggleChat} className="rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:hidden"> {/* Hide on large screens */}
               <MessageSquare />
                <span className="sr-only">Toggle Chat</span>
            </Button>
            <Button variant="outline" size="icon" disabled={callStatus !== "connected"} onClick={handleMoreOptions} className="rounded-full w-10 h-10 sm:w-12 sm:h-12">
               <MoreHorizontal />
               <span className="sr-only">More Options</span>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
              disabled={callStatus === "disconnected"}
              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-red-600 hover:bg-red-700" // Slightly larger red button
              aria-label="End call"
            >
              <PhoneOff />
            </Button>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="w-full lg:w-80 xl:w-96 shadow-lg flex-col border hidden lg:flex"> {/* Hide on small screens, flex on large */}
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden"> {/* Add overflow-hidden */}
            <ScrollArea className="h-full p-4"> {/* Let ScrollArea handle height */}
                <div className="space-y-4">
                    {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === mockUser.name ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender !== mockUser.name && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={msg.senderAvatar} alt={msg.sender} data-ai-hint="person avatar" />
                                <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                         <div className={`max-w-[75%] rounded-lg p-3 shadow-sm ${msg.sender === mockUser.name ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
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
            <div className="relative flex items-center gap-2"> {/* Use flex for alignment */}
                {/* Hidden file input for attachment */}
                <input type="file" id="fileInput" className="hidden" />
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={callStatus !== "connected"} onClick={handleAttachFile}>
                    <Paperclip className="h-4 w-4" />
                     <span className="sr-only">Attach file</span>
                </Button>
                <Input
                type="text"
                placeholder="Type a message..."
                className="flex-1 pr-16" // Adjust padding for buttons inside
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={callStatus !== "connected"}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={callStatus !== "connected"} onClick={handleEmoji}>
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
            <Alert variant="default" className="fixed bottom-4 right-4 w-auto z-50 shadow-lg border-green-500 bg-green-50 dark:bg-green-900/30">
                 <Circle className="h-4 w-4 text-green-600 fill-current" /> {/* Use Circle for visual cue */}
                <AlertTitle className="text-green-800 dark:text-green-300">Call Ended</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">The video call has finished. Duration: {formatDuration(callDuration)}</AlertDescription>
                <Button variant="outline" size="sm" className="mt-2 border-green-300 text-green-800 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-800/50" onClick={() => setShowCallEndedAlert(false)}>Close</Button>
            </Alert>
        )}
    </div>
  );
}
