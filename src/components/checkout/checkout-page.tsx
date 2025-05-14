
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { mockProducts } from '@/data/products';
import { useToast } from '@/hooks/use-toast';

interface CheckoutPageProps {
  cartItems: number[];
  onClose: () => void;
  onCompleteOrder: () => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onClose, onCompleteOrder }) => {
  const { toast } = useToast();
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const cartProducts = mockProducts.filter(product => cartItems.includes(product.id));
  const subtotal = cartProducts.reduce((sum, product) => sum + product.price, 0);
  const deposit = cartProducts.reduce((sum, product) => sum + product.deposit, 0);
  const total = subtotal + deposit;

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your rental order has been placed successfully.",
      });
      setLoading(false);
      onCompleteOrder();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Complete Your Rental</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Billing Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={billingInfo.name}
                        onChange={handleBillingInfoChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        value={billingInfo.email}
                        onChange={handleBillingInfoChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel"
                        value={billingInfo.phone}
                        onChange={handleBillingInfoChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={billingInfo.address}
                        onChange={handleBillingInfoChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={billingInfo.city}
                          onChange={handleBillingInfoChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state" 
                          value={billingInfo.state}
                          onChange={handleBillingInfoChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        value={billingInfo.zipCode}
                        onChange={handleBillingInfoChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input 
                        id="cardName" 
                        name="cardName" 
                        value={paymentInfo.cardName}
                        onChange={handlePaymentInfoChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber" 
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentInfoChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input 
                          id="cardExpiry" 
                          name="cardExpiry" 
                          placeholder="MM/YY"
                          value={paymentInfo.cardExpiry}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input 
                          id="cardCvv" 
                          name="cardCvv" 
                          placeholder="123"
                          value={paymentInfo.cardCvv}
                          onChange={handlePaymentInfoChange}
                          required
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.title}</h4>
                          <div className="flex justify-between mt-1 text-sm">
                            <span>₹{product.price}/day</span>
                            <span className="text-xs text-muted-foreground">Size: {product.size}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Security Deposit: ₹{product.deposit}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-3 py-3 border-t border-b">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal (per day)</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security Deposit</span>
                  <span>₹{deposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹0</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-4 font-medium text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Complete Payment"}
              </Button>
              
              <p className="text-xs text-center mt-4 text-muted-foreground">
                By completing this payment, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
