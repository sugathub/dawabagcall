
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Camera, Image as ImageIcon, AlertTriangle, CheckCircle2, Loader2, ScanLine } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type ScanMode = "upload" | "camera";
type ProcessingState = "idle" | "processing" | "success" | "error";

export default function PrescriptionScannerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("upload");
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();

  const stopCameraStream = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  useEffect(() => {
    // Cleanup camera stream when component unmounts or scanMode changes from camera
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream, scanMode]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setCapturedImage(null); // Clear captured image if a file is uploaded
        setProcessingState("idle");
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCameraPermission(null); // Reset while attempting
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
          setHasCameraPermission(true);
          setPreviewImage(null); // Clear file preview if camera is started
          setCapturedImage(null);
          setProcessingState("idle");
          setAnalysisResult(null);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        setIsCameraActive(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description: "Please enable camera permissions in your browser settings.",
        });
      }
    } else {
        toast({ variant: "destructive", title: "Unsupported", description: "Your browser does not support camera access."});
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCameraStream(); // Stop camera after capture
        setProcessingState("idle");
        setAnalysisResult(null);
      }
    } else {
        toast({ title: "Camera Not Ready", description: "Please wait for the camera feed to load.", variant: "default" });
    }
  };

  const handleSubmitPrescription = async () => {
    const imageToSubmit = capturedImage || previewImage; // Prioritize captured image
    if (!imageToSubmit) {
      toast({
        variant: "destructive",
        title: "No Prescription",
        description: "Please upload or capture a prescription image first.",
      });
      return;
    }
    setProcessingState("processing");
    setAnalysisResult(null);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simulate success/failure
    if (Math.random() > 0.2) {
        setAnalysisResult("Simulated AI Analysis:\n- Found 2 matching products: Paracetamol 500mg, Vitamin C Tablets.\n- 1 item requires doctor verification: Amoxicillin 250mg.\n\nPlease verify with your doctor or pharmacist before purchasing medication.");
        setProcessingState("success");
        toast({title: "Analysis Complete", description: "Prescription analyzed successfully (simulated).", duration: 5000});
    } else {
        setAnalysisResult("Simulated AI Analysis:\nCould not clearly read the prescription. \nTips for a better scan:\n- Ensure good lighting.\n- Hold the camera steady.\n- Make sure the text is in focus.");
        setProcessingState("error");
        toast({variant: "destructive", title: "Analysis Failed", description: "Could not process the prescription (simulated).", duration: 5000});
    }
  };

  const imageToDisplay = capturedImage || previewImage; // Prioritize captured image

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Prescription Scanner</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
          Upload or scan your prescription. Our AI will attempt to identify items (simulation).
        </p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ScanLine className="mr-2 h-6 w-6 text-primary" />
            Scan Your Prescription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={scanMode} onValueChange={(value) => {
            setScanMode(value as ScanMode);
            if (value === 'upload') stopCameraStream();
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">
                <UploadCloud className="mr-2 h-4 w-4" /> Upload File
              </TabsTrigger>
              <TabsTrigger value="camera" onClick={() => { if (scanMode !== 'camera') startCamera();}}>
                <Camera className="mr-2 h-4 w-4" /> Use Camera
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <Label htmlFor="prescription-upload" className="text-sm font-medium">
                  Choose an image file (JPG, PNG)
                </Label>
                <Input
                  id="prescription-upload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="file:text-primary file:font-semibold hover:file:bg-primary/10"
                />
                {previewImage && (
                    <Button variant="outline" size="sm" onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
                    }}>Clear Uploaded Image</Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="camera" className="mt-4">
              <div className="space-y-4">
                {!isCameraActive && hasCameraPermission !== false && (
                  <Button onClick={startCamera} className="w-full">
                    <Camera className="mr-2 h-4 w-4" /> Start Camera
                  </Button>
                )}
                {hasCameraPermission === false && (
                   <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Camera Access Denied</AlertTitle>
                    <AlertDescription>
                      To use the camera, please grant permission in your browser settings.
                      <Button variant="link" className="p-0 h-auto ml-1 text-destructive-foreground hover:underline" onClick={startCamera}>Retry Access</Button>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden border">
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className={`w-full h-full object-contain ${isCameraActive ? 'block' : 'hidden'}`}
                  />
                  {!isCameraActive && !capturedImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                        <Camera className="h-16 w-16 opacity-50 mb-2" />
                        <p>{hasCameraPermission === null ? "Initializing camera..." : "Camera is off or access denied."}</p>
                        {hasCameraPermission === true && <p className="text-xs">Click "Start Camera" if needed.</p>}
                    </div>
                  )}
                  {capturedImage && !isCameraActive && ( // Show captured image when camera is stopped
                     <div className="absolute inset-0 flex items-center justify-center">
                         <Image src={capturedImage} alt="Captured prescription" layout="fill" objectFit="contain" data-ai-hint="prescription document" />
                     </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
                {isCameraActive && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleCapture} className="flex-1">
                      <Camera className="mr-2 h-4 w-4" /> Capture Image
                    </Button>
                     <Button onClick={stopCameraStream} variant="outline" className="flex-1">Stop Camera</Button>
                  </div>
                )}
                {capturedImage && !isCameraActive && (
                    <Button variant="outline" size="sm" onClick={() => {
                        setCapturedImage(null);
                        if (scanMode === 'camera') startCamera(); // Offer to restart camera if in camera mode
                    }}>Retake / Clear Captured</Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {imageToDisplay && (
            <div className="mt-6 border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Prescription Preview:</h3>
              <div className="relative aspect-[4/3] max-h-96 w-full bg-muted rounded-md overflow-hidden border">
                <Image src={imageToDisplay} alt="Prescription preview" layout="fill" objectFit="contain" data-ai-hint="prescription document" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t pt-6">
          <Button
            onClick={handleSubmitPrescription}
            disabled={!imageToDisplay || processingState === "processing"}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            {processingState === "processing" && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {processingState === "processing" ? "Analyzing..." : "Submit Prescription for Analysis"}
          </Button>
          
          {processingState === "success" && analysisResult && (
            <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200">Analysis Successful</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{analysisResult}</AlertDescription>
            </Alert>
          )}
          {processingState === "error" && analysisResult && (
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Analysis Error</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{analysisResult}</AlertDescription>
            </Alert>
          )}

        </CardFooter>
      </Card>
    </div>
  );
}

    