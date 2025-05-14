
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOrder {
  order_id: string;
  currency: string;
  amount: number;
  db_order_id: string;
}

interface PaymentOptions {
  amount: number;
  userId: string;
  currency?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const useRazorpay = () => {
  const { toast } = useToast();

  // Inject Razorpay script if not already loaded
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        toast({
          title: "Payment Error",
          description: "Could not load payment gateway",
          variant: "destructive"
        });
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createOrder = async (options: PaymentOptions): Promise<RazorpayOrder | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: options.amount,
          currency: options.currency || 'INR',
          userId: options.userId
        }
      });

      if (error) throw new Error(error.message);
      return data;
    } catch (error: any) {
      toast({
        title: "Order Creation Failed",
        description: error.message || "Could not create payment order",
        variant: "destructive"
      });
      return null;
    }
  };

  const initiatePayment = async (options: PaymentOptions): Promise<void> => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) return;

    const orderData = await createOrder(options);
    if (!orderData) return;

    try {
      const { session } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const rzp = new window.Razorpay({
        key: 'rzp_test_YourTestKeyHere', // Replace with your Razorpay key
        amount: orderData.amount * 100, // Amount in smallest currency unit
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: 'ReWear',
        description: 'Clothing Rental Payment',
        prefill: {
          name: profile?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#6366F1'
        },
        handler: async function (response: any) {
          // Verify payment on server
          try {
            const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                db_order_id: orderData.db_order_id
              }
            });
            
            if (error) throw new Error(error.message);
            
            toast({
              title: "Payment Successful",
              description: "Your payment has been processed successfully."
            });
            
            if (options.onSuccess) {
              options.onSuccess(response);
            }
          } catch (verifyError: any) {
            toast({
              title: "Payment Verification Failed",
              description: verifyError.message || "Could not verify payment",
              variant: "destructive"
            });
            
            if (options.onError) {
              options.onError(verifyError);
            }
          }
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process."
            });
          }
        }
      });

      rzp.open();
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Could not initiate payment",
        variant: "destructive"
      });
      
      if (options.onError) {
        options.onError(error);
      }
    }
  };

  return { initiatePayment };
};
