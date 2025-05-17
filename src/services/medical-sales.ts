
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
  imageUrl?: string;
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
      price: 675.00, // Approx 8.99 USD
      category: 'Wound Care',
      imageUrl: 'https://placehold.co/300x200.png?text=Gauze+Pads'
    },
    {
      id: 'prod_2',
      name: 'Antiseptic Wipes (100 Count)',
      description: 'Alcohol-free antiseptic wipes for cleansing skin and minor wounds. Gentle formula.',
      price: 490.00, // Approx 6.50 USD
      category: 'First Aid',
      imageUrl: 'https://placehold.co/300x200.png?text=Antiseptic+Wipes'
    },
    {
      id: 'prod_3',
      name: 'Digital Thermometer',
      description: 'Fast and accurate digital thermometer for oral, rectal, or underarm use. Beeps when ready.',
      price: 970.00, // Approx 12.95 USD
      category: 'Diagnostics',
      imageUrl: 'https://placehold.co/300x200.png?text=Thermometer'
    },
    {
      id: 'prod_4',
      name: 'Elastic Bandage Roll (3 inch)',
      description: 'Provides support and compression for strains and sprains. Includes clips.',
      price: 355.00, // Approx 4.75 USD
      category: 'Supports & Braces',
      imageUrl: 'https://placehold.co/300x200.png?text=Elastic+Bandage'
    },
     {
      id: 'prod_5',
      name: 'Hand Sanitizer Gel (8 oz)',
      description: 'Kills 99.9% of germs. Enriched with moisturizers. 70% alcohol.',
      price: 300.00, // Approx 3.99 USD
      category: 'Hygiene',
      imageUrl: 'https://placehold.co/300x200.png?text=Hand+Sanitizer'
    },
     {
      id: 'prod_6',
      name: 'Pain Relief Cream (4 oz)',
      description: 'Topical analgesic cream for temporary relief of minor aches and pains.',
      price: 695.00, // Approx 9.25 USD
      category: 'Pain Relief',
      imageUrl: 'https://placehold.co/300x200.png?text=Pain+Relief+Cream'
    },
    {
      id: 'prod_7',
      name: 'Disposable Face Masks (Box of 50)',
      description: '3-ply disposable masks for general use. Comfortable ear loops.',
      price: 1160.00, // Approx 15.50 USD
      category: 'Hygiene',
      imageUrl: 'https://placehold.co/300x200.png?text=Face+Masks'
    },
     {
      id: 'prod_8',
      name: 'Adhesive Bandages - Assorted (100 Ct)',
      description: 'Variety pack of sterile adhesive bandages for everyday cuts and scrapes.',
      price: 450.00, // Approx 5.99 USD
      category: 'First Aid',
      imageUrl: 'https://placehold.co/300x200.png?text=Adhesive+Bandages'
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
export async function addToCart(productId: string, quantity: number): Promise<{ success: boolean; message?: string }> {
   console.log(`Simulating adding ${quantity} of product ${productId} to cart.`);
   // Simulate API call
   await new Promise(resolve => setTimeout(resolve, 500)); // Increased delay for visual feedback

   // Simulate potential errors (e.g., out of stock)
   if (Math.random() < 0.1) { // 10% chance of error
     return { success: false, message: "Item out of stock (simulated)." };
   }

   return { success: true, message: "Item added to cart." };
 }
