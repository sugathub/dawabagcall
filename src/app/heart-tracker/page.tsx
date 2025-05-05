"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HeartPulse, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getHeartRate, type HeartRateData } from '@/services/heart-rate'; // Assuming service exists

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
  const [status, setStatus] = useState<'connecting' | 'active' | 'error' | 'idle'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulate fetching real-time heart rate data
  useEffect(() => {
    setStatus('connecting');
    setErrorMessage(null);

    // Placeholder: In a real app, connect to the sensor (Bluetooth, etc.)
    console.log("Attempting to connect to heart rate sensor...");

    const initialFetch = async () => {
        try {
            const initialData = await getHeartRate(); // Get initial reading
            setCurrentBpm(initialData.bpm);
            setHeartRateData([{ ...initialData, timestamp: Date.now() }]); // Use current timestamp for chart
            setStatus('active');
            console.log("Sensor connected, initial reading:", initialData.bpm);
        } catch (error) {
            console.error("Failed to get initial heart rate:", error);
            setStatus('error');
            setErrorMessage("Failed to connect to sensor. Please ensure it's paired and nearby.");
        }
    };

    initialFetch(); // Call the async function

    // Simulate continuous data stream
    const intervalId = setInterval(async () => {
      if (status === 'active' || status === 'connecting') { // Only fetch if active or still trying
        try {
          const newData = await getHeartRate(); // This needs to be adapted for real streaming
          const timestamp = Date.now(); // Use consistent timestamping

           // Simulate slight variations for demo purposes
          const simulatedBpm = newData.bpm + Math.floor(Math.random() * 5) - 2; // +/- 2 variation
          const simulatedData = { bpm: simulatedBpm, timestamp };

          setCurrentBpm(simulatedData.bpm);
          setHeartRateData((prevData) => {
            const updatedData = [...prevData, simulatedData];
            // Keep only the last 60 data points (e.g., last minute if 1 reading/sec)
            return updatedData.slice(-60);
          });
           if (status === 'connecting') setStatus('active'); // Mark as active after first successful read in interval
        } catch (error) {
          console.error("Error fetching heart rate update:", error);
          // Handle intermittent errors, maybe retry or show a warning
           // Avoid setting global error state for intermittent issues unless persistent
           // setStatus('error');
           // setErrorMessage("Lost connection to sensor.");
        }
      }
    }, 3000); // Fetch every 3 seconds for demo

    return () => {
      clearInterval(intervalId);
      console.log("Disconnected from heart rate sensor simulation.");
      setStatus('idle');
      // Add cleanup logic here (e.g., disconnect Bluetooth)
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

   // Format timestamp for X-axis label (optional)
   const formatXAxis = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Heart Rate Tracker</h1>

      {status === 'error' && (
        <Alert variant="destructive">
          <Activity className="h-4 w-4" />
          <AlertTitle>Sensor Error</AlertTitle>
          <AlertDescription>{errorMessage || "Could not read data from the heart rate sensor."}</AlertDescription>
        </Alert>
      )}

       {status === 'connecting' && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertTitle>Connecting...</AlertTitle>
          <AlertDescription>Attempting to connect to your heart rate sensor. Make sure it's on and nearby.</AlertDescription>
        </Alert>
      )}

       <Card className="shadow-lg">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-lg font-medium">Current Heart Rate</CardTitle>
           <HeartPulse className="h-6 w-6 text-destructive" />
         </CardHeader>
         <CardContent>
           <div className={`text-6xl font-bold ${currentBpm ? 'text-destructive' : 'text-muted-foreground'}`}>
             {status === 'connecting' ? '--' : currentBpm ?? '--'}
           </div>
           <p className="text-xs text-muted-foreground">
              {status === 'active' ? 'Beats per minute (BPM) - Real-time' : status === 'connecting' ? 'Connecting to sensor...' : status === 'error' ? 'Sensor error' : 'Sensor disconnected'}
           </p>
         </CardContent>
       </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Heart Rate Trend</CardTitle>
          <CardDescription>Your heart rate over the last minute.</CardDescription>
        </CardHeader>
        <CardContent>
           {status === 'active' && heartRateData.length > 1 ? (
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
                    domain={['dataMin - 5', 'dataMax + 5']} // Dynamic domain with padding
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
                    stroke="var(--color-bpm)" // Use color from config
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true} // Smoother animation
                    animationDuration={300}
                  />
                  {/* Optional: Add Reference lines for normal ranges */}
                  {/* <ReferenceLine y={100} label="High" stroke="orange" strokeDasharray="3 3" />
                  <ReferenceLine y={60} label="Low" stroke="lightblue" strokeDasharray="3 3" /> */}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
           ) : (
             <div className="h-[300px] flex items-center justify-center text-muted-foreground">
               {status === 'connecting' ? 'Waiting for sensor data...' : status === 'error' ? 'Cannot display chart due to sensor error.' : 'Not enough data to display chart.'}
             </div>
           )}
        </CardContent>
      </Card>

       {/* Placeholder for future features */}
       <Alert variant="default" className="mt-8">
         <Activity className="h-4 w-4" />
         <AlertTitle>Feature Coming Soon!</AlertTitle>
         <AlertDescription>
           Advanced analysis, history, and personalized insights based on your heart rate data are planned for future updates. Ensure data privacy and security compliance (GDPR/HIPAA) will be prioritized. Sensor calibration and noise filtering are handled by the underlying hardware/service.
         </AlertDescription>
       </Alert>
    </div>
  );
}
