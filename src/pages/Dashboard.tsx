
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkout } from '@/components/cart/checkout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SidebarFilters, FilterOptions } from '@/components/dashboard/sidebar-filters';
import { mockProducts } from '@/data/products';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import CartPage from '@/components/cart/cart-page';
import FavoritesPage from '@/components/favorites/favorites-page';

interface DashboardProps {
  onMessageOwner?: (productId: number, title: string, owner: string) => void;
}

interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  image?: string;
  size?: string;
  condition?: string;
  owner?: string;
  deposit?: number;
  age?: string;
}

const Dashboard = ({ onMessageOwner }: DashboardProps) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [rentOutMode, setRentOutMode] = useState(false);

  useEffect(() => {
    // Load favorites and cart from localStorage on mount
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save to localStorage whenever these values change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleFilterChange = (filters: FilterOptions) => {
    let filteredProducts = [...mockProducts];

    // Apply category filter
    if (filters.category !== 'All Items') {
      filteredProducts = filteredProducts.filter(
        product => product.title.includes(filters.category)
      );
    }

    // Apply price filter
    filteredProducts = filteredProducts.filter(
      product => product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Apply size filter
    if (filters.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => product.size && filters.sizes.includes(product.size)
      );
    }

    // Apply condition filter
    if (filters.conditions.length > 0) {
      filteredProducts = filteredProducts.filter(
        product => product.condition && filters.conditions.includes(product.condition)
      );
    }

    setProducts(filteredProducts);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        toast({ title: "Removed from favorites" });
        return prev.filter(id => id !== productId);
      } else {
        toast({ title: "Added to favorites" });
        return [...prev, productId];
      }
    });
  };

  const addToCart = (productId: number) => {
    if (!cartItems.includes(productId)) {
      setCartItems(prev => [...prev, productId]);
      toast({ title: "Added to cart" });
    } else {
      toast({ title: "Already in cart" });
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(id => id !== productId));
    toast({ title: "Removed from cart" });
  };

  const removeFromFavorites = (productId: number) => {
    setFavorites(prev => prev.filter(id => id !== productId));
    toast({ title: "Removed from favorites" });
  };

  const openCheckout = (product: Product) => {
    setSelectedProduct(product);
    setCheckoutOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSuccess = () => {
    setCheckoutOpen(false);
    setSelectedProduct(null);
  };

  const handleRentOutToggle = () => {
    setRentOutMode(!rentOutMode);
    if (!rentOutMode) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">ReWear Marketplace</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="relative" 
              onClick={() => setIsFavoritesOpen(true)}
            >
              <Heart className="mr-2 h-4 w-4" />
              Favorites
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="relative" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
            
            <Button onClick={handleRentOutToggle}>
              {rentOutMode ? "Browse Items" : "Rent Out Item"}
            </Button>
          </div>
        </div>

        {isFavoritesOpen && (
          <FavoritesPage 
            favorites={favorites} 
            onClose={() => setIsFavoritesOpen(false)}
            onRemoveFromFavorites={removeFromFavorites}
            onAddToCart={addToCart}
          />
        )}

        {isCartOpen && (
          <CartPage 
            cartItems={cartItems} 
            onClose={() => setIsCartOpen(false)}
            onRemoveFromCart={removeFromCart}
            onMessageOwner={(productId) => {
              const product = mockProducts.find(p => p.id === productId);
              if (product && onMessageOwner) {
                onMessageOwner(
                  product.id,
                  product.title,
                  product.owner || "ReWear Staff"
                );
                setIsCartOpen(false);
              }
            }}
          />
        )}

        {checkoutOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Complete Your Purchase</h2>
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedProduct.image || selectedProduct.imageUrl} 
                  alt={selectedProduct.title} 
                  className="w-20 h-20 object-cover rounded-md" 
                />
                <div>
                  <h3 className="font-semibold">{selectedProduct.title}</h3>
                  <p className="text-gray-500">₹{selectedProduct.price.toFixed(2)}</p>
                </div>
              </div>
              
              <Checkout 
                amount={selectedProduct.price} 
                onSuccess={handleCheckoutSuccess} 
              />
              
              <Button 
                variant="outline" 
                className="mt-4 w-full" 
                onClick={() => setCheckoutOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {rentOutMode ? (
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Rent Out Your Item</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="e.g., Floral Summer Dress"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Dress</option>
                  <option>Jacket</option>
                  <option>Suit</option>
                  <option>T-Shirt</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <select className="w-full p-2 border rounded-md">
                  <option>XS</option>
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Condition</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Like New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rental Price (₹ per day)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="e.g., 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deposit Amount (₹)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md" 
                  placeholder="e.g., 2000"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  className="w-full p-2 border rounded-md h-24" 
                  placeholder="Describe your item in detail..."
                ></textarea>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Upload Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <p className="text-sm text-gray-500">Drag and drop images or click to browse</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="image-upload" 
                    multiple 
                  />
                  <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()} className="mt-2">
                    Select Images
                  </Button>
                </div>
              </div>
              <div className="col-span-2 mt-4">
                <Button className="w-full">List Your Item</Button>
              </div>
            </div>
          </div>
        ) : (
          <SidebarProvider defaultOpen={true}>
            <div className="flex w-full">
              <SidebarFilters onFilterChange={handleFilterChange} />
              
              <main className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0 relative">
                        <img 
                          src={product.image || product.imageUrl} 
                          alt={product.title} 
                          className="w-full h-60 object-cover" 
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${favorites.includes(product.id) ? 'text-red-500' : 'text-gray-500'}`}
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart 
                            className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} 
                          />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <p className="text-gray-500 text-sm mt-1">{product.description || `Rent this ${product.title} from our collection.`}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {product.size && <Badge variant="outline">{product.size}</Badge>}
                          {product.condition && <Badge variant="secondary">{product.condition}</Badge>}
                          {product.age && <Badge variant="outline">{product.age}</Badge>}
                        </div>
                        <div className="mt-4">
                          <p className="font-bold">Rental Price: ₹{product.price.toFixed(2)}</p>
                          {product.deposit && <p className="text-sm text-gray-600">Deposit: ₹{product.deposit.toFixed(2)}</p>}
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                        <div className="flex justify-between w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onMessageOwner && onMessageOwner(
                              product.id, 
                              product.title, 
                              product.owner || "ReWear Staff"
                            )}
                          >
                            Message Owner
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => addToCart(product.id)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => openCheckout(product)}
                        >
                          Rent Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </main>
            </div>
          </SidebarProvider>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
