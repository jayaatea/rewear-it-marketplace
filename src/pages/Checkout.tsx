
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedContainer } from '@/components/animated-container';
import { useAuth } from '@/hooks/use-auth';
import { getUserCart } from '@/lib/product-service';
import { createRazorpayOrder, processRazorpayPayment } from '@/lib/razorpay-service';
import { toast } from 'sonner';
import RewearLogo from '@/components/rewear-logo';

interface CartItem {
  id: string;
  product_id: string;
  rental_start_date: string | null;
  rental_end_date: string | null;
  products: {
    id: string;
    title: string;
    price: number;
    deposit: number;
    image_url: string | null;
    size: string | null;
    condition: string | null;
  };
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phone: ''
  });
  
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        toast.error('Please login to proceed');
        navigate('/');
        return;
      }
      
      try {
        const cartItems = await getUserCart(user.id);
        setCart(cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [user, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateSelect = (itemId: string, type: 'start' | 'end', date: Date) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          [type === 'start' ? 'rental_start_date' : 'rental_end_date']: date.toISOString()
        };
      }
      return item;
    }));
  };
  
  const calculateDays = (startDate: string | null, endDate: string | null): number => {
    if (!startDate || !endDate) return 1;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  };
  
  const calculateSubtotal = (): number => {
    return cart.reduce((total, item) => {
      const days = calculateDays(item.rental_start_date, item.rental_end_date);
      return total + (item.products.price * days);
    }, 0);
  };
  
  const calculateDeposit = (): number => {
    return cart.reduce((total, item) => {
      return total + (item.products.deposit || 0);
    }, 0);
  };
  
  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateDeposit();
  };
  
  const handleCheckout = async () => {
    // Validate inputs
    const { fullName, address, city, state, postalCode, phone } = shippingDetails;
    if (!fullName || !address || !city || !state || !postalCode || !phone) {
      toast.error('Please fill in all shipping details');
      return;
    }
    
    // Validate dates for all items
    for (const item of cart) {
      if (!item.rental_start_date || !item.rental_end_date) {
        toast.error('Please select rental dates for all items');
        return;
      }
    }
    
    try {
      setProcessingPayment(true);
      
      // Create Razorpay order
      const orderResponse = await createRazorpayOrder(
        calculateTotal(), 
        cart
      );
      
      if (!orderResponse) {
        toast.error('Failed to create order');
        return;
      }
      
      // Process payment
      const paymentSuccess = await processRazorpayPayment(
        orderResponse.orderId,
        calculateTotal(),
        'INR',
        {
          name: shippingDetails.fullName,
          email: user?.email || '',
          contact: shippingDetails.phone
        }
      );
      
      if (paymentSuccess) {
        // Navigate to success page or show success message
        navigate('/dashboard', { state: { paymentSuccess: true } });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading your cart...</p>
        </div>
      </div>
    );
  }
  
  if (!cart.length) {
    return (
      <AnimatedContainer>
        <div className="container px-4 py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button onClick={() => navigate('/dashboard')}>Browse Items</Button>
        </div>
      </AnimatedContainer>
    );
  }
  
  return (
    <AnimatedContainer>
      <header className="border-b py-4">
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <RewearLogo size="sm" showImage={true} />
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      name="fullName" 
                      value={shippingDetails.fullName}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode" 
                      name="postalCode" 
                      value={shippingDetails.postalCode}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Items */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Rental Items</h2>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4 pb-4 border-b">
                      <div className="w-full md:w-1/4">
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={item.products.image_url || 'https://via.placeholder.com/150'} 
                            alt={item.products.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.products.title}</h3>
                        <p className="text-muted-foreground text-sm mb-1">
                          Size: {item.products.size || 'N/A'} | Condition: {item.products.condition || 'N/A'}
                        </p>
                        <p className="text-primary font-semibold mb-2">₹{item.products.price}/day</p>
                        <p className="text-sm text-muted-foreground mb-3">Security Deposit: ₹{item.products.deposit}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm mb-1 block">Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {item.rental_start_date ? (
                                    format(new Date(item.rental_start_date), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={item.rental_start_date ? new Date(item.rental_start_date) : undefined}
                                  onSelect={(date) => date && handleDateSelect(item.id, 'start', date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {item.rental_end_date ? (
                                    format(new Date(item.rental_end_date), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={item.rental_end_date ? new Date(item.rental_end_date) : undefined}
                                  onSelect={(date) => date && handleDateSelect(item.id, 'end', date)}
                                  fromDate={item.rental_start_date ? new Date(item.rental_start_date) : undefined}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        {item.rental_start_date && item.rental_end_date && (
                          <div className="mt-2 text-sm">
                            Rental Duration: <span className="font-semibold">
                              {calculateDays(item.rental_start_date, item.rental_end_date)} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Deposit</span>
                    <span>₹{calculateDeposit()}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Security deposit will be refunded after the item is returned in good condition
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Pay ₹{calculateTotal()}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
};

export default Checkout;
