from django.db import models
from django.utils.html import mark_safe


class Brand(models.Model):
    """Brand model for managing available brands"""
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brands/', null=True, blank=True)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def logo_preview(self):
        if self.logo:
            return mark_safe(f'<img src="{self.logo.url}" width="50" height="50" style="object-fit: contain;" />')
        return "No Logo"
    logo_preview.short_description = 'Logo'


class Product(models.Model):
    CATEGORY_CHOICES = [
        ('men', 'Men'),
        ('women', 'Women'),
        ('unisex', 'Unisex'),
    ]
    
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100, help_text='Brand name - manage brands in Brands section')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True, help_text='Alternative: Use URL instead of uploading')
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    is_new = models.BooleanField(default=False, help_text='Mark as new arrival')
    is_sale = models.BooleanField(default=False, help_text='Mark as on sale')
    is_featured = models.BooleanField(default=False, help_text='Feature on homepage')
    stock_quantity = models.IntegerField(default=0, help_text='Total stock across all sizes')
    description_uz = models.TextField(verbose_name='Description (Uzbek)')
    description_ru = models.TextField(verbose_name='Description (Russian)')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
    
    def __str__(self):
        return f"{self.brand} - {self.name}"
    
    def get_image_url(self):
        """Return uploaded image or URL fallback"""
        if self.image:
            # Check if it's actually a file (has a name attribute and file exists)
            if hasattr(self.image, 'name') and self.image.name:
                try:
                    return self.image.url
                except (ValueError, AttributeError):
                    pass
        return self.image_url
    
    def image_preview(self):
        img_url = self.get_image_url()
        if img_url:
            return mark_safe(f'<img src="{img_url}" width="100" height="100" style="object-fit: cover; border-radius: 8px;" />')
        return "No Image"
    image_preview.short_description = 'Preview'
    
    def discount_percentage(self):
        if self.original_price and self.original_price > self.price:
            discount = ((self.original_price - self.price) / self.original_price) * 100
            return f"{discount:.0f}%"
        return "0%"
    discount_percentage.short_description = 'Discount'


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/', null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True, help_text='Alternative: Use URL instead of uploading')
    order = models.IntegerField(default=0, help_text='Display order (lower = first)')
    alt_text = models.CharField(max_length=200, blank=True, help_text='Alternative text for accessibility')
    
    class Meta:
        ordering = ['order']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
    
    def __str__(self):
        return f"Image {self.order} for {self.product.name}"
    
    def get_image_url(self):
        if self.image:
            # Check if it's actually a file (has a name attribute and file exists)
            if hasattr(self.image, 'name') and self.image.name:
                try:
                    return self.image.url
                except (ValueError, AttributeError):
                    pass
        return self.image_url
    
    def image_preview(self):
        img_url = self.get_image_url()
        if img_url:
            return mark_safe(f'<img src="{img_url}" width="80" height="80" style="object-fit: cover; border-radius: 4px;" />')
        return "No Image"
    image_preview.short_description = 'Preview'


class ProductSize(models.Model):
    product = models.ForeignKey(Product, related_name='sizes', on_delete=models.CASCADE)
    size = models.IntegerField(help_text='Shoe size (EU)')
    stock = models.IntegerField(default=0, help_text='Stock for this size')
    is_available = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['size']
        unique_together = ['product', 'size']
        verbose_name = 'Product Size'
        verbose_name_plural = 'Product Sizes'
    
    def __str__(self):
        return f"Size {self.size} for {self.product.name} ({self.stock} in stock)"
