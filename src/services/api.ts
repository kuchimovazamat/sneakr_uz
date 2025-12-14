export interface Product {
  id: number;
  name: string;
  brand: string;
  price: string | number;
  original_price?: string | number;
  image: string;
  images: { image_url: string }[];
  sizes: { size: number }[];
  category: 'men' | 'women' | 'unisex';
  is_new?: boolean;
  is_sale?: boolean;
  description: {
    uz: string;
    ru: string;
  };
}

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/`);
    const data = await response.json();
    return data.results || data;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`);
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/by_category/?category=${category}`);
    return response.json();
  },

  // Get new arrivals
  getNewArrivals: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/new_arrivals/`);
    return response.json();
  },

  // Get products on sale
  getOnSale: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products/on_sale/`);
    return response.json();
  },

  // Create order
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  // Get orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/`);
    return response.json();
  },
};

// Helper function to normalize API product to frontend format
export const normalizeProduct = (apiProduct: any): Product => {
  return {
    ...apiProduct,
    original_price: apiProduct.original_price || undefined,
    is_new: apiProduct.is_new || false,
    is_sale: apiProduct.is_sale || false,
    images: apiProduct.images || [],
    sizes: apiProduct.sizes || [],
  };
};
