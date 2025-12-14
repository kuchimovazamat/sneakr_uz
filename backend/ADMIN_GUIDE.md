# Django Admin Panel Guide

## Overview
Your e-commerce admin panel is now fully enhanced with comprehensive features for managing brands, products, images, and inventory.

## Features

### 1. Brand Management
**Location:** Admin → Products → Brands

**Features:**
- ✅ Add/Edit/Delete brands
- ✅ Upload brand logos (images from device)
- ✅ Set brand website URL
- ✅ Activate/Deactivate brands
- ✅ View product count per brand
- ✅ Image preview in list view
- ✅ Bulk activate/deactivate actions

**How to Add a Brand:**
1. Go to Admin → Products → Brands
2. Click "Add Brand"
3. Enter brand name (required)
4. Upload logo image from your device (optional)
5. Add description and website (optional)
6. Check "Is active" to make it available
7. Click "Save"

**Available Brands:**
- Nike
- Adidas
- Puma
- New Balance
- Air Jordan
- Reebok
- Asics
- Under Armour
- Converse
- Vans

### 2. Product Management
**Location:** Admin → Products → Products

**Enhanced Features:**
- ✅ Upload product images from device OR use URLs
- ✅ Live image preview
- ✅ Discount percentage calculator
- ✅ Stock status indicator (color-coded)
- ✅ Multiple gallery images per product
- ✅ Size management with individual stock
- ✅ Mark as NEW, SALE, or FEATURED
- ✅ Duplicate products feature
- ✅ Bulk actions (mark as new, sale, featured)
- ✅ Date hierarchy navigation
- ✅ Advanced filtering and search

**Product List Columns:**
- Image Preview
- Product Name
- Brand
- Category
- Price
- Discount %
- Stock Status (🔴 Out of Stock, 🟠 Low Stock, 🟢 In Stock)
- NEW flag
- SALE flag
- FEATURED flag
- Created Date

**How to Add a Product:**
1. Go to Admin → Products → Products
2. Click "Add Product"
3. Fill in:
   - Name (e.g., "Air Max 90")
   - Brand (type from available brands)
   - Category (Men/Women/Unisex)
   - Price (current price)
   - Original Price (optional, for sale items)
   - **Image:** Either upload from device OR paste image URL
   - Description in Uzbek
   - Description in Russian
   - Stock Quantity
   - Check NEW/SALE/FEATURED as needed

4. **Add Gallery Images:**
   - Scroll to "Product Images" section
   - Click "Add another Product Image"
   - Upload image OR paste URL
   - Set display order (0 = first)
   - Add alt text for accessibility

5. **Add Sizes:**
   - Scroll to "Product Sizes" section
   - Click "Add another Product Size"
   - Enter size (EU format)
   - Enter stock for this size
   - Check "Is available"

6. Click "Save"

**Bulk Actions:**
- Select products → Actions → "Mark as NEW"
- Select products → Actions → "Mark as SALE"
- Select products → Actions → "Feature on homepage"
- Select products → Actions → "Duplicate selected products"

### 3. Product Images
**Location:** Admin → Products → Product Images

**Features:**
- ✅ Upload images from device
- ✅ Use image URLs as alternative
- ✅ Set display order
- ✅ Add alt text for SEO/accessibility
- ✅ Live preview
- ✅ Filter by brand/category
- ✅ Inline editing in product form

**Image Options:**
1. **Upload from Device:** Click "Choose File" → Select image → Save
2. **Use URL:** Paste image URL in "Image url" field → Save
3. **Both:** If both provided, uploaded file takes precedence

### 4. Product Sizes & Stock
**Location:** Admin → Products → Product Sizes

**Features:**
- ✅ Individual stock tracking per size
- ✅ Available/Unavailable toggle
- ✅ Bulk restock action
- ✅ Inline editing in product form
- ✅ Unique constraint (no duplicate sizes per product)

**Bulk Actions:**
- Select sizes → Actions → "Mark as available"
- Select sizes → Actions → "Mark as unavailable"
- Select sizes → Actions → "Restock (set to 10 items)"

### 5. Order Management
**Location:** Admin → Orders → Orders

**Features:**
- View all orders
- Order items with product details
- Customer information
- Shipping address
- Order status tracking
- Payment status

## Admin Panel Tips

### Filters & Search
- **Products:** Filter by category, brand, NEW, SALE, FEATURED, date
- **Search:** Search by name, brand, description
- **Date Hierarchy:** Browse products by creation date

### Image Management Best Practices
1. **Recommended Image Sizes:**
   - Product Main Image: 800x800px
   - Gallery Images: 600x600px
   - Brand Logos: 200x200px

2. **File Formats:** JPG, PNG, WebP
3. **Max File Size:** Recommended < 2MB

4. **Upload Location:**
   - Product images → `/backend/media/products/`
   - Gallery images → `/backend/media/products/gallery/`
   - Brand logos → `/backend/media/brands/`

### Stock Management
1. **Product Stock Quantity:** Total stock across all sizes (for reference)
2. **Size Stock:** Actual inventory per size
3. **Stock Status Colors:**
   - 🔴 Red: Out of stock (0 items)
   - 🟠 Orange: Low stock (< 10 items)
   - 🟢 Green: In stock (≥ 10 items)

### Brand Dropdown
When editing/adding products, you'll see available brands listed in a helpful box. Make sure to type the exact brand name from this list.

## API Integration
All admin changes are automatically available through the REST API:

- **Products:** `GET /api/products/`
- **Product Detail:** `GET /api/products/{id}/`
- **New Arrivals:** `GET /api/products/new_arrivals/`
- **On Sale:** `GET /api/products/on_sale/`
- **By Category:** `GET /api/products/by_category/?category=men`

## Accessing Admin Panel
1. URL: http://127.0.0.1:8000/admin/
2. Login: azamat
3. Password: aza123

## Media Files in Development
Uploaded media files are served at: `http://127.0.0.1:8000/media/`

Example:
- Brand logo: `http://127.0.0.1:8000/media/brands/nike_logo.png`
- Product image: `http://127.0.0.1:8000/media/products/air_max_90.jpg`

## Production Notes
For production deployment:
1. Configure proper static files serving (WhiteNoise or CDN)
2. Set up media file storage (AWS S3, Digital Ocean Spaces, etc.)
3. Enable HTTPS
4. Update `ALLOWED_HOSTS` in settings
5. Set `DEBUG = False`
6. Use environment variables for sensitive data

## Troubleshooting

### Images Not Showing
- Check if `MEDIA_URL` and `MEDIA_ROOT` are configured in settings
- Verify media files are in `/backend/media/` directory
- Ensure Django server is running
- For uploaded images, check file permissions

### Brand Not in List
- Go to Brands section
- Add the brand
- Make sure "Is active" is checked
- Save and refresh the product form

### Duplicate Size Error
- Each product can only have one entry per size
- Edit existing size instead of adding duplicate
- Or delete the old size entry first

## Support
For issues or questions, check:
1. Django error logs in terminal
2. Browser console for JavaScript errors
3. Network tab for API request failures
