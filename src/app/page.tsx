import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, HeartPulse, ShoppingCart, Video } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';


export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">
          Welcome to MediCall
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with healthcare professionals, monitor your heart rate, and purchase medical supplies, all from the comfort of your home.
        </p>
         <div className="relative w-full max-w-4xl h-64 mx-auto rounded-lg overflow-hidden shadow-lg mt-8">
          <Image
            src="https://picsum.photos/1024/400"
            alt="Doctor consulting patient online"
            layout="fill"
            objectFit="cover"
            data-ai-hint="doctor online consultation"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
             <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/video-call">
                <Video className="mr-2" /> Start a Video Call
              </Link>
            </Button>
          </div>
        </div>
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
               <Link href="/video-call">Start Call</Link>
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
              Monitor your heart rate in real-time using integrated sensor technology. (Coming Soon)
            </CardDescription>
             <Button variant="outline" disabled>
               View Tracker
            </Button>
             {/* <Button variant="outline" asChild>
               <Link href="/heart-tracker">View Tracker</Link>
            </Button> */}
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
               <Link href="/store">Shop Now</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

       {/* Placeholder section for How it Works or Testimonials */}
       <section className="w-full max-w-5xl text-center space-y-4 py-8">
         <h2 className="text-3xl font-semibold text-primary">How It Works</h2>
         <p className="text-muted-foreground">Simple steps to get started with MediCall.</p>
         {/* Add steps or visual guide here */}
       </section>
    </div>
  );
}
