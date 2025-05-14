
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { AnimatedContainer } from '@/components/animated-container';

type FormType = 'login' | 'signup';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [formType, setFormType] = useState<FormType>('login');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  const handleSubmitStep1 = (e: React.FormEvent) => {
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
    
    // Mock sending OTP
    toast({
      title: `OTP Sent`,
      description: `A verification code has been sent to your ${method}`,
    });
    
    setStep(2);
  };
  
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid verification code",
        variant: "destructive"
      });
      return;
    }
    
    // Mock successful verification
    toast({
      title: "Success!",
      description: formType === 'login' ? "Login successful" : "Account created successfully",
    });
    
    onSuccess();
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
              <Button className="w-full" type="submit">Continue</Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP sent to you"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to {method === 'email' ? email : phone}
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" type="button" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button className="flex-1" type="submit">
                  Verify & Login
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
              <Button className="w-full" type="submit">Continue</Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-otp">Verification Code</Label>
                <Input
                  id="signup-otp"
                  type="text"
                  placeholder="Enter the OTP sent to you"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to {method === 'email' ? email : phone}
                </p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" type="button" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button className="flex-1" type="submit">
                  Create Account
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
