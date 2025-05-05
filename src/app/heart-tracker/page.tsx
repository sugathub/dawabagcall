
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeartPulse, Activity, Link as LinkIcon, Link2Off } from 'lucide-react'; // Added LinkIcon, Link2Off
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getHeartRate, type HeartRateData } from '@/services/heart-rate'; // Assuming service exists
import { Button } from "@/components/ui/button"; // Added Button
import { useToast } from "@/hooks/use-toast"; // Added useToast

// Chart configuration (optional, for ShadCN charts)
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  bpm: {
    label: "Heart Rate (BPM)",
    color: "hsl(var(--destructive))", // Use destructive color for heart rate
  },
} satisfies ChartConfig;


export default function HeartTrackerPage() {
  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([]);
  const [currentBpm, setCurrentBpm] = useState<number | null>(null);
  const [sensorStatus, setSensorStatus] = useState<'connecting' | 'active' | 'error' | 'idle'>('connecting');
  const [sensorErrorMessage, setSensorErrorMessage] = useState<string | null>(null);

  // --- Google Fit State ---
  const [isGoogleFitConnected, setIsGoogleFitConnected] = useState(false);
  const [isConnectingToGoogleFit, setIsConnectingToGoogleFit] = useState(false);
  const [googleFitError, setGoogleFitError] = useState<string | null>(null);
  const { toast } = useToast();
  // --- End Google Fit State ---


  // Simulate fetching real-time heart rate data from sensor
  useEffect(() => {
    setSensorStatus('connecting');
    setSensorErrorMessage(null);

    // Placeholder: In a real app, connect to the sensor (Bluetooth, etc.)
    console.log("Attempting to connect to heart rate sensor...");

    const initialFetch = async () => {
        try {
            const initialData = await getHeartRate(); // Get initial reading
            setCurrentBpm(initialData.bpm);
            setHeartRateData([{ ...initialData, timestamp: Date.now() }]); // Use current timestamp for chart
            setSensorStatus('active');
            console.log("Sensor connected, initial reading:", initialData.bpm);
        } catch (error) {
            console.error("Failed to get initial heart rate:", error);
            setSensorStatus('error');
            setSensorErrorMessage("Failed to connect to sensor. Please ensure it's paired and nearby.");
        }
    };

    initialFetch(); // Call the async function

    // Simulate continuous data stream from sensor
    const intervalId = setInterval(async () => {
      // Only fetch if sensor is active or connecting, AND Google Fit is NOT the primary source (for this simulation)
      if ((sensorStatus === 'active' || sensorStatus === 'connecting') /* && !isGoogleFitConnected */) {
        try {
          const newData = await getHeartRate();
          const timestamp = Date.now();

           // Simulate slight variations for demo purposes
          const simulatedBpm = newData.bpm + Math.floor(Math.random() * 5) - 2; // +/- 2 variation
          const simulatedData = { bpm: simulatedBpm, timestamp };

          setCurrentBpm(simulatedData.bpm);
          setHeartRateData((prevData) => {
            const updatedData = [...prevData, simulatedData];
            // Keep only the last 60 data points
            return updatedData.slice(-60);
          });
           if (sensorStatus === 'connecting') setSensorStatus('active');
        } catch (error) {
          console.error("Error fetching heart rate update:", error);
          // Handle intermittent errors without necessarily stopping everything
        }
      }
    }, 3000); // Fetch every 3 seconds for demo

    return () => {
      clearInterval(intervalId);
      console.log("Disconnected from heart rate sensor simulation.");
      setSensorStatus('idle');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount


  // --- Google Fit Handlers (Placeholders) ---
  const handleConnectGoogleFit = async () => {
    setIsConnectingToGoogleFit(true);
    setGoogleFitError(null);
    console.log("Simulating Google Fit connection...");
    // --- TODO: Implement OAuth 2.0 Flow ---
    // 1. Redirect user to Google's authorization endpoint
    // 2. Handle the callback, exchange code for tokens (backend recommended)
    // 3. Store tokens securely (backend recommended)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Simulate success/failure
    const success = Math.random() > 0.2; // 80% success chance
    if (success) {
      setIsGoogleFitConnected(true);
      toast({ title: "Success", description: "Connected to Google Fit." });
      // --- TODO: Fetch initial data from Google Fit API ---
      // Example: fetchLastDayHeartRate()
    } else {
      setGoogleFitError("Failed to connect to Google Fit. Please try again.");
      toast({ variant: "destructive", title: "Error", description: "Failed to connect to Google Fit." });
    }
    setIsConnectingToGoogleFit(false);
  };

  const handleDisconnectGoogleFit = async () => {
    console.log("Simulating Google Fit disconnection...");
    // --- TODO: Implement disconnect logic ---
    // 1. Revoke OAuth token (optional, depends on desired behavior)
    // 2. Clear stored tokens
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsGoogleFitConnected(false);
    setGoogleFitError(null);
    toast({ title: "Disconnected", description: "Disconnected from Google Fit." });
  };
  // --- End Google Fit Handlers ---

   // Format timestamp for X-axis label
   const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Heart Rate Tracker</h1>
           <p className="text-muted-foreground mt-1">Monitor your heart rate using sensors or Google Fit.</p>
        </div>
         {/* Google Fit Connect/Disconnect Button */}
         <div>
           {!isGoogleFitConnected ? (
             <Button
               onClick={handleConnectGoogleFit}
               disabled={isConnectingToGoogleFit}
             >
               <LinkIcon className="mr-2 h-4 w-4" />
               {isConnectingToGoogleFit ? "Connecting..." : "Connect Google Fit"}
             </Button>
           ) : (
             <Button variant="outline" onClick={handleDisconnectGoogleFit}>
               <Link2Off className="mr-2 h-4 w-4" />
               Disconnect Google Fit
             </Button>
           )}
        </div>
      </div>


       {/* Error Alerts */}
       {sensorStatus === 'error' && (
         <Alert variant="destructive">
           <Activity className="h-4 w-4" />
           <AlertTitle>Sensor Error</AlertTitle>
           <AlertDescription>{sensorErrorMessage || "Could not read data from the heart rate sensor."}</AlertDescription>
         </Alert>
       )}
       {googleFitError && (
         <Alert variant="destructive">
           <LinkIcon className="h-4 w-4" />
           <AlertTitle>Google Fit Error</AlertTitle>
           <AlertDescription>{googleFitError}</AlertDescription>
         </Alert>
       )}

       {/* Connecting Status */}
       {(sensorStatus === 'connecting' || isConnectingToGoogleFit) && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertTitle>Connecting...</AlertTitle>
          <AlertDescription>
            {isConnectingToGoogleFit ? "Attempting to connect to Google Fit..." : "Attempting to connect to your heart rate sensor. Make sure it's on and nearby."}
          </AlertDescription>
        </Alert>
      )}

      {/* Display Google Fit Connection Status */}
      {isGoogleFitConnected && (
        <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/30">
             <LinkIcon className="h-4 w-4 text-green-700" />
            <AlertTitle className="text-green-800 dark:text-green-300">Google Fit Connected</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              {/* Displaying simulated sensor data for now. */}
              Currently showing real-time sensor data. Google Fit integration allows syncing historical data (implementation pending).
            </AlertDescription>
        </Alert>
      )}


       {/* Current Heart Rate Card */}
       <Card className="shadow-lg">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-lg font-medium">Current Heart Rate</CardTitle>
            {/* Indicate source? Maybe too complex for now */}
           <HeartPulse className="h-6 w-6 text-destructive" />
         </CardHeader>
         <CardContent>
           <div className={`text-6xl font-bold ${currentBpm ? 'text-destructive' : 'text-muted-foreground'}`}>
              {sensorStatus === 'connecting' && !currentBpm ? '--' : currentBpm ?? '--'}
           </div>
           <p className="text-xs text-muted-foreground">
              {sensorStatus === 'active' ? 'Beats per minute (BPM) - Real-time Sensor' : sensorStatus === 'connecting' ? 'Connecting to sensor...' : sensorStatus === 'error' ? 'Sensor error' : 'Sensor disconnected'}
           </p>
         </CardContent>
       </Card>

       {/* Heart Rate Trend Chart */}
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Heart Rate Trend</CardTitle>
          {/* Adjust description based on source? */}
          <CardDescription>
             {isGoogleFitConnected ? "Real-time sensor trend (Google Fit sync for history pending)." : "Your heart rate over the last minute (from sensor)."}
           </CardDescription>
        </CardHeader>
        <CardContent>
           {/* Logic remains based on sensor data for now */}
           {(sensorStatus === 'active' || sensorStatus === 'connecting') && heartRateData.length > 1 ? (
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={heartRateData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatXAxis}
                    stroke="hsl(var(--muted-foreground))"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                  />
                   <ChartTooltip
                     cursor={false}
                     content={<ChartTooltipContent indicator="line" />}
                   />
                  <Line
                    type="monotone"
                    dataKey="bpm"
                    stroke="var(--color-bpm)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
           ) : (
             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
               {sensorStatus === 'connecting' ? 'Waiting for sensor data...' : sensorStatus === 'error' ? 'Cannot display chart due to sensor error.' : 'Not enough data to display chart.'}
             </div>
           )}
        </CardContent>
      </Card>

       {/* Placeholder for future features */}
       <Alert variant="default" className="mt-8">
         <Activity className="h-4 w-4" />
         <AlertTitle>Feature Coming Soon!</AlertTitle>
         <AlertDescription>
           Integration with Google Fit for historical data, advanced analysis, and personalized insights are planned. Ensure data privacy and security compliance (GDPR/HIPAA) will be prioritized. Sensor calibration and noise filtering are handled by the underlying hardware/service.
         </AlertDescription>
       </Alert>
    </div>
  );
}
