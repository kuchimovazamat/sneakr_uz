# Connecting React Frontend to Django Backend

## Django Backend Setup ✅

Your Django backend is now running at: **http://localhost:8000**

### Available API Endpoints:

1. **Products API**: http://localhost:8000/api/products/
2. **Orders API**: http://localhost:8000/api/orders/
3. **Admin Panel**: http://localhost:8000/admin/

## Sample Product Data

5 sample products have been loaded into the database matching your frontend structure.

## React Frontend Integration

To connect your React app to the Django backend, create an API service file:

### Create `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Get all products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/`);
    return response.json();
  },

  // Get single product
  getProduct: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`);
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (category: string) => {
    const response = await fetch(`${API_BASE_URL}/products/by_category/?category=${category}`);
    return response.json();
  },

  // Get new arrivals
  getNewArrivals: async () => {
    const response = await fetch(`${API_BASE_URL}/products/new_arrivals/`);
    return response.json();
  },

  // Get products on sale
  getOnSale: async () => {
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
```

### Example: Update your Catalog page to use Django backend

In `src/pages/Catalog.tsx`:

```typescript
import { useEffect, useState } from 'react';
import { api } from '@/services/api';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data.results); // DRF returns paginated results
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Example: Create an order from checkout

In `src/pages/Checkout.tsx`:

```typescript
const handleSubmit = async (formData: any) => {
  const orderData = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    shipping_address: formData.address,
    shipping_city: formData.city,
    shipping_postal_code: formData.postalCode,
    total_amount: cartTotal,
    items: cartItems.map(item => ({
      product_id: item.id,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  try {
    const order = await api.createOrder(orderData);
    console.log('Order created:', order);
    // Redirect to success page
  } catch (error) {
    console.error('Error creating order:', error);
  }
};
```

## Testing the API

### Using curl:

```bash
# Get all products
curl http://localhost:8000/api/products/

# Get products by category
curl http://localhost:8000/api/products/by_category/?category=men

# Create an order
curl -X POST http://localhost:8000/api/orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "customer_phone": "+998901234567",
    "shipping_address": "123 Main St",
    "shipping_city": "Tashkent",
    "shipping_postal_code": "100000",
    "total_amount": 1850000,
    "items": [
      {
        "product_id": 1,
        "size": 42,
        "quantity": 1,
        "price": 1850000
      }
    ]
  }'
```

## Admin Panel

To access the Django admin panel:

1. Create a superuser:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

2. Visit http://localhost:8000/admin/
3. Login with your credentials
4. Manage products and orders through the admin interface

## Both Servers Running

- **React Frontend**: http://localhost:8080
- **Django Backend**: http://localhost:8000

CORS is already configured to allow communication between them.
