from django.core.management.base import BaseCommand
from products.models import Product, ProductImage, ProductSize


class Command(BaseCommand):
    help = 'Load sample products into the database'

    def handle(self, *args, **kwargs):
        # Clear existing products
        Product.objects.all().delete()
        
        products_data = [
            {
                'name': 'Air Max 90',
                'brand': 'Nike',
                'price': 1850000,
                'original_price': 2200000,
                'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
                'images': [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
                    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
                ],
                'sizes': [40, 41, 42, 43, 44, 45],
                'category': 'men',
                'is_sale': True,
                'description_uz': 'Klassik Air Max 90 - maksimal qulaylik va zamonaviy dizayn. Yuqori sifatli materiallar va havo yostig\'i texnologiyasi.',
                'description_ru': 'Классические Air Max 90 - максимальный комфорт и современный дизайн. Высококачественные материалы и технология воздушной подушки.',
            },
            {
                'name': 'Ultraboost 22',
                'brand': 'Adidas',
                'price': 2100000,
                'image': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
                'images': [
                    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
                    'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&q=80',
                ],
                'sizes': [39, 40, 41, 42, 43, 44],
                'category': 'unisex',
                'is_new': True,
                'description_uz': 'Ultraboost 22 - eng yuqori darajadagi qulaylik. Boost texnologiyasi har bir qadamda energiya qaytaradi.',
                'description_ru': 'Ultraboost 22 - высочайший уровень комфорта. Технология Boost возвращает энергию при каждом шаге.',
            },
            {
                'name': 'RS-X³',
                'brand': 'Puma',
                'price': 1650000,
                'image': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80',
                'images': ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80'],
                'sizes': [38, 39, 40, 41, 42, 43],
                'category': 'women',
                'description_uz': 'RS-X³ - retro uslub va zamonaviy texnologiya uyg\'unligi. Kuchli taglik va yorqin dizayn.',
                'description_ru': 'RS-X³ - сочетание ретро стиля и современных технологий. Мощная подошва и яркий дизайн.',
            },
            {
                'name': 'Air Jordan 1 High',
                'brand': 'Nike',
                'price': 2800000,
                'image': 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80',
                'images': ['https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&q=80'],
                'sizes': [40, 41, 42, 43, 44, 45, 46],
                'category': 'men',
                'is_new': True,
                'description_uz': 'Air Jordan 1 High - afsonaviy basketbol krossovkasi. Premium charm va klassik dizayn.',
                'description_ru': 'Air Jordan 1 High - легендарные баскетбольные кроссовки. Премиум кожа и классический дизайн.',
            },
            {
                'name': 'New Balance 574',
                'brand': 'New Balance',
                'price': 1450000,
                'original_price': 1700000,
                'image': 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
                'images': ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80'],
                'sizes': [39, 40, 41, 42, 43, 44],
                'category': 'unisex',
                'is_sale': True,
                'description_uz': 'New Balance 574 - klassik retro dizayni bilan eng sevimli model. Qulaylik va uslub uyg\'unligi.',
                'description_ru': 'New Balance 574 - самая любимая модель с классическим ретро дизайном. Сочетание комфорта и стиля.',
            },
        ]
        
        for product_data in products_data:
            images = product_data.pop('images')
            sizes = product_data.pop('sizes')
            
            product = Product.objects.create(**product_data)
            
            # Create images
            for idx, image_url in enumerate(images):
                ProductImage.objects.create(
                    product=product,
                    image_url=image_url,
                    order=idx
                )
            
            # Create sizes
            for size in sizes:
                ProductSize.objects.create(
                    product=product,
                    size=size
                )
            
            self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully loaded {len(products_data)} products'))
