
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMedicalProducts, type MedicalProduct } from "@/services/medical-sales";
import Image from 'next/image';
import { ShoppingCart, Loader2, ScanLine } from "lucide-react"; // Added ScanLine
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/cart-context'; 
import Link from 'next/link'; // Added Link

export default function StorePage() {
  const [products, setProducts] = useState<MedicalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null); 
  const { toast } = useToast();
  const { addToCart } = useCart(); 

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
    await new Promise(resolve => setTimeout(resolve, 300)); 
    
    addToCart(product, 1); 
    
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

      <Card className="shadow-md hover:shadow-lg transition-shadow bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 pb-3">
            <div className='flex-grow'>
                <CardTitle className="text-lg font-medium text-primary flex items-center">
                    <ScanLine className="h-6 w-6 mr-2" />
                    Have a Prescription?
                </CardTitle>
                <CardDescription className="mt-1">
                    Use our scanner to upload your prescription and find products quickly or get assistance. (AI feature is simulated)
                </CardDescription>
            </div>
            <Button variant="default" asChild className="w-full sm:w-auto mt-2 sm:mt-0 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
               <Link href="/prescription-scanner">
                 <ScanLine className="mr-2 h-4 w-4" /> Scan Prescription
               </Link>
            </Button>
        </CardHeader>
      </Card>

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
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 h-[3.5rem]">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem]">
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

    