from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer, ProductCreateSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'brand', 'category']
    ordering_fields = ['price', 'created_at', 'name']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateSerializer
        return ProductSerializer
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category', None)
        if category:
            products = self.queryset.filter(category=category)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category parameter is required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        products = self.queryset.filter(is_new=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        products = self.queryset.filter(is_sale=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
