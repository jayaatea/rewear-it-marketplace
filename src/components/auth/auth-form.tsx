
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AnimatedContainer } from '@/components/animated-container';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';

type FormType = 'login' | 'signup';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { signIn, signUp, verifyOtp } = useAuth();
  const [formType, setFormType] = useState<FormType>('login');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (method === 'email' && !email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    if (method === 'phone' && !phone) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }
    
    if (formType === 'signup' && !name) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (formType === 'login') {
        await signIn(email);
      } else {
        await signUp(email, name, phone);
      }
      
      setStep(2);
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await verifyOtp(email, otp);
      onSuccess();
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    setStep(1);
    setOtp('');
  };
  
  return (
    <AnimatedContainer>
      <Tabs 
        defaultValue="login" 
        className="w-full" 
        onValueChange={(value) => setFormType(value as FormType)}
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className="space-y-4">
          {step === 1 ? (
            <form onSubmit={handleSubmitStep1} className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={method === 'email' ? 'default' : 'outline'}
                    onClick={() => setMethod('email')}
                    className="flex-1"
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={method === 'phone' ? 'default' : 'outline'}
                    onClick={() => setMethod('phone')}
                    className="flex-1"
                    disabled
                  >
                    Phone
                  </Button>
                </div>
                
                {method === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending verification..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="flex justify-center my-4">
                  <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  We've sent a verification code to {email}
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" type="button" onClick={handleBack} className="flex-1" disabled={isLoading}>
                  Back
                </Button>
                <Button className="flex-1" type="submit" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>
              </div>
            </form>
          )}
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4">
          {step === 1 ? (
            <form onSubmit={handleSubmitStep1} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={method === 'email' ? 'default' : 'outline'}
                    onClick={() => setMethod('email')}
                    className="flex-1"
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={method === 'phone' ? 'default' : 'outline'}
                    onClick={() => setMethod('phone')}
                    className="flex-1"
                    disabled
                  >
                    Phone
                  </Button>
                </div>
                
                {method === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Sending verification..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-otp">Verification Code</Label>
                <div className="flex justify-center my-4">
                  <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  We've sent a verification code to {email}
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" type="button" onClick={handleBack} className="flex-1" disabled={isLoading}>
                  Back
                </Button>
                <Button className="flex-1" type="submit" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? "Verifying..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </AnimatedContainer>
  );
};

export default AuthForm;
