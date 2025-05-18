
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMedicalProducts, type MedicalProduct } from "@/services/medical-sales";
import Image from 'next/image';
import { ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/cart-context'; // Import useCart

export default function StorePage() {
  const [products, setProducts] = useState<MedicalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // Store product ID being added
  const { toast } = useToast();
  const { addToCart } = useCart(); // Get addToCart from context

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getMedicalProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load products. Please try again later.",
        });
      }
      setLoading(false);
    };
    fetchProducts();
  }, [toast]);

  const handleAddToCart = async (product: MedicalProduct) => {
    setAddingToCart(product.id);
    // Simulate a short delay for visual feedback, then add to context
    await new Promise(resolve => setTimeout(resolve, 300)); 
    
    addToCart(product, 1); // Add to cart context
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
    
    setAddingToCart(null);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Medical Supplies Store</h1>
          <p className="text-muted-foreground mt-2">Browse and purchase essential medical products.</p>
        </section>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Medical Supplies Store</h1>
        <p className="text-muted-foreground mt-2">Browse and purchase essential medical products.</p>
      </section>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
               <div className="relative w-full h-48 bg-muted">
                 <Image
                   src={product.imageUrl || `https://placehold.co/300x200.png?text=${encodeURIComponent(product.name)}`}
                   alt={product.name}
                   layout="fill"
                   objectFit="cover"
                   data-ai-hint="medical product"
                 />
               </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 h-[3.5rem]"> {/* Adjusted: line-clamp, height, font-semibold, hover effect */}
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem]"> {/* Adjusted: line-clamp, height */}
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-2 pb-4"> 
                 <p className="text-xl font-semibold text-primary">
                    ₹{product.price.toFixed(2)}
                 </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart === product.id}
                >
                  {addingToCart === product.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          <p>No products available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
