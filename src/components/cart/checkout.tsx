
import { useState } from 'react';
import { useRazorpay } from '@/services/razorpay';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CheckoutProps {
  amount: number;
  onSuccess?: () => void;
}

export function Checkout({ amount, onSuccess }: CheckoutProps) {
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      await initiatePayment({
        amount,
        userId: user.id,
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          console.error("Payment error:", error);
        }
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading || amount <= 0}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ₹${amount.toFixed(2)}`
      )}
    </Button>
  );
}
