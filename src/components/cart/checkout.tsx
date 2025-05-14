
import { useState } from 'react';
import { useRazorpay } from '@/services/razorpay';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, QrCode, Wallet } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CheckoutProps {
  amount: number;
  onSuccess?: () => void;
}

const GPay_QR_URL = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"; // Placeholder QR code

export function Checkout({ amount, onSuccess }: CheckoutProps) {
  const { user } = useAuth();
  const { initiatePayment } = useRazorpay();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive"
      });
      return;
    }

    if (paymentMethod === "cod") {
      toast({
        title: "Order Placed",
        description: "Your order has been placed successfully. You will pay on delivery."
      });
      if (onSuccess) onSuccess();
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Choose your payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="online" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="online">Online Payment</TabsTrigger>
            <TabsTrigger value="qr">Scan QR</TabsTrigger>
            <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="online">
            <div className="space-y-4 pt-4">
              <RadioGroup defaultValue="card" onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center">
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>Pay via UPI</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="contacts" id="contacts" />
                  <Label htmlFor="contacts" className="flex items-center">
                    <Wallet className="h-4 w-4 mr-2" />
                    <span>Pay via Contacts</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="qr">
            <div className="pt-4 flex flex-col items-center">
              <h3 className="text-center mb-4">Scan to pay</h3>
              <div className="border p-3 rounded-md">
                <img src={GPay_QR_URL} alt="GPay QR Code" className="w-64 h-64" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Scan this QR code with any UPI app</p>
            </div>
          </TabsContent>
          
          <TabsContent value="cod">
            <div className="pt-4">
              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Cash on Delivery</h3>
                <p className="text-sm text-muted-foreground mb-4">Pay when your order is delivered</p>
                <RadioGroup defaultValue="cod" onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod">Pay on delivery</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
