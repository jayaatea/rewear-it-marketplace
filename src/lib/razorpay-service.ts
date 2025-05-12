
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define the window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (
  amount: number, 
  cart: any[], 
  currency: string = 'INR'
): Promise<{ orderId: string } | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error('Please login to proceed with payment');
      return null;
    }
    
    // In a production environment, you would create an order on your server
    // This is just a mock implementation
    // In real world, create a Supabase Edge Function to handle this securely
    
    // Mock order ID - in production this would come from your backend
    const mockOrderId = 'order_' + Math.random().toString(36).substring(2, 15);
    
    return { orderId: mockOrderId };
  } catch (error: any) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order');
    return null;
  }
};

// Process Razorpay payment
export const processRazorpayPayment = async (
  orderId: string,
  amount: number,
  currency: string = 'INR',
  userDetails: {
    name: string;
    email: string;
    contact?: string;
  }
): Promise<boolean> => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) return false;

    return new Promise((resolve) => {
      const options = {
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your actual Razorpay key
        amount: amount * 100, // Razorpay expects amount in paise (100 paise = ₹1)
        currency,
        name: 'ReWear',
        description: 'Rental Payment',
        order_id: orderId,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact || '',
        },
        theme: {
          color: '#6366f1',
        },
        handler: function (response: any) {
          // Handle successful payment
          // In production, verify the payment signature on your server
          toast.success('Payment successful!');
          resolve(true);
        },
        modal: {
          ondismiss: function() {
            toast.error('Payment cancelled');
            resolve(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  } catch (error: any) {
    console.error('Error processing payment:', error);
    toast.error('Payment failed');
    return false;
  }
};

// Save order to database after successful payment
export const saveOrder = async (
  cartItems: any[],
  paymentId: string,
  totalAmount: number
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    // Here you would save the order details to your database
    // This is where you'd implement the actual order saving logic
    
    // Clear cart after successful order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userData.user.id);
      
    return true;
  } catch (error: any) {
    console.error('Error saving order:', error);
    toast.error('Failed to save order');
    return false;
  }
};
