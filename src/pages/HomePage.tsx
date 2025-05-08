
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RewearLogo from '@/components/rewear-logo';
import AuthForm from '@/components/auth/auth-form';
import { AnimatedContainer } from '@/components/animated-container';
import { useNavigate } from 'react-router-dom';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { IndianRupee, MessageCircle, Image } from 'lucide-react';
import LiveBackground from '@/components/live-background';

const HomePage = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    navigate('/dashboard');
  };

  const openAuthDialog = (type: 'login' | 'signup') => {
    setAuthType(type);
    setAuthDialogOpen(true);
  };

  // Conversion rate USD to INR (example rate)
  const usdToInrRate = 75;
  const formatInrPrice = (usdPrice: number) => {
    return `₹${Math.round(usdPrice * usdToInrRate)}`;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Live Background */}
      <LiveBackground />
      
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 p-4 z-20">
        <RewearLogo size="md" />
      </header>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container px-4 py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedContainer delay={300}>
              <RewearLogo size="lg" className="mb-12 inline-flex" />
            </AnimatedContainer>
            
            <AnimatedContainer delay={600} className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-rewear-blue">
                Redefining Fashion Through Sustainability
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-12">
                Browse, rent, and rewear clothing instead of buying new.
              </p>
            </AnimatedContainer>
            
            <AnimatedContainer delay={900} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => openAuthDialog('login')} 
                variant="default" 
                className="text-lg px-8 transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                Log In
              </Button>
              <Button 
                size="lg" 
                onClick={() => openAuthDialog('signup')} 
                variant="outline" 
                className="text-lg px-8 border-primary text-primary hover:text-primary-foreground transform transition-transform hover:scale-105 hover:shadow-lg"
              >
                Sign Up
              </Button>
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Visual Feature Highlights */}
      <section className="py-24 relative z-10 bg-gradient-to-b from-white/80 to-rewear-mint/50">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="bg-white/80 p-8 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="w-16 h-16 bg-rewear-mint rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">
                    <Image size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Browse & Choose</h3>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white/95">
                <p>Explore thousands of clothing items from individual lenders and brands</p>
                <div className="mt-2 text-primary font-bold">
                  <span>Starting from $10/day</span>
                  <span className="ml-2 text-rewear-pink">({formatInrPrice(10)})</span>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            {/* Feature 2 */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="bg-white/80 p-8 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="w-16 h-16 bg-rewear-pink rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">
                    <IndianRupee size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Rent & Save</h3>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white/95">
                <p>Pay a fraction of retail price and enjoy quality fashion for your events</p>
                <div className="mt-2 text-primary font-bold">
                  <span>Save up to 85% vs buying</span>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            {/* Feature 3 */}
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="bg-white/80 p-8 rounded-xl shadow-sm text-center transform transition-transform hover:scale-105 hover:shadow-lg cursor-pointer">
                  <div className="w-16 h-16 bg-rewear-blue rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Connect & Rewear</h3>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="bg-white/95">
                <p>Chat directly with owners, arrange pickup or delivery, and track your environmental impact</p>
                <button className="mt-2 text-sm px-3 py-1 bg-primary text-white rounded-md">
                  Try the chat demo
                </button>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </section>

      {/* Impact Highlights - Made more visual with less text */}
      <section className="py-24 relative z-10 bg-white/70">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-8">Your Impact</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold text-primary mb-4">85%</div>
              <p className="text-muted-foreground">Less textile waste</p>
            </div>
            
            <div className="text-center transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold text-primary mb-4">700+</div>
              <p className="text-muted-foreground">Gallons of water saved</p>
            </div>
            
            <div className="text-center transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold text-primary mb-4">60%</div>
              <p className="text-muted-foreground">Lower carbon footprint</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 relative z-10 bg-rewear-gray/90">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <RewearLogo size="md" className="mb-6 md:mb-0" />
            <div className="flex gap-8">
              <a href="mailto:contact@rewearit.com" className="rewear-link text-muted-foreground hover:text-primary">contact@rewearit.com</a>
              <a href="tel:+918765432190" className="rewear-link text-muted-foreground hover:text-primary">+91 8765 4321 90</a>
              <a href="https://instagram.com/rewearit" className="rewear-link text-muted-foreground hover:text-primary">@rewearit</a>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Rewear It. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Auth Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <AuthForm onSuccess={handleAuthSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
