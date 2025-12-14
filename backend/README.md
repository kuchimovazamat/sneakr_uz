# Django Backend for Lovable E-commerce

This is the Django REST API backend for the React e-commerce frontend.

## Features

- **Product Management**: Complete CRUD operations for products
- **Order Management**: Handle customer orders and checkout
- **REST API**: RESTful endpoints with Django REST Framework
- **CORS Enabled**: Configured for React frontend communication
- **Admin Panel**: Django admin interface for easy management

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get single product
- `POST /api/products/` - Create new product
- `PUT /api/products/{id}/` - Update product
- `DELETE /api/products/{id}/` - Delete product
- `GET /api/products/by_category/?category=men` - Filter by category
- `GET /api/products/new_arrivals/` - Get new arrivals
- `GET /api/products/on_sale/` - Get products on sale

### Orders
- `GET /api/orders/` - List all orders
- `GET /api/orders/{id}/` - Get single order
- `POST /api/orders/` - Create new order
- `POST /api/orders/{id}/update_status/` - Update order status

## Setup & Installation

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Load Sample Data**:
   ```bash
   python manage.py load_products
   ```

4. **Create Superuser** (for admin access):
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Development Server**:
   ```bash
   python manage.py runserver 8000
   ```

The API will be available at `http://localhost:8000/api/`
Admin panel: `http://localhost:8000/admin/`

## Models

### Product
- name, brand, price, original_price
- image, category (men/women/unisex)
- is_new, is_sale flags
- Multi-language descriptions (Uzbek/Russian)
- Related images and sizes

### Order
- Customer information (name, email, phone)
- Shipping address details
- Order status tracking
- Related order items

## CORS Configuration

Configured to allow requests from:
- http://localhost:8080 (Vite dev server)
- http://localhost:5173 (Vite alternate port)

## Tech Stack

- Django 5.0.1
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- SQLite (default database)
