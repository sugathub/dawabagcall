
import { use } from 'react'; // Import use
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, HeartPulse, ShoppingCart, Video, Activity, ShoppingBag } from "lucide-react";
import Link from "next/link";

// Add searchParams to the function signature and use React.use() for demonstration.
// This is a speculative application of the pattern suggested by the error message.
export default function Home({ searchParams: initialSearchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  // Cautiously unwrap searchParams if they were a promise-like entity.
  // The Promise.resolve() is a way to ensure it's thenable for `use()`.
  // If initialSearchParams were guaranteed to be a promise, it would be: use(initialSearchParams)
  const searchParams = initialSearchParams ? use(Promise.resolve(initialSearchParams)) : undefined;

  // Example of how searchParams could be used safely after unwrapping.
  // This component's rendering logic does not currently depend on searchParams.
  if (searchParams) {
    // To prevent unused variable warnings if no other logic uses searchParams:
    // console.log("Home page searchParams (if any):", Object.keys(searchParams).length > 0 ? searchParams : "empty");
  }

  return (
    <div className="flex flex-col items-center space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
          Welcome to Dawabag Pharmacy
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with healthcare professionals, monitor your heart rate, and purchase medical supplies, all from the comfort of your home.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Video Consultation</CardTitle>
            <Stethoscope className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Securely connect with certified doctors via video call for consultations and advice.
            </CardDescription>
            <Button variant="outline" asChild>
               <Link href="/video-call"> <Video className="mr-2 h-4 w-4" /> Start Call</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Heart Rate Tracker</CardTitle>
            <HeartPulse className="h-6 w-6 text-destructive" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Monitor your heart rate in real-time using integrated sensor technology.
            </CardDescription>
             <Button variant="outline" asChild>
               <Link href="/heart-tracker"><Activity className="mr-2 h-4 w-4" />View Tracker</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Medical Supplies</CardTitle>
            <ShoppingCart className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">
              Browse and purchase essential medical products online.
            </CardDescription>
            <Button variant="outline" asChild>
               <Link href="/store"><ShoppingBag className="mr-2 h-4 w-4" />Shop Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       <section className="w-full max-w-5xl text-center space-y-4 py-8">
         <h2 className="text-3xl font-semibold text-primary">How It Works</h2>
         <p className="text-muted-foreground">Simple steps to get started with Dawabag Pharmacy.</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">1. Schedule</h3>
              <p className="text-sm text-muted-foreground">Find a doctor and book an appointment that fits your schedule.</p>
            </div>
             <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">2. Connect</h3>
              <p className="text-sm text-muted-foreground">Join the secure video call at your scheduled time.</p>
            </div>
             <div className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">3. Consult</h3>
              <p className="text-sm text-muted-foreground">Discuss your health concerns with the doctor and get professional advice.</p>
            </div>
         </div>
       </section>
    </div>
  );
}
