from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import Brand, Product, ProductImage, ProductSize


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['logo_preview', 'name', 'product_count', 'is_active', 'website', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']
    readonly_fields = ['logo_preview', 'created_at', 'product_count_detail']
    fieldsets = (
        ('Brand Information', {
            'fields': ('name', 'description', 'website', 'is_active')
        }),
        ('Logo', {
            'fields': ('logo', 'logo_preview'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('product_count_detail', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def product_count(self, obj):
        # Count products by brand name (CharField)
        return Product.objects.filter(brand=obj.name).count()
    product_count.short_description = 'Products'
    
    def product_count_detail(self, obj):
        # Count products by brand name (CharField)
        count = Product.objects.filter(brand=obj.name).count()
        return format_html(
            '<strong>{}</strong> products using this brand',
            count
        )
    product_count_detail.short_description = 'Total Products'
    
    actions = ['activate_brands', 'deactivate_brands']
    
    def activate_brands(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} brands activated.')
    activate_brands.short_description = 'Activate selected brands'
    
    def deactivate_brands(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} brands deactivated.')
    deactivate_brands.short_description = 'Deactivate selected brands'


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image_preview', 'image', 'image_url', 'order', 'alt_text']
    readonly_fields = ['image_preview']
    classes = ['collapse']


class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 3
    fields = ['size', 'stock', 'is_available']
    list_editable = ['stock', 'is_available']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'image_preview', 'name', 'brand', 'category', 'price', 
        'discount_percentage', 'stock_status', 'is_new', 'is_sale', 
        'is_featured', 'created_at'
    ]
    list_filter = [
        'category', 'is_new', 'is_sale', 'is_featured', 
        'brand', 'created_at', 'updated_at'
    ]
    search_fields = ['name', 'brand', 'description_uz', 'description_ru']
    list_editable = ['is_new', 'is_sale', 'is_featured']
    inlines = [ProductImageInline, ProductSizeInline]
    readonly_fields = [
        'image_preview', 'discount_percentage', 'created_at', 
        'updated_at', 'total_stock', 'available_brands'
    ]
    list_per_page = 20
    date_hierarchy = 'created_at'
    save_on_top = True
    
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'brand', 'available_brands', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'discount_percentage'),
            'description': 'Set pricing. Original price is optional (for sale items).'
        }),
        ('Images', {
            'fields': ('image', 'image_url', 'image_preview'),
            'description': 'Upload an image OR provide an image URL (not both).'
        }),
        ('Descriptions', {
            'fields': ('description_uz', 'description_ru'),
            'classes': ('collapse',)
        }),
        ('Inventory & Status', {
            'fields': (
                'stock_quantity', 'total_stock', 'is_new', 
                'is_sale', 'is_featured'
            ),
            'description': 'Manage stock and product status flags.'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'mark_as_new', 'remove_new_flag', 'mark_as_sale', 
        'remove_sale_flag', 'feature_products', 'unfeature_products',
        'duplicate_products'
    ]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('sizes')
    
    def available_brands(self, obj):
        """Show list of available brands from Brand model"""
        brands = Brand.objects.filter(is_active=True).values_list('name', flat=True)
        return format_html(
            '<div style="background: #f8f9fa; padding: 10px; border-radius: 4px;">'
            '<strong>Available Brands:</strong><br>{}</div>',
            ', '.join(brands) if brands else 'No brands defined - add them in Brands section'
        )
    available_brands.short_description = 'Available Brands'
    def stock_status(self, obj):
        total = obj.sizes.aggregate(total=Sum('stock'))['total'] or 0
        if total == 0:
            color = 'red'
            status = 'Out of Stock'
        elif total < 10:
            color = 'orange'
            status = f'{total} items'
        else:
            color = 'green'
            status = f'{total} items'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    stock_status.short_description = 'Stock'
    
    def total_stock(self, obj):
        total = obj.sizes.aggregate(total=Sum('stock'))['total'] or 0
        return format_html(
            '<strong>{}</strong> items across all sizes',
            total
        )
    total_stock.short_description = 'Total Stock'
    
    # Bulk Actions
    def mark_as_new(self, request, queryset):
        updated = queryset.update(is_new=True)
        self.message_user(request, f'{updated} products marked as new.')
    mark_as_new.short_description = 'Mark as NEW'
    
    def remove_new_flag(self, request, queryset):
        updated = queryset.update(is_new=False)
        self.message_user(request, f'NEW flag removed from {updated} products.')
    remove_new_flag.short_description = 'Remove NEW flag'
    
    def mark_as_sale(self, request, queryset):
        updated = queryset.update(is_sale=True)
        self.message_user(request, f'{updated} products marked as SALE.')
    mark_as_sale.short_description = 'Mark as SALE'
    
    def remove_sale_flag(self, request, queryset):
        updated = queryset.update(is_sale=False)
        self.message_user(request, f'SALE flag removed from {updated} products.')
    remove_sale_flag.short_description = 'Remove SALE flag'
    
    def feature_products(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} products marked as featured.')
    feature_products.short_description = 'Feature on homepage'
    
    def unfeature_products(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} products removed from featured.')
    unfeature_products.short_description = 'Remove from featured'
    
    def duplicate_products(self, request, queryset):
        for product in queryset:
            # Store related data before duplicating
            sizes = list(product.sizes.all())
            images = list(product.images.all())
            
            # Duplicate product
            product.pk = None
            product.name = f"{product.name} (Copy)"
            product.save()
            
            # Duplicate sizes
            for size in sizes:
                size.pk = None
                size.product = product
                size.save()
            
            # Duplicate images
            for image in images:
                image.pk = None
                image.product = product
                image.save()
        
        self.message_user(request, f'{queryset.count()} products duplicated.')
    duplicate_products.short_description = 'Duplicate selected products'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'product', 'order', 'alt_text']
    list_filter = ['product__brand', 'product__category']
    search_fields = ['product__name', 'alt_text']
    list_editable = ['order']
    readonly_fields = ['image_preview']
    fields = ['product', 'image', 'image_url', 'image_preview', 'order', 'alt_text']


@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ['product', 'size', 'stock', 'is_available']
    list_filter = ['is_available', 'size', 'product__brand']
    search_fields = ['product__name']
    list_editable = ['stock', 'is_available']
    
    actions = ['mark_available', 'mark_unavailable', 'restock']
    
    def mark_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} sizes marked as available.')
    mark_available.short_description = 'Mark as available'
    
    def mark_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} sizes marked as unavailable.')
    mark_unavailable.short_description = 'Mark as unavailable'
    
    def restock(self, request, queryset):
        updated = queryset.update(stock=10, is_available=True)
        self.message_user(request, f'{updated} sizes restocked with 10 items each.')
    restock.short_description = 'Restock (set to 10 items)'


# Customize admin site headers
admin.site.site_header = "E-Commerce Admin Panel"
admin.site.site_title = "E-Commerce Admin"
admin.site.index_title = "Welcome to E-Commerce Management"
