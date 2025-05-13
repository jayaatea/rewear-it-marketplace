
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CartPageProps {
  cartItems: string[];
  onClose: () => void;
  onRemoveFromCart: (id: string) => void;
  onMessageOwner: (productId: string) => void;
  onCheckout: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ 
  cartItems, 
  onClose, 
  onRemoveFromCart, 
  onMessageOwner,
  onCheckout 
}) => {
  const { toast } = useToast();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch product details for cart items
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!cartItems.length) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', cartItems);
          
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching cart products:', err);
        toast({
          title: "Error",
          description: "Could not load cart items",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [cartItems, toast]);

  const total = products.reduce((sum, product) => sum + product.price, 0);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col p-6">
          <p className="text-center">Loading cart items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Your Cart ({products.length})</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
              <Button variant="outline" className="mt-4" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-20 h-20 sm:w-32 sm:h-32">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 p-3 flex flex-col">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{product.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRemoveFromCart(product.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-primary font-semibold">₹{product.price}/day</span>
                          <span className="text-xs text-muted-foreground">Size: {product.size}</span>
                        </div>
                        <div className="mt-auto">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs flex items-center gap-1"
                            onClick={() => onMessageOwner(product.id)}
                          >
                            <MessageSquare size={14} />
                            Message Owner
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {products.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total Rental (per day)</span>
              <span className="text-primary font-semibold">₹{total}</span>
            </div>
            <Button className="w-full" onClick={onCheckout}>Proceed to Checkout</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
