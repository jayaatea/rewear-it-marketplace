
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getUserCart } from '@/lib/product-service';
import { processRazorpayPayment, createRazorpayOrder, saveOrder } from '@/lib/razorpay-service';
import { CartItem } from '@/types/cart';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  
  const subtotal = cartItems.reduce((total, item) => total + item.products.price, 0);
  const deliveryFee = 150;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + serviceFee;

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (loading) return;
      
      if (!user) {
        toast.error('Please log in to view your cart');
        navigate('/');
        return;
      }
      
      try {
        setLoadingCart(true);
        const userCart = await getUserCart(user.id);
        setCartItems(userCart as CartItem[]);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart items');
      } finally {
        setLoadingCart(false);
      }
    };
    
    fetchCartItems();
  }, [user, loading, navigate]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    try {
      // Create order
      const orderResult = await createRazorpayOrder(total, cartItems);
      if (!orderResult?.orderId) {
        throw new Error('Failed to create order');
      }
      
      // Process payment
      const userDetails = {
        name: user.user_metadata?.full_name || user.email || 'User',
        email: user.email || '',
      };
      
      const paymentSuccess = await processRazorpayPayment(
        orderResult.orderId,
        total,
        'INR',
        userDetails
      );
      
      if (paymentSuccess) {
        // Save order to database
        await saveOrder(cartItems, orderResult.orderId, total);
        
        toast.success('Payment successful! Your items are on the way');
        navigate('/dashboard');
      } else {
        toast.error('Payment was not completed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem processing your payment');
    }
  };

  if (loading || loadingCart) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl px-4">
        <Button 
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to shopping
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 py-4">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.products.image_url || 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3VtbWVyJTIwZHJlc3N8ZW58MHx8MHx8fDA%3D'} 
                            alt={item.products.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{item.products.title}</h3>
                          <p className="text-sm text-gray-500">Size: {item.products.size}</p>
                          <p className="text-sm text-gray-500">Condition: {item.products.condition}</p>
                          
                          <div className="flex items-center mt-1 text-sm">
                            <Calendar size={14} className="mr-1 text-gray-400" />
                            <span>
                              {item.rental_start_date ? new Date(item.rental_start_date).toLocaleDateString() : 'Not specified'} 
                              {' - '}
                              {item.rental_end_date ? new Date(item.rental_end_date).toLocaleDateString() : 'Not specified'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium">₹{item.products.price}/day</p>
                          <p className="text-xs text-gray-500 mt-1">+ ₹{item.products.deposit} deposit</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Name:</span> {user?.user_metadata?.full_name || user?.email}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {user?.email}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span> 123 Main St, Mumbai, MH 400001
                  </p>
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Currently using saved address. We'll contact you for confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Summary */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>₹{serviceFee.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Rental security deposit (₹{cartItems.reduce((total, item) => total + item.products.deposit, 0)}) 
                    will be refunded after successful return
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <CreditCard size={16} />
                  Pay Now
                </Button>
                
                <p className="text-xs text-center mt-4 text-gray-500">
                  By proceeding, you agree to our Terms of Service and confirm that you have read our Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
