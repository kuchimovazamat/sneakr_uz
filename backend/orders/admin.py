from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'price', 'subtotal_display']
    fields = ['product', 'size', 'quantity', 'price', 'subtotal_display']
    can_delete = False
    
    def subtotal_display(self, obj):
        if obj.id:
            return format_html('<strong>{:,.0f}</strong> UZS', float(obj.get_subtotal()))
        return '-'
    subtotal_display.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer_name', 'customer_phone', 'status_badge',
        'items_count', 'total_amount_display', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'updated_at']
    search_fields = [
        'customer_name', 'customer_phone', 'customer_email', 
        'shipping_address', 'shipping_city', 'notes'
    ]
    list_editable = []
    inlines = [OrderItemInline]
    readonly_fields = [
        'created_at', 'updated_at', 'items_count', 
        'total_items', 'order_summary'
    ]
    date_hierarchy = 'created_at'
    list_per_page = 25
    save_on_top = True
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_phone', 'customer_email'),
            'description': 'Required: Name and Phone. Email is optional.'
        }),
        ('Shipping Details (Optional)', {
            'fields': (
                'shipping_address', 'shipping_city', 
                'shipping_postal_code'
            ),
            'classes': ('collapse',)
        }),
        ('Order Details', {
            'fields': ('status', 'total_amount', 'notes', 'order_summary')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = [
        'mark_as_pending', 'mark_as_processing', 
        'mark_as_shipped', 'mark_as_delivered', 'mark_as_cancelled'
    ]
    
    def status_badge(self, obj):
        colors = {
            'pending': '#fbbf24',     # yellow
            'processing': '#3b82f6',  # blue
            'shipped': '#8b5cf6',     # purple
            'delivered': '#10b981',   # green
            'cancelled': '#ef4444',   # red
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 12px; '
            'border-radius: 12px; font-size: 12px; font-weight: 600;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def items_count(self, obj):
        count = obj.items.count()
        return format_html('<strong>{}</strong> items', count)
    items_count.short_description = 'Items'
    
    def total_amount_display(self, obj):
        amount = f'{float(obj.total_amount):,.0f}'
        return format_html(
            '<strong style="color: #10b981;">{} UZS</strong>', 
            amount
        )
    total_amount_display.short_description = 'Total'
    total_amount_display.admin_order_field = 'total_amount'
    
    def total_items(self, obj):
        total = obj.items.aggregate(
            total_quantity=Sum('quantity')
        )['total_quantity'] or 0
        return format_html('<strong>{}</strong> items total', total)
    total_items.short_description = 'Total Quantity'
    
    def order_summary(self, obj):
        if not obj.id:
            return '-'
        
        items_html = ''
        for item in obj.items.all():
            items_html += f'''
                <tr>
                    <td style="padding: 8px;">{item.product.name}</td>
                    <td style="padding: 8px;">Size {item.size}</td>
                    <td style="padding: 8px; text-align: center;">{item.quantity}</td>
                    <td style="padding: 8px; text-align: right;">{float(item.price):,.0f} UZS</td>
                    <td style="padding: 8px; text-align: right; font-weight: bold;">{float(item.get_subtotal()):,.0f} UZS</td>
                </tr>
            '''
        
        return format_html(
            '''
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #e5e7eb;">
                            <th style="padding: 8px; text-align: left;">Product</th>
                            <th style="padding: 8px; text-align: left;">Size</th>
                            <th style="padding: 8px; text-align: center;">Qty</th>
                            <th style="padding: 8px; text-align: right;">Price</th>
                            <th style="padding: 8px; text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {}
                    </tbody>
                    <tfoot>
                        <tr style="background: #e5e7eb; font-weight: bold;">
                            <td colspan="4" style="padding: 8px; text-align: right;">TOTAL:</td>
                            <td style="padding: 8px; text-align: right; color: #10b981;">{:,.0f} UZS</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            ''',
            items_html, float(obj.total_amount)
        )
    order_summary.short_description = 'Order Summary'
    
    # Bulk Actions
    def mark_as_pending(self, request, queryset):
        updated = queryset.update(status='pending')
        self.message_user(request, f'{updated} orders marked as pending.')
    mark_as_pending.short_description = 'Mark as Pending'
    
    def mark_as_processing(self, request, queryset):
        updated = queryset.update(status='processing')
        self.message_user(request, f'{updated} orders marked as processing.')
    mark_as_processing.short_description = 'Mark as Processing'
    
    def mark_as_shipped(self, request, queryset):
        updated = queryset.update(status='shipped')
        self.message_user(request, f'{updated} orders marked as shipped.')
    mark_as_shipped.short_description = 'Mark as Shipped'
    
    def mark_as_delivered(self, request, queryset):
        updated = queryset.update(status='delivered')
        self.message_user(request, f'{updated} orders marked as delivered.')
    mark_as_delivered.short_description = 'Mark as Delivered'
    
    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} orders marked as cancelled.')
    mark_as_cancelled.short_description = 'Mark as Cancelled'
