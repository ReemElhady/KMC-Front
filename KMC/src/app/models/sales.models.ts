export interface ProductDetails {
    id: number;
    name: string;
    // Add other product properties
    is_wishlist?: boolean;
  }
  
  export interface ProductType {
    [key: string]: {
      results: { [key: number]: ProductDetails };
    };
  }
  
  export interface salesInterface {
    results: ProductDetails[];
    next: string | null;
    previous: string | null;
    count: number;
    // Add any other properties if needed
  }
  