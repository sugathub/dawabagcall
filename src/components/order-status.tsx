
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PackageCheck, Settings2, Truck, Navigation, HomeIcon, CheckCircle2, Info } from 'lucide-react';
import type { CartItem } from '@/contexts/cart-context';
import Link from 'next/link';

interface TrackingStep {
  name: string;
  date?: string;
  status: 'completed' | 'active' | 'pending';
}

export interface OrderStatus {
  orderId: string;
  items: CartItem[];
  currentStep: number; // Index of the active step in trackingSteps
  estimatedDeliveryDate: string;
  trackingSteps: TrackingStep[];
}

interface OrderStatusDisplayProps {
  order: OrderStatus;
}

const stepIcons: Record<string, React.ReactNode> = {
  "Order Placed": <PackageCheck className="h-5 w-5" />,
  "Order Confirmed": <CheckCircle2 className="h-5 w-5" />,
  "Processing": <Settings2 className="h-5 w-5" />,
  "Shipped": <Truck className="h-5 w-5" />,
  "Out for Delivery": <Navigation className="h-5 w-5" />,
  "Delivered": <HomeIcon className="h-5 w-5" />,
};

export function OrderStatusDisplay({ order }: OrderStatusDisplayProps) {
  const totalOrderPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Order Status</CardTitle>
          <CardDescription>
            Tracking for Order ID: <span className="font-semibold text-primary">{order.orderId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-lg mb-2">Estimated Delivery</h3>
            <p className="text-xl text-green-600 font-medium">
              {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-muted-foreground">Your package is on its way!</p>
          </div>

          {/* Tracking Timeline */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Tracking History</h3>
            <div className="space-y-6">
              {order.trackingSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex flex-col items-center ${index === order.trackingSteps.length -1 ? '' : 'min-h-[60px]'}`}>
                    <div
                      className={`flex items-center justify-center h-10 w-10 rounded-full border-2
                        ${step.status === 'completed' ? 'bg-green-500 border-green-600 text-white' : ''}
                        ${step.status === 'active' ? 'bg-primary border-primary/80 text-primary-foreground animate-pulse' : ''}
                        ${step.status === 'pending' ? 'bg-muted border-border text-muted-foreground' : ''}
                      `}
                    >
                      {stepIcons[step.name] || <Info className="h-5 w-5"/>}
                    </div>
                    {index < order.trackingSteps.length - 1 && (
                       <div className={`w-0.5 flex-grow mt-1 ${step.status === 'completed' ? 'bg-green-500' : 'bg-border'}`}></div>
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${step.status === 'active' ? 'text-primary' : 'text-foreground'}`}>{step.name}</p>
                    {step.date && <p className="text-sm text-muted-foreground">{new Date(step.date).toLocaleDateString()}</p>}
                    {step.status === 'pending' && <p className="text-sm text-muted-foreground">Awaiting update</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Ordered Items Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Items in this Order ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 border rounded-md bg-card">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={item.imageUrl || `https://placehold.co/80x80.png?text=${encodeURIComponent(item.name)}`} alt={item.name} data-ai-hint="product item" />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator/>

          <div className="flex justify-between items-center font-semibold text-lg">
              <span>Order Total:</span>
              <span>₹{totalOrderPrice.toFixed(2)}</span>
          </div>

        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            Need help with your order? <Link href="/support" className="text-primary hover:underline">Contact Support</Link>
          </p>
          <Button asChild variant="outline">
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
