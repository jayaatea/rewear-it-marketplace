
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { mockProducts } from '@/data/products';

interface FavoritesPageProps {
  favorites: number[];
  onClose: () => void;
  onRemoveFromFavorites: (id: number) => void;
  onAddToCart: (id: number) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ 
  favorites, 
  onClose, 
  onRemoveFromFavorites,
  onAddToCart
}) => {
  const favoriteProducts = mockProducts.filter(product => favorites.includes(product.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Favorites ({favoriteProducts.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't added any favorites yet</p>
              <Button variant="outline" className="mt-4" onClick={onClose}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 object-cover"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                        onClick={() => onRemoveFromFavorites(product.id)}
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
                        onClick={() => onAddToCart(product.id)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
