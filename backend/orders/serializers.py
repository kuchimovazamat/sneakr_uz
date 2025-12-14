from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'size', 'quantity', 'price', 'subtotal']
    
    def get_subtotal(self, obj):
        return obj.get_subtotal()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_phone', 'customer_email',
            'shipping_address', 'shipping_city', 'shipping_postal_code',
            'status', 'total_amount', 'notes', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)
    customer_email = serializers.EmailField(required=False, allow_blank=True, default='')
    shipping_address = serializers.CharField(required=False, allow_blank=True, default='')
    shipping_city = serializers.CharField(required=False, allow_blank=True, default='')
    shipping_postal_code = serializers.CharField(required=False, allow_blank=True, default='')
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    
    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_phone', 'customer_email',
            'shipping_address', 'shipping_city', 'shipping_postal_code',
            'total_amount', 'notes', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                product_id=item_data['product_id'],
                size=item_data['size'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
        
        return order
