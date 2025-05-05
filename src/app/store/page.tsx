import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMedicalProducts, type MedicalProduct } from "@/services/medical-sales"; // Assuming service exists
import Image from 'next/image';
import { ShoppingCart } from "lucide-react";

export default async function StorePage() {
  // Fetch products on the server
  const products: MedicalProduct[] = await getMedicalProducts();

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Medical Supplies Store</h1>
        <p className="text-muted-foreground mt-2">Browse and purchase essential medical products.</p>
      </section>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
               {/* Placeholder Image */}
               <div className="relative w-full h-48 bg-muted">
                 <Image
                   // Use a consistent placeholder or ideally a product image URL if available
                   src={`https://picsum.photos/seed/${product.id}/300/200`}
                   alt={product.name}
                   layout="fill"
                   objectFit="cover"
                   data-ai-hint="medical product" // Hint for AI image generation
                 />
               </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm h-10 overflow-hidden text-ellipsis">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-xl font-semibold text-primary">
                    ${product.price.toFixed(2)}
                 </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
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
