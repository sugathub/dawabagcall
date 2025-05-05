"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Mock doctor data
const mockDoctor = {
  name: "Dr. Evelyn Reed",
  specialization: "Cardiology",
};

export default function VideoCallPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [showCallEndedAlert, setShowCallEndedAlert] = useState(false);

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
      // In a real app, you'd use WebRTC APIs (getUserMedia, RTCPeerConnection) here
      // For now, we'll just log and show placeholders
      console.log("Attempting to access media devices...");
       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          // In a real app, send this stream to the peer
          console.log("Local media stream acquired.");
          // Simulate receiving remote stream
           if (remoteVideoRef.current) {
               // Example: Create a placeholder media stream
              const canvas = document.createElement('canvas');
              canvas.width = 320;
              canvas.height = 240;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = '#333';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                 ctx.fillStyle = '#fff';
                 ctx.font = '14px Arial';
                 ctx.fillText('Remote Video Placeholder', 10, 20);
              }
              // @ts-ignore CaptureStream is experimental but available in modern browsers
              const placeholderStream = canvas.captureStream ? canvas.captureStream() : null;
               if (placeholderStream) remoteVideoRef.current.srcObject = placeholderStream;
           }
           console.log("Simulating remote media stream.");
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
          setCallStatus("disconnected"); // Or handle error appropriately
          // Show error to user
        });
    } else if (callStatus === 'disconnected') {
       // Clean up streams
       if (localVideoRef.current && localVideoRef.current.srcObject) {
         (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
         localVideoRef.current.srcObject = null;
       }
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
          (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
          remoteVideoRef.current.srcObject = null;
        }
    }
   }, [callStatus]);


  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    // Add logic to actually mute/unmute audio stream
    console.log(isMuted ? "Unmuting" : "Muting");
     if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach(track => {
         track.enabled = isMuted; // Toggle enabled state
      });
    }
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);
    // Add logic to actually turn video on/off
    console.log(isVideoOff ? "Turning video on" : "Turning video off");
     if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach(track => {
         track.enabled = isVideoOff; // Toggle enabled state
      });
    }
  };

  const handleEndCall = () => {
    setCallStatus("disconnected");
    setShowCallEndedAlert(true);
    // Add logic to properly disconnect the call (close PeerConnection, etc.)
    console.log("Ending call");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col bg-card rounded-lg shadow-lg overflow-hidden">
        {/* Remote Video */}
        <div className="flex-1 bg-muted relative flex items-center justify-center">
          {callStatus === "connecting" && <Skeleton className="absolute inset-0" />}
           {callStatus === "connected" && (
             <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          )}
           {callStatus === "disconnected" && (
            <div className="text-center text-muted-foreground">
               <PhoneOff className="w-16 h-16 mx-auto mb-4" />
               <p>Call ended</p>
             </div>
           )}
           <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm flex items-center">
             <User className="w-4 h-4 mr-2" />
            {mockDoctor.name} - {mockDoctor.specialization}
           </div>
        </div>

        {/* Local Video Preview & Controls */}
        <div className="bg-background border-t p-4 flex items-center justify-between relative">
          {/* Local Video */}
          <div className="absolute bottom-20 right-4 lg:static lg:bottom-auto lg:right-auto w-32 h-24 lg:w-40 lg:h-30 bg-muted rounded-md overflow-hidden border shadow-md">
             {callStatus !== "disconnected" ? (
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                You
              </div>
            )}
          </div>

           {/* Spacer to push controls */}
          <div className="flex-1"></div>

           {/* Call Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleMuteToggle}
              disabled={callStatus !== "connected"}
              className="rounded-full w-12 h-12"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleVideoToggle}
              disabled={callStatus !== "connected"}
              className="rounded-full w-12 h-12"
              aria-label={isVideoOff ? "Turn video on" : "Turn video off"}
            >
              {isVideoOff ? <VideoOff /> : <Video />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
              disabled={callStatus === "disconnected"}
              className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
              aria-label="End call"
            >
              <PhoneOff />
            </Button>
          </div>

           {/* Spacer */}
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Sidebar/Info Panel */}
      <Card className="w-full lg:w-72 shadow-lg lg:h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Call Information</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div>
             <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium">{mockDoctor.name}</span>
             </div>
             <p className="text-sm text-muted-foreground mb-4">{mockDoctor.specialization}</p>
             <div className="flex items-center space-x-2 text-sm">
               <Clock className="w-4 h-4 text-muted-foreground" />
               <span>Duration: {formatDuration(callDuration)}</span>
             </div>
          </div>

          <div className="mt-6">
             {callStatus === "connecting" && (
              <Alert>
                <AlertTitle>Connecting...</AlertTitle>
                <AlertDescription>Please wait while we connect your call.</AlertDescription>
              </Alert>
            )}
             {callStatus === "connected" && (
              <Alert variant="default" className="bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700">
                <AlertTitle className="text-green-800 dark:text-green-200">Connected</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">Your call is in progress.</AlertDescription>
              </Alert>
            )}
            {showCallEndedAlert && (
              <Alert variant="destructive">
                 <AlertTitle>Call Ended</AlertTitle>
                <AlertDescription>The video call has finished.</AlertDescription>
              </Alert>
            )}
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
