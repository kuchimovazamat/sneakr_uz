from rest_framework import serializers
from .models import Product, ProductImage, ProductSize


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['image_url']
    
    def get_image_url(self, obj):
        return obj.get_image_url()


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['size']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    sizes = ProductSizeSerializer(many=True, read_only=True)
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'price', 'original_price', 
            'image', 'images', 'sizes', 'category', 'is_new', 
            'is_sale', 'description', 'created_at', 'updated_at'
        ]
    
    def get_image(self, obj):
        return obj.get_image_url()
    
    def get_description(self, obj):
        return {
            'uz': obj.description_uz,
            'ru': obj.description_ru
        }


class ProductCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.URLField(),
        write_only=True,
        required=False
    )
    sizes = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'name', 'brand', 'price', 'original_price', 
            'image', 'images', 'sizes', 'category', 'is_new', 
            'is_sale', 'description_uz', 'description_ru'
        ]
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        sizes_data = validated_data.pop('sizes', [])
        
        product = Product.objects.create(**validated_data)
        
        # Create images
        for idx, image_url in enumerate(images_data):
            ProductImage.objects.create(
                product=product,
                image_url=image_url,
                order=idx
            )
        
        # Create sizes
        for size in sizes_data:
            ProductSize.objects.create(
                product=product,
                size=size
            )
        
        return product
