
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, type CartItem } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart, MinusCircle, PlusCircle, PackageOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { OrderStatusDisplay, type OrderStatus } from '@/components/order-status'; // Import the new component

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [currentOrderStatus, setCurrentOrderStatus] = useState<OrderStatus | null>(null);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast({
        title: "Item Removed",
        description: "Item quantity set to 0 and removed from cart.",
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
        toast({
            variant: "destructive",
            title: "Cart is Empty",
            description: "Please add items to your cart before proceeding to checkout."
        });
        return;
    }

    const orderId = `MEDICALL-${Date.now().toString().slice(-6)}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now

    const newOrderStatus: OrderStatus = {
        orderId,
        items: [...cartItems], // Create a copy of cart items for the order
        currentStep: 1, // 0: Placed, 1: Confirmed, 2: Processing, 3: Shipped, etc.
        estimatedDeliveryDate: estimatedDelivery.toISOString().split('T')[0],
        trackingSteps: [
            { name: "Order Placed", date: new Date().toISOString().split('T')[0], status: "completed" },
            { name: "Order Confirmed", date: new Date().toISOString().split('T')[0], status: "active" },
            { name: "Processing", status: "pending" },
            { name: "Shipped", status: "pending" },
            { name: "Out for Delivery", status: "pending" },
            { name: "Delivered", status: "pending" },
        ]
    };
    setCurrentOrderStatus(newOrderStatus);
    
    // Optionally clear the cart from context after "placing order"
    // clearCart(); 
    // For now, we are not clearing the cart, so user can go back and see it.

    toast({
        title: "Order Placed!",
        description: `Your order ${orderId} has been successfully placed.`,
    });
  };

  if (currentOrderStatus) {
    return <OrderStatusDisplay order={currentOrderStatus} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart</h1>
          <p className="text-muted-foreground">Review items in your cart and proceed to checkout.</p>
        </div>
        {cartItems.length > 0 && (
            <Button variant="outline" onClick={() => {
                clearCart();
                toast({ title: "Cart Cleared", description: "All items have been removed from your cart."});
            }}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
            </Button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-60">
              <PackageOpen className="w-16 h-16 mb-4 opacity-50" />
              <p className="mb-2">Looks like you haven&apos;t added anything to your cart yet.</p>
              <Button asChild>
                <Link href="/store">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Start Shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative w-24 h-24 sm:w-20 sm:h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.imageUrl || `https://placehold.co/100x100.png?text=${encodeURIComponent(item.name)}`}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint="product item"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-md">{item.description}</p>
                    <p className="text-md font-medium text-primary mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                    <div className="flex items-center gap-1">
                       <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10) || 0)}
                        className="w-14 h-8 text-center px-1"
                        min="0"
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast({ title: "Item Removed", description: `${item.name} removed from cart.` });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-1 shadow-lg sticky top-20"> {/* Make summary card sticky */}
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              <Button variant="link" asChild className="text-sm">
                <Link href="/store">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
