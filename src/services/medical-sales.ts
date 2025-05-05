/**
 * Represents a medical product for sale.
 */
export interface MedicalProduct {
  /**
   * The unique identifier of the product.
   */
  id: string;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * A description of the product.
   */
  description: string;
  /**
   * The price of the product.
   */
  price: number;
   /**
   * Optional category for filtering/organization.
   */
  category?: string;
   /**
    * Optional URL for the product image.
    */
  imageUrl?: string; // Placeholder for actual image URLs
}

/**
 * Asynchronously retrieves a list of mock medical products.
 * In a real application, this would fetch data from a backend API or database.
 *
 * @returns A promise that resolves to an array of MedicalProduct objects.
 */
export async function getMedicalProducts(): Promise<MedicalProduct[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: 'prod_1',
      name: 'Sterile Gauze Pads (Box of 50)',
      description: 'Individually wrapped sterile gauze pads for wound dressing and cleaning. 4x4 inch.',
      price: 8.99,
      category: 'Wound Care',
      // imageUrl: '/images/gauze.jpg' // Example path
    },
    {
      id: 'prod_2',
      name: 'Antiseptic Wipes (100 Count)',
      description: 'Alcohol-free antiseptic wipes for cleansing skin and minor wounds. Gentle formula.',
      price: 6.50,
      category: 'First Aid',
    },
    {
      id: 'prod_3',
      name: 'Digital Thermometer',
      description: 'Fast and accurate digital thermometer for oral, rectal, or underarm use. Beeps when ready.',
      price: 12.95,
      category: 'Diagnostics',
    },
    {
      id: 'prod_4',
      name: 'Elastic Bandage Roll (3 inch)',
      description: 'Provides support and compression for strains and sprains. Includes clips.',
      price: 4.75,
      category: 'Supports & Braces',
    },
     {
      id: 'prod_5',
      name: 'Hand Sanitizer Gel (8 oz)',
      description: 'Kills 99.9% of germs. Enriched with moisturizers. 70% alcohol.',
      price: 3.99,
      category: 'Hygiene',
    },
     {
      id: 'prod_6',
      name: 'Pain Relief Cream (4 oz)',
      description: 'Topical analgesic cream for temporary relief of minor aches and pains.',
      price: 9.25,
      category: 'Pain Relief',
    },
    {
      id: 'prod_7',
      name: 'Disposable Face Masks (Box of 50)',
      description: '3-ply disposable masks for general use. Comfortable ear loops.',
      price: 15.50,
      category: 'Hygiene',
    },
     {
      id: 'prod_8',
      name: 'Adhesive Bandages - Assorted Sizes (100 Count)',
      description: 'Variety pack of sterile adhesive bandages for everyday cuts and scrapes.',
      price: 5.99,
      category: 'First Aid',
    },
  ];
}

/**
 * Placeholder function to simulate adding a product to the cart.
 * In a real app, this would interact with a cart state management or backend API.
 * @param productId The ID of the product to add.
 * @param quantity The number of items to add.
 * @returns A promise indicating success or failure.
 */
export async function addToCart(productId: string, quantity: number): Promise<{ success: boolean; message: string }> {
   console.log(`Simulating adding ${quantity} of product ${productId} to cart.`);
   // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 200));

   // Simulate potential errors (e.g., out of stock)
   if (Math.random() < 0.1) {
     return { success: false, message: "Item out of stock (simulated)." };
   }

   return { success: true, message: "Item added to cart (simulated)." };
 }
