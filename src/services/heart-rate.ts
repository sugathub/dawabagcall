/**
 * Represents heart rate data.
 */
export interface HeartRateData {
  /**
   * The heart rate in beats per minute (BPM).
   */
  bpm: number;
  /**
   * The timestamp of the heart rate reading. Should ideally be in milliseconds UTC.
   */
  timestamp: number; // Changed to number for consistency
}

// Simulate a base heart rate that fluctuates slightly over time
let baseHeartRate = 72;
let lastUpdateTime = Date.now();

/**
 * Asynchronously simulates retrieving heart rate data from a sensor.
 *
 * In a real application, this function would interact with hardware
 * (e.g., via Web Bluetooth API) or a connected device SDK.
 * It needs proper error handling, sensor calibration, and noise filtering.
 * Data privacy (HIPAA/GDPR) is crucial if storing/transmitting this data.
 * Power efficiency would be managed by the sensor firmware and connection protocol.
 *
 * @returns A promise that resolves to a HeartRateData object.
 */
export async function getHeartRate(): Promise<HeartRateData> {
  return new Promise((resolve, reject) => {
    // Simulate potential connection delay or sensor read time
    const delay = Math.random() * 100; // 0 to 100ms delay

    setTimeout(() => {
      // Simulate occasional sensor errors (e.g., 5% chance)
      if (Math.random() < 0.01) {
         console.error("Simulated sensor read error");
         return reject(new Error("Simulated sensor communication failure"));
       }

       // Simulate slight drift in base heart rate over longer periods
       const now = Date.now();
       if (now - lastUpdateTime > 30000) { // Every 30 seconds
         baseHeartRate += (Math.random() - 0.5) * 2; // +/- 1 bpm drift
         baseHeartRate = Math.max(50, Math.min(120, baseHeartRate)); // Keep within a reasonable resting range
         lastUpdateTime = now;
       }


      // Simulate realistic short-term variation and noise
      const variation = (Math.random() - 0.5) * 6; // +/- 3 bpm variation/noise
      let currentBpm = Math.round(baseHeartRate + variation);

      // Ensure BPM stays within a plausible range
      currentBpm = Math.max(40, Math.min(180, currentBpm)); // Absolute min/max

      resolve({
        bpm: currentBpm,
        timestamp: Date.now(), // Use current timestamp for the reading
      });
    }, delay);
  });
}
