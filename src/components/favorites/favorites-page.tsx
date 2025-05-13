
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface FavoritesPageProps {
  favorites: string[];
  onClose: () => void;
  onRemoveFromFavorites: (id: string) => void;
  onAddToCart: (id: string) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  favorites, 
  onClose, 
  onRemoveFromFavorites,
  onAddToCart
}) => {
  // Check if we have products to display
  const hasProducts = favorites && favorites.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Favorites ({favorites.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {!hasProducts ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't added any favorites yet</p>
              <Button variant="outline" className="mt-4" onClick={onClose}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map(productId => (
                <ProductCard 
                  key={productId} 
                  productId={productId} 
                  onRemove={onRemoveFromFavorites}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate component to fetch and display product information
const ProductCard = ({ 
  productId, 
  onRemove, 
  onAddToCart 
}: { 
  productId: string; 
  onRemove: (id: string) => void;
  onAddToCart: (id: string) => void;
}) => {
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-40 bg-gray-100 animate-pulse"></div>
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-4 w-2/3 bg-gray-100 animate-pulse rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'}
            alt={product.title}
            className="w-full h-40 object-cover"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1 right-1 bg-white/80 hover:bg-white"
            onClick={() => onRemove(productId)}
          >
            <X size={16} />
          </Button>
        </div>
        <div className="p-3">
          <h3 className="font-medium line-clamp-1">{product.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-primary font-semibold">₹{product.price}/day</span>
            <span className="text-xs px-2 py-1 bg-rewear-gray rounded-full">{product.size}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3"
            onClick={() => onAddToCart(productId)}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Import at the top
import { supabase } from '@/lib/supabase';

export default FavoritesPage;
